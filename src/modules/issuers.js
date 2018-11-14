var TransactionTypes = require('../utils/transaction-types.js');
var constants = require('../utils/constants.js');
var crypto = require('crypto');
var Sequelize = require('sequelize');
var bip39 = require('bip39');
var bacLib = require('bac-lib');
var library, self, privated = {}, shared_1_0 = {};

function Issuer() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        let mnemonic = bip39.generateMnemonic();
        let keyPair = library.base.account.getKeypair(mnemonic);
        let address = bacLib.bacECpair.fromPublicKeyBuffer(keyPair.getPublicKeyBuffer()).getAddress();
        txObj.asset.issuers = {
            name: data.name,
            desc: data.desc,
            issuersAddress: address
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.issuers, {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                },
                desc: {
                    type: 'string'
                },
                issuersAddress: {
                    type: 'string'
                }
            },
            required: ['name', 'desc', 'issuersAddress']
        });

        if (!report) {
            throw new Error(library.schema.getLastError());
        }

        return txObj;
    };

    this.getBytes = function (txObj) {
        return null;
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
        if (!txObj.asset.issuers) {
            return setImmediate(cb, "Invalid transaction issuers")
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }
        setImmediate(cb, null, txObj);
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        setImmediate(cb);
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        setImmediate(cb);
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.load = function (raw) {
        if(!(raw.i_issuersAddress)) {
            return null;
        }
        let issuers = {
            name: raw.i_name,
            desc: raw.i_desc,
            issuersAddress: raw.i_issuersAddress,
        };

        return {issuers: issuers};
    };

    this.save = function (txObj, cb) {
        let issuers = txObj.asset.issuers;
        library.dbClient.query("INSERT INTO dapp2issuers(`issuersAddress`, `accountId`, `name`, `desc`, `timestamp`, `transactionHash`) VALUES ($issuersAddress, $accountId, $name, $desc, $timestamp, $transactionHash)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                issuersAddress: issuers.issuersAddress,
                accountId: txObj.senderId,
                name: issuers.name,
                desc: issuers.desc,
                timestamp: Date.now(),
                transactionHash: txObj.hash
            }
        }).then(() => {
            cb();0
        }).catch((err) => {
            cb(err);
        });
    };
}

function Issuers(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.ISSUERS, new Issuer());
    setImmediate(cb, null, self);
}

privated.getUserIssuers = function(accountId, cb) {
    library.dbClient.query('SELECT * FROM dapp2issuers WHERE `accountId`=$accountId', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            accountId: accountId
        }
    }).then((rows) => {
        if(rows[0]) {
            cb("该用户已经是受托人了");
        } else {
            setImmediate(cb);
        }
    }).catch((err) => {
        setImmediate(cb, err);
    });
};

Issuers.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

shared_1_0.createIssuers = function(params, cb) {
    let mnemonic = params[0] || '';
    let name = params[1] || '';
    let desc = params[2] || '';
    let secondSecret = params[3] || '';

    if(!(mnemonic && name)) {
        return cb("miss must params", 11000);
    }

    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    let query = {
        master_pub: publicKey
    };
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, account) {
            if (err) {
                return cb(err.toString(), 11003);
            }
            if (!account || !account.master_pub) {
                return cb("Invalid account", 13007);
            }
            if (account.secondsign && !secondSecret) {
                return cb("Invalid second passphrase", 13008);
            }
            var secondKeypair = null;
            if (account.secondsign) {
                var secondHash = crypto.createHash('sha256').update(secondSecret, 'utf8').digest();
                secondKeypair = ed.MakeKeypair(secondHash);
            }
            let lastHeight = library.modules.blocks.getLastBlock().height;
            if(account.lockHeight > lastHeight) {
                return cb("Account is locked", 11000);
            }
            privated.getUserIssuers(account.master_address, function (err) {
                if(err) {
                    cb(err, 11000);
                } else {
                    try {
                        var transaction = library.base.transaction.create({
                            type: TransactionTypes.ISSUERS,
                            name: name,
                            desc: desc,
                            sender: account,
                            keypair: keyPair,
                            secondKeypair: secondKeypair
                        });
                    } catch (e) {
                        return cb(e.toString(), 15001);
                    }
                    library.modules.transactions.receiveTransactions([transaction], cb);
                }
            });
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash});
    })
};

module.exports = Issuers;