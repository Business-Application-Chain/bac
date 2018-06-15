var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');
var crypto = require('crypto');
var ed = require('ed25519');
var bignum = require('../utils/bignum.js');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var Diff = require('../utils/diff.js');
var bitcoinJs = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
var bip39 = require('bip39');
var util = require('util');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Vote() {

    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = data.sender.master_address;
        txObj.recipientUsername = data.sender.username;
        txObj.votes = data.votes;

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset, {
            type: 'object',
            properties: {
                votes: {
                    type: 'array',
                    minLength: 1,
                    maxLength: 105,
                    uniqueItems: true
                }
            },
            required: ['votes']
        });

        if (!report) {
            throw new Error("Incorrect votes in transactions: " + library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        try {
            var buf = txObj.asset.votes ? new Buffer(txObj.asset.votes.join(''), 'utf8') : null;
        } catch (err) {
            throw new Error(err.toString());
        }

        return buf;
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multisign_min - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (txObj.recipientId != txObj.senderId) {
            return setImmediate(cb, "Recipient is identical to sender");
        }

        if (!txObj.asset.votes || !txObj.asset.votes.length) {
            return setImmediate(cb, "Not enough spare votes available");
        }

        if (txObj.asset.votes && txObj.asset.votes.length > 33) {
            return setImmediate(cb, "Voting limited exceeded. Maximum is 33 per transaction");
        }

        library.modules.delegates.checkDelegate(txObj.senderPublicKey, txObj.asset.votes, function (err) {
            setImmediate(cb, err, txObj);
        });
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        this.scope.account.merge(sender.master_address, {
            delegates: txObj.asset.votes,
            blockId: blockObj.id,
            round: library.modules.round.calc(blockObj.height)
        }, function (err) {
            cb(err);
        });
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        if (txObj.asset.votes === null) return cb();

        var votesInvert = Diff.reverse(txObj.asset.votes);

        this.scope.account.merge(sender.master_address, {
            delegates: votesInvert,
            blockId: blockObj.id,
            round: library.modules.round.calc(blockObj.height)
        }, function (err) {
            cb(err);
        });
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        library.modules.delegates.checkUnconfirmedDelegates(txObj.senderPublicKey, txObj.asset.votes, function (err) {
            if (err) {
                return setImmediate(cb, err);
            }

            this.scope.account.merge(sender.master_address, {
                delegates_unconfirmed: txObj.asset.votes
            }, function (err) {
                cb(err);
            });
        }.bind(this));
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        if (txObj.asset.votes === null) return cb();

        var votesInvert = Diff.reverse(txObj.asset.votes);

        this.scope.account.merge(sender.master_address, {delegates_unconfirmed: votesInvert}, function (err) {
            cb(err);
        });
    };

    this.load = function (raw) {
        if (!raw.v_votes) {
            return null;
        } else {
            var votes = raw.v_votes.split(',');

            return {votes: votes};
        }
    };

    this.save = function (txObj, cb) {

        library.dbClient.query("INSERT INTO votes (transactionId, votes) VALUES ($transactionId, $votes)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                votes: util.isArray(txObj.asset.votes) ? txObj.asset.votes.join(',') : null
            }
        }).then(function (rows) {
            console.log(txObj.id+": "+rows);
            cb();
        }, function (err) {
            console.log(err.toString());
        });
    };
}

function Username() {

    this.calculateFee = function (txObj, sender) {
        return 100 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.username = {
            alias: data.username,
            publicKey: data.sender.master_pub
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.username, {
            type: 'object',
            properties: {
                alias: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 20
                },
                publicKey: {
                    type: 'string',
                    // format: 'publicKey'
                }
            },
            required: ['alias', 'publicKey']
        });

        if (!report) {
            throw new Error(library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        try {
            var buf = new Buffer(txObj.asset.username.alias, 'utf8');
        } catch (err) {
            throw new Error(err.toString());
        }

        return buf;
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures) {
            if (!txObj.signatures) {
                return false;
            }
            return txObj.signatures.length >= sender.multisign_min - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (txObj.recipientId) {
            return setImmediate(cb, "Invalid recipient");
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        if (!txObj.asset.username.alias) {
            return setImmediate(cb, "Invalid transaction asset");
        }

        var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
        if (!allowSymbols.test(txObj.asset.username.alias.toLowerCase())) {
            return setImmediate(cb, "Username must only contain alphanumeric characters (with the exception of !@$&_)");
        }

        var isAddress = /^[0-9]+[L|l]$/g;
        if (isAddress.test(txObj.asset.username.alias.toLowerCase())) {
            return setImmediate(cb, "Username cannot be a potential address");
        }

        if (txObj.asset.username.alias.length === 0 || txObj.asset.username.alias.length > 20) {
            return setImmediate(cb, "Invalid username length. Must be between 1 to 20 characters");
        }

        self.getAccount({
            $or: {
                username: txObj.asset.username.alias,
                username_unconfirmed: txObj.asset.username.alias
            }
        }, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (account && account.username == txObj.asset.username.alias) {
                return cb("Username already exists");
            }
            if (sender.username && sender.username != txObj.asset.username.alias) {
                return cb("Invalid username. Does not match transaction asset");
            }
            if (sender.username_unconfirmed && sender.username_unconfirmed != txObj.asset.username.alias) {
                return cb("Account already has a username");
            }

            cb(null, txObj);
        });
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        self.setAccountAndGet({
            master_address: sender.master_address,
            username: txObj.asset.username.alias,
            username_unconfirmed: null,
            name_exist: 1,
            name_exist_unconfirmed: 0
        }, cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        self.setAccountAndGet({
            master_address: sender.master_address,
            username: null,
            username_unconfirmed: txObj.asset.username.alias,
            name_exist: 0,
            name_exist_unconfirmed: 1
        }, cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        if (sender.username || sender.username_unconfirmed) {
            return setImmediate(cb, "Account is already has a username");
        }

        var address = library.modules.accounts.generateAddressByPublicKey(txObj.senderPublicKey);

        self.getAccount({
            $or: {
                username_unconfirmed: txObj.asset.username.alias,
                master_address: address
            }
        }, function (err, account) {
            if (err) {
                return cb(err);
            }
            if (account && account.username_unconfirmed) {
                return cb("Username is already existed");
            }

            self.setAccountAndGet({
                master_address: sender.master_address,
                username_unconfirmed: txObj.asset.username.alias,
                name_exist_unconfirmed: 1
            }, cb);
        })
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        self.setAccountAndGet({
            master_address: sender.master_address,
            username_unconfirmed: null,
            name_exist_unconfirmed: 0
        }, cb);
    };

    this.load = function (raw) {
        if (!raw.u_alias) {
            return null;
        } else {
            var username = {
                alias: raw.u_alias,
                publicKey: raw.t_senderPublicKey
            }

            return {username: username};
        }
    };

    this.save = function (txObj, cb) {
        library.dbClient.query("INSERT INTO usernames (transactionId, username) VALUES ($transactionId, $username)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                transactionId: txObj.id,
                username: txObj.asset.username.alias
            }
        }, cb);
    };
}

// constructor
function Accounts(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.VOTE, new Vote());
    library.base.transaction.attachAssetType(TransactionTypes.USERNAME, new Username());

    setImmediate(cb, null, self);
}

// private methods
privated.generateMnemonic = function () {
    var mnemonic = bip39.generateMnemonic();
    return mnemonic.toString('hex');
};

privated.openAccount = function (mnemonic, cb) {
    var seed = bip39.mnemonicToSeed(mnemonic);
    var node = bitcoinjs.HDNode.fromSeedHex(seed);
    var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
    var privateKey = keyPair.d.toBuffer(32);
    var hash = crypto.createHash('sha256').update(privateKey.toString('hex'), 'utf8').digest();
    var keypair = ed.MakeKeypair(hash);

    self.setAccountAndGet({master_pub: keypair.publicKey.toString('hex')}, cb);
};

// public methods
Accounts.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Accounts.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Accounts.prototype.generateAddressByPublicKey = function (publicKey) {
    var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
    var temp = new Buffer(8);
    for (var i = 0; i < 8; i++) {
        temp[i] = publicKeyHash[7 - i];
    }

    var address = bignum.fromBuffer(temp).toString() + "L";
    if (!address) {
        throw new Error("Invalid public key " + publicKey);
    }

    return address;
};

Accounts.prototype.getAccount = function (filter, fields, cb) {
    if (filter.master_pub) {
        filter.master_address = self.generateAddressByPublicKey(filter.master_pub);
        delete filter.master_pub;
    }

    library.base.account.findOne(filter, fields, cb);
};

Accounts.prototype.getAccountAll = function (filter, fields, cb) {
    library.base.account.findAll(filter, fields, cb);
};

Accounts.prototype.setAccountAndGet = function (fields, cb) {
    var master_address = fields.master_address || null;
    if (master_address === null) {
        if (fields.master_pub) {
            master_address = self.generateAddressByPublicKey(fields.master_pub);
        } else {
            return cb("Missing master_address and master_pub");
        }
    }
    if (!master_address) {
        throw cb("Invalid master_pub value");
    }
    library.base.account.insertOrUpdate(master_address, fields, function (err) {
        if (err) {
            return cb(err);
        }
        library.base.account.findOne({master_address: master_address}, cb);
    });
};

Accounts.prototype.mergeAccountAndGet = function (fields, cb) {
    var master_address = fields.master_address || null;
    if (master_address === null) {
        if (fields.master_pub) {
            master_address = self.generateAddressByPublicKey(fields.master_pub);
        } else {
            return cb("Missing master_address and master_pub");
        }
    }
    if (!master_address) {
        throw cb("Invalid master_pub value");
    }
    library.base.account.merge(master_address, fields, cb);
};

// Events
Accounts.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Accounts;
