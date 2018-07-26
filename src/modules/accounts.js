var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');
var crypto = require('crypto');
var ed = require('ed25519');
var bignum = require('../utils/bignum.js');
var TransactionTypes = require('../utils/transaction-types.js');
var Diff = require('../utils/diff.js');
var bip39 = require('bip39');
var util = require('util');
var bacLib = require('bac-lib');

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, shared_1_0 = {};

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
                    maxLength: 32
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

        var address = library.modules.accounts.generateAddressByPubKey(txObj.senderPublicKey);

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
        library.dbClient.query(`INSERT INTO usernames (transactionId, username) VALUES ("${txObj.id}", "${txObj.asset.username.alias}")`, {
            type: Sequelize.QueryTypes.INSERT,
        }).then(() => {
            cb();
        }).catch((err) => {
            cb(err);
        });
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

privated.openAccount = function (secret, cb) {
    // var hash = crypto.createHash('sha256').update(secret, 'utf8').digest();
    // var keypair = ed.MakeKeypair(hash);
    let keypair = library.base.account.getKeypair(secret);

    self.setAccountAndGet({master_pub: keypair.getPublicKeyBuffer().toString('hex')}, cb);
};

// public methods
Accounts.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Accounts.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

// Accounts.prototype.generateAddressByPublicKey = function (publicKey) {
//     var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
//     var temp = new Buffer(8);
//     for (var i = 0; i < 8; i++) {
//         temp[i] = publicKeyHash[7 - i];
//     }
//
//     let address = bignum.fromBuffer(temp).toString() + "L";
//     if (!address) {
//         throw new Error("Invalid public key " + publicKey);
//     }
//
//     return address;
// };

Accounts.prototype.generateAddressByPubKey = function (publicKey) {
    let publicBuffer = Buffer.from(publicKey, 'hex');
    let address = bacLib.bacECpair.fromPublicKeyBuffer(publicBuffer).getAddress();
    return address;
};

Accounts.prototype.getAccount = function (filter, fields, cb) {
    if (filter.master_pub) {
        filter.master_address = self.generateAddressByPubKey(filter.master_pub);
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
            master_address = self.generateAddressByPubKey(fields.master_pub);
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

Accounts.prototype.getAccounts = function (filter, fields, cb) {
    library.base.account.getAll(filter, fields, cb);
};

Accounts.prototype.mergeAccountAndGet = function (fields, cb) {
    var master_address = fields.master_address || null;
    if (master_address === null) {
        if (fields.master_pub) {
            master_address = self.generateAddressByPubKey(fields.master_pub);
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

shared_1_0.getBalance = function(params, cb) {
    let address = params[0];
    let isAddress = /^[0-9]+[L|l]$/g;
    if (!isAddress.test(address)) {
        return cb("Invalid address");
    }
    self.getAccount({master_address: address}, function (err, account) {
        if (err) {
            return cb(err.toString(), 21003);
        }
        var balance = account ? account.balance : 0;
        // var unconfirmedBalance = account ? account.balance_unconfirmed : 0;

        // cb(null, 200, [balance, unconfirmedBalance]);
        cb(null, 200, [balance]);
    });
};

shared_1_0.getPublicKey = function(params, cb) {
    let address = params[0];
    self.getAccount({master_address: address}, function (err, account) {
        if (err) {
            return cb(err.toString(), 11003);
        }
        if (!account || !account.master_pub) {
            return cb("Account does not have a public key", 11000);
        }
        cb(null, 200, account.master_pub);
    });
};

shared_1_0.getAccount = function(params, cb) {
    let address = params[0];
    let uAddress = params[1] || undefined;
    async.waterfall([
        function (cb) {
            if(uAddress) {
                library.dbClient.query(`SELECT * FROM accounts2contacts where accountId = "${uAddress}" and dependentId = "${address}"`, {
                    type: Sequelize.QueryTypes.SELECT
                }).then((data) => {
                    if(data.length > 0) {
                        cb(null, true);
                    } else {
                        cb(null, false);
                    }
                }).catch((err) => {
                    console.log(err);
                    cb(null, false);
                })
            } else {
                cb(null, false);
            }
        }, function (result) {
            self.getAccount({master_address: address}, function (err, account) {
                if (err) {
                    return cb({msg:err.toString(), code:11003});
                }
                if (!account) {
                    return cb({msg:"Account not found", code: 15003});
                }
                cb(null, 200, {
                    account: {
                        address: [account.master_address],
                        username: account.username,
                        unconfirmedBalance: account.balance_unconfirmed,
                        balance: account.balance,
                        publicKey: account.master_pub,
                        secondsign_unconfirmed: account.secondsign_unconfirmed,
                        secondsign: account.secondsign,
                        second_pub: account.second_pub,
                        multisignatures: account.multisignatures,
                        multisignatures_unconfirmed: account.multisignatures_unconfirmed,
                        isFriend: result
                    }
                });
            });
        }
    ], function (err, data) {
        if(err) {
            return cb(err.msg, err.code);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.getUsernameFee = function(params, cb) {
    cb(null, 200, {fee: 100 * constants.fixedPoint});
};

shared_1_0.addUsername = function(params, cb) {
    let query = {
        secret: params[0] || '',
        username: params[1] || '',
        publicKey: params[2] || '',
        secondSecret: params[3] || ''
    };
    if(!(query.secret && query.username && query.publicKey)) {
        return cb('miss must params', 11000);
    }
    let keyPair = library.base.account.getKeypair(query.secret);
    if (query.publicKey) {
        if (keyPair.getPublicKeyBuffer().toString('hex') !== query.publicKey) {
            return cb("Invalid passphrase", 13005);
        }
    }
    library.balancesSequence.add(function (cb) {
        self.getAccount({master_pub: query.publicKey}, function (err, account) {
            if (err) {
                return cb(err.toString(), 11003);
            }
            if (!account || !account.master_pub) {
                return cb("Invalid account", 13007);
            }

            if (account.secondsign && !query.secondSecret) {
                return cb("Invalid second passphrase", 13008);
            }

            var secondKeypair = null;

            if (account.secondsign) {
                var secondHash = crypto.createHash('sha256').update(query.secondSecret, 'utf8').digest();
                secondKeypair = ed.MakeKeypair(secondHash);
            }

            try {
                var transaction = library.base.transaction.create({
                    type: TransactionTypes.USERNAME,
                    username: query.username,
                    sender: account,
                    keypair: keyPair,
                    secondKeypair: secondKeypair
                });
            } catch (e) {
                return cb(e.toString(), 15001);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 15001);
        }

        cb(null, 200, {transaction: transaction[0]});
    });
};

shared_1_0.open = function(params, cb) {
    let secret = params[0] || undefined;
    if(!secret) {
        return cb('params is error', 11000);
    }
    privated.openAccount(secret, function (err, account) {
        var accountData = null;
        if (!err) {
            accountData = {
                address: [account.master_address],
                balance: account.balance,
                publicKey: account.master_pub,
                secondsign_unconfirmed: account.secondsign_unconfirmed,
                secondsign: account.secondsign,
                second_pub: account.second_pub,
                multisignatures: account.multisignatures,
                multisignatures_unconfirmed: account.multisignatures_unconfirmed,
                username: account.username
            };
            return cb(null, 200, {account: accountData});
        } else {
            return cb(err, 15002);
        }
    });
};

// export
module.exports = Accounts;
