var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');
var TransactionTypes = require('../utils/transaction-types.js');
var util = require('util');
var shuffle = require('knuth-shuffle').knuthShuffle;
var ed = require('ed25519');
var slots = require('../utils/slots.js');

require('array.prototype.find'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Delegate() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.delegate = {
            username: data.username || data.sender.username,
            publicKey: data.sender.publicKey
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.delegate, {
            type: 'object',
            properties: {
                publicKey: {
                    type: 'string',
                    format: 'publicKey'
                }
            },
            required: ['publicKey']
        });

        if (!report) {
            throw new Error("Can't verify delegate transaction, incorrect parameters: ", library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        if (!txObj.asset.delegate.username) {
            return null;
        }

        try {
            var usernameBuffer = new Buffer(txObj.asset.delegate.username, 'utf8');
        } catch (err) {
            throw new Error(err.toString());
        }

        return usernameBuffer;
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures.length) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multimin - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null ,txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (txObj.recipientId) {
            return setImmediate(cb, "Invalid recipient");
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        if (!sender.username) {
            if (!txObj.asset.delegate.username) {
                return setImmediate(cb, "Invalid transaction asset");
            }

            var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
            if (!allowSymbols.test(txObj.asset.delegate.username.toLowerCase())) {
                return setImmediate(cb, "Username contains invalid characters");
            }

            var isAddress = /^[0-9]+[L|l]$/g;
            if (isAddress.test(txObj.asset.delegate.username)) {
                return setImmediate(cb, "Username cannot be a potential address");
            }

            if (txObj.asset.delegate.username.length < 1) {
                return setImmediate(cb, "Username is too short. Minimum is 1 character");
            }

            if (txObj.asset.delegate.username.length > 20) {
                return setImmediate(cb, "Username is too long. Maximum is 20 characters");
            }
        } else {
            if (txObj.asset.delegate.username && txObj.asset.delegate.username != sender.username) {
                return cb("Account is already has a username");
            }
        }

        if (sender.isDelegate) {
            return cb("Account is already been a delegate");
        }

        if (sender.username) {
            return cb(null, txObj);
        }

        library.modules.accounts.getAccount({
            username: txObj.asset.delegate.username
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            if (account) {
                return cb("Username is already existed");
            }

            cb(null, txObj);
        })
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 1,
            isDelegate_unconfirmed: 0,
            vote: 0
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username_unconfirmed = null;
            data.username = txObj.asset.delegate.username;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 0,
            isDelegate_unconfirmed: 1
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username = null;
            data.username_unconfirmed = txObj.asset.delegate.username;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        if (sender.username_unconfirmed && txObj.asset.delegate.username && txObj.asset.delegate.username != sender.username_unconfirmed) {
            return cb("Account is already has a username");
        }

        if (sender.isDelegate_unconfirmed) {
            return cb("Account is already been a delegate");
        }

        function done() {
            var data = {
                master_address: sender.master_address,
                isDelegate_unconfirmed: 1,
                isDelegate: 0
            };

            if (!sender.name_exist && txObj.asset.delegate.username) {
                data.username = null;
                data.username_unconfirmed = txObj.asset.delegate.username;
            }

            library.modules.accounts.setAccountAndGet(data, cb);
        }

        if (sender.username) {
            return done();
        }

        library.modules.accounts.getAccount({
            name_unconfirmed: txObj.asset.delegate.username
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            if (account) {
                return cb("Username is already existed");
            }

            done();
        });
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        var data = {
            master_address: sender.master_address,
            isDelegate: 0,
            isDelegate_unconfirmed: 0
        };

        if (!sender.name_exist && txObj.asset.delegate.username) {
            data.username = null;
            data.username_unconfirmed = null;
        }

        library.modules.accounts.setAccountAndGet(data, cb);
    };

    this.load = function (raw) {
        if (!raw.d_username) {
            return null;
        } else {
            var delegate = {
                username: raw.d_username,
                publicKey: raw.t_senderPublicKey,
                master_address: raw.t_senderId
            };

            return {delegate: delegate};
        }
    };

    this.save = function (txObj, cb) {
        library.dbClient.query("INSERT INTO delegates (transactionId, username) VALUES ($transactionId, $username)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                username: txObj.asset.delegate.username
            }
        }).then(function (rows) {
            cb();
        }, function (err) {
            cb(err, undefined);
        });
    };
}

// constructor
function Delegates(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.attachApi();

    library.base.transaction.attachAssetType(TransactionTypes.DELEGATE, new Delegate());

    setImmediate(cb, null, self);
}

// private methods
privated.attachApi = function () {
    library.network.app.use(function (req, res, next) {
        if (modules_loaded) return next();
        res.status(500).send({success: false, error: "Blockchain is loading"});
    });

};

privated.getKeysSortByVote = function (cb) {
    library.modules.accounts.getAccount({
        isDelegate: 1,
        sort: {"vote": -1, "publicKey": 1},
        limit: constants.delegates
    }, ["publicKey"], function (err, rows) {
        if (err) {
            cb(err);
        }
        cb();
    });
};

privated.getBlockSlotData = function (slot, height, cb) {
    self.generateDelegateList(height, function (err, activeDelegates) {
        if (err) {
            return cb(err);
        }
        var currentSlot = slot;
        var lastSlot = slots.getLastSlot(currentSlot);

        for (; currentSlot < lastSlot; currentSlot += 1) {
            var delegate_pos = currentSlot % constants.delegates;

            var delegate_id = activeDelegates[delegate_pos];

            if (delegate_id && privated.keypairs[delegate_id]) {
                return cb(null, {time: slots.getSlotTime(currentSlot), keypair: privated.keypairs[delegate_id]});
            }
        }
        cb(null, null);
    });
};

//
privated.loop = function (cb) {
    if (!Object.keys(privated.keypairs).length) {
        library.log.Debug("Loop", "Error", "exit: no delegates");
        return setImmediate(cb);
    }

    if (!privated.loaded || library.modules.loader.syncing() || !library.modules.round.loaded()) {
        library.log.Debug("Loop", "Error", "exit: syncing");
        return setImmediate(cb);
    }

    var currentSlot = slots.getSlotNumber();
    var lastBlock = library.modules.blocks.getLastBlock();

    if (currentSlot == slots.getSlotNumber(lastBlock.timestamp)) {
        library.log.Debug("Loop", "Error", "exit: lastBlock is in the same slot");
        return setImmediate(cb);
    }

    privated.getBlockSlotData(currentSlot, lastBlock.height + 1, function (err, currentBlockData) {
        if (err || currentBlockData === null) {
            library.log.Info("Loop " + "skipping slot");
            return setImmediate(cb);
        }

        library.mainWorkQueue.add(function (cb) {
            if (slots.getSlotNumber(currentBlockData.time) == slots.getSlotNumber()) {
                library.modules.blocks.generateBlock(currentBlockData.keypair, currentBlockData.time, function (err) {
                    library.log.Info("Round " + library.modules.round.calc(library.modules.blocks.getLastBlock().height) + " new block id: " + library.modules.block.getLastBlock().id + " height: " + library.modules.blocks.height + " slot: " + slots.getSlotNumber(currentBlockData.time) + " reward: " + library.modules.blocks.getLastBlock().reward);
                    cb(err);
                });
            } else {
                //library.log.Debug("Loop", "Error", "exit: " + _activeDelegates[slots.getSlotNumber() % constants.delegates] + " delegate slot");
                return setImmediate(cb);
            }
        }, function (err) {
            if (err) {
                library.log.Error("Failed to get block slot data", "Error", err.toString());
            }
            setImmediate(cb);
        });
    });
};

privated.loadMyDelegates = function (cb) {
    var secrets = null;
    if (library.config.forging.secret) {
        secrets = util.isArray(library.config.forging.secret) ? library.config.forging.secret : [library.config.forging.secret];
    }

    async.eachSeries(secrets, function (secret, cb) {
        var keypair = ed.MakeKeypair(crypto.createHash('sha256').update(secret, 'utf8').digest());

        library.modules.accounts.getAccount({
            master_pub: keypair.publicKey.toString('hex')
        }, function (err, account) {
            if (err) {
                return cb(err);
            }

            if (!account) {
                return cb("Account " + keypair.publicKey.toString('hex') + " not found");
            }

            if (account.isDelegate) {
                privated.keypairs[keypair.publicKey.toString('hex')] == keypair;
                library.log.Info("Forging enabled on account: " + account.address);
            } else {
                library.log.Error("Delegate with this public key not found: " + keypair.publicKey.toString('hex'));
            }
            cb();
        });
    }, cb);
};

// public methods
Delegates.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Delegates.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Delegates.prototype.generateDelegateList = function (height, cb) {

    privated.getKeysSortByVote(function (err, trucDelegateList) {
        if (err) {
            return cb(err);
        }
        var seedSource = library.modules.round.calc(height).toString();

        var currentSeed = crypto.createHash('sha256').update(seedSource, 'utf8').digest();
        for (var i = 0, delCount = trucDelegateList.length; i < delCount; i++) {
            for (var x = 0; x < 4 && i < delCount; i++, x++) {
                var newIndex = currentSeed[x] % delCount;
                var b = trucDelegateList[newIndex];
                trucDelegateList[newIndex] = trucDelegateList[i];
                trucDelegateList[i] = b;
            }
            currentSeed = crypto.createHash('sha256').update(currentSeed).digest();
        }

        cb(null, trucDelegateList);
    });
};

Delegates.prototype.checkDelegates = function (publicKey, votes, cb) {
    if (util.isArray(votes)) {
        library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (!account) {
                return cb("Account not found");
            }

            async.eachSeries(votes, function (action ,cb) {
                var math = action[0];

                if (math !== '+' && math !== '-') {
                    return cb("Invalid math operator");
                }

                var publicKey = action.slice(1);

                try {
                    new Buffer(publicKey, "hex");
                } catch (e) {
                    return cb("Invalid public key");
                }

                if (math == "+" && (account.delegates !== null && account.delegates.indexOf(publicKey) != -1)) {
                    return cb("Failed to add vote, account has already voted for this delegate");
                }
                if (math == "-" && (account.delegates === null || account.delegates.indexOf(publicKey) === -1)) {
                    return cb("Failed to remove vote, account has not voted for this delegate");
                }

                library.modules.accounts.getAccount({master_pub: publicKey, isDelegate: 1}, function (err, account) {
                    if (err) {
                        return cb(err);
                    }

                    if (!account) {
                        return cb("Delegate not found");
                    }

                    cb();
                }, cb);
            })
        });
    } else {
        setImmediate(cb, "Please provide an array of votes");
    }
};

Delegates.prototype.checkUnconfirmedDelegates = function (publicKey, votes, cb) {
    if (util.isArray(votes)) {
        library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (!account) {
                return cb("Account not found");
            }

            async.eachSeries(votes, function (action ,cb) {
                var math = action[0];

                if (math !== '+' && math !== '-') {
                    return cb("Invalid math operator");
                }

                var publicKey = action.slice(1);

                if (math == "+" && (account.delegates_unconfirmed !== null && account.delegates_unconfirmed.indexOf(publicKey) != -1)) {
                    return cb("Failed to add vote, account has already voted for this delgate");
                }
                if (math == "-" && (account.delegates_unconfirmed === null || account.delegates_unconfirmed.indexOf(publicKey) === -1)) {
                    return cb("Failed to remove vote, account has not voted for this delegate");
                }

                library.modules.accounts.getAccount({master_pub: publicKey, isDelegate: 1}, function (err, account) {
                    if (err) {
                        return cb(err);
                    }

                    if (!account) {
                        return cb("Delegate not found account");
                    }

                    cb();
                });
            }, cb);
        });
    } else {
        return setImmediate(cb, "Please provide an array of votes");
    }
};

Delegates.prototype.fork = function (block, cause) {
    library.log.Info("Fork", "Message", JSON.stringify({
        delegate: block.generatorPublicKey,
        block: {id: block.id, timestamp: block.timestamp, height: block.height, previousBlock: block.previousBlock},
        cause: cause
    }));
    library.dbClient.query("INSERT INTO forks_stat (delegatePublicKey, blockTimestamp, blockId, blockHeight, previousBlock, cause) " +
        "VALUES ($delegatePublicKey, $blockTimestamp, $blockId, $blockHeight, $previousBlock, $cause);", {
        delegatePublicKey: block.generatorPublicKey,
        blockTimestamp: block.timestamp,
        blockId: block.id,
        blockHeight: block.height,
        previousBlock: block.previousBlock,
        cause: cause
    });
};

Delegates.prototype.validateBlockSlot = function (block, cb) {
    self.generateDelegateList(block.height, function (err, activeDelegates) {
        if (err) {
            return cb(err);
        }
        var currentSlot = slots.getSlotNumber(block.timestamp);
        var delegate_id = activeDelegates[currentSlot % constants.delegates];

        if (delegate_id && block.generatorPublicKey == delegate_id) {
            return cb();
        } else {
            library.log.Error("Expected generator: " + delegate_id + " Received generator: " + block.generatorPublicKey);
            return cb("Failed to verify slot: " + currentSlot);
        }
    });
};

// Events
Delegates.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Delegates.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Delegates.prototype.onEnd = function (cb) {
    privated.loaded = false;
    cb();
};

// export
module.exports = Delegates;
