var constants = require('../utils/constants.js');
var Sequelize = require('sequelize');
var TransactionTypes = require('../utils/transaction-types.js');
var bacLib = require('bac-lib');
var errorCode = require('../utils/error-code.js');
var crypto = require('crypto');
var ed = require('ed25519');
var async = require('async');
// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {};

function Transfers(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.TRANSFERS, new Transfer());
    setImmediate(cb, null, self);
}

function Transfer() {
    this.calculateFee = function (txObj, sender) {
        return 0.1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.amount = 0;
        txObj.recipientId = data.recipientId;
        txObj.asset.transfer = {
            amount: data.amount,
            assetsHash: data.assets.hash,
            assetsName: data.assets.name,
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.assets, {
            object: true,
            properties: {
                amount: {
                    type: 'number'
                },
                assetsHash: {
                    type: 'string'
                },
                assetsName: {
                    type: 'string'
                }
            },
            required: ['amount', 'assetsHash', 'assetsName']
        });

        if (!report) {
            throw Error("Can't parse signature: " + library.schema.getLastError());
        }
        return txObj;
    };

    this.getBytes = function (txObj) {
        return null;
    };

    this.apply = function (trs, block, sender, cb) {
        // setImmediate(cb);
        let transfer = trs.asset.transfer;
        let amount = transfer.amount;
            async.series([
            function (cb) {
                let tempTransfer = {
                    amount: -transfer.amount,
                    assetsHash: transfer.assetsHash
                };
                library.base.accountAssets.updateAssetBalance(tempTransfer, sender.master_address, cb);
            },
            function (cb) {
                if(trs.recipientId) {
                    library.base.accountAssets.addAssetsBalance(trs.recipientId, transfer, amount, cb);
                } else {
                    library.base.accountAssets.burnAssetsBalance(trs.senderId, transfer.assetsHash, transfer.amount, cb);
                }
            }
        ], cb);
    };

    this.undo = function (trs, block, sender, cb) {
        let transfer = trs.asset.transfer;
        async.series([
            function (cb) {
                library.base.accountAssets.updateAssetBalance(transfer, sender.master_address, cb);
            },
            function (cb) {
                library.base.accountAssets.updateAssetBalance({assetsHash: transfer.assetsHash, amount: -transfer.amount}, trs.recipientId, cb);
            }
        ], cb);
    };

    this.applyUnconfirmed = function (trs, sender, cb) {
        setImmediate(cb);
    };

    this.undoUnconfirmed = function (trs, sender, cb) {
        setImmediate(cb);
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.load = function (raw) {
        if(!(raw.tr_amount || raw.tr_assetsHash || raw.tr_assetsName)) {
            return null;
        }
        let transfer = {
            amount: raw.tr_amount,
            assetsHash: raw.tr_assetsHash,
            assetsName: raw.tr_assetsName
        };

        return {transfer: transfer};
    };

    this.save = function (trs, cb) {
        let transfer = trs.asset.transfer;
        library.dbClient.query('INSERT INTO transfers(`assetsHash`, `assets_name`, `amount`, `transactionHash`) VALUES($assetsHash, $assetsName, $amount, $transactionHash)', {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                assetsHash: transfer.assetsHash,
                assetsName: transfer.assetsName,
                amount: transfer.amount,
                transactionHash: trs.hash
            }
        }).then(() => {
            cb()
        }).catch((err) => {
            cb(err);
        });
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.asset.transfer) {
            return setImmediate(cb, "Invalid transaction asset")
        }

        if (!txObj.recipientId.match(/^[B]+[A-Za-z|0-9]{33}$/)) {
            return cb("Invalid recipient master_address");
        }

        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }

        let transfer = txObj.asset.transfer;

        if(transfer.amount <= 0) {
            return cb("Invalid transaction amount");
        }

        setImmediate(cb, null, txObj);
    };

    this.ready = function (txObj, sender) {
        if (sender.multisignatures) {
            if (!txObj.signatures) {
                return false;
            }

            return txObj.signatures.length >= sender.multisign - 1;
        } else {
            return true;
        }
    }
}

// Events
Transfers.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Transfers.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

shared_1_0.addTransfers = function(params, cb) {
    let amount = params[0] || 0;
    let recipientId = params[1] || '';
    let mnemonic = params[2] || '';
    let assetsHash = params[3] || '';
    let msg = params[4] || '';
    let secondSecret = params[5] || undefined;
    let multisigAccountPublicKey = params[6] || undefined;

    if(!(amount && recipientId && mnemonic && assetsHash)) {
        return cb("miss must params", 11000);
    }
    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    let query = {};
    let isAddress = /^[B]+[A-Za-z|0-9]{33}$/;
    if (isAddress.test(recipientId)) {
        query.master_address = recipientId;
    } else {
        query.username = recipientId;
    }
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, recipient) {
            if(err) {
                return cb(err.toString(), 11000);
            }
            if (!recipient && query.username) {
                return cb("Recipient not found", 13006);
            }
            recipientId = recipient ? recipient.master_address : query.master_address;
            library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
                if(err) {
                    return cb(err.toString(), 11000);
                }
                if(!account || !account.master_pub) {
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
                library.modules.assets.getAssets(assetsHash, function (err, assets) {
                    if(err) {
                        return cb(err, 11000);
                    } else {
                        try {
                            var transaction = library.base.transaction.create({
                                type: TransactionTypes.TRANSFERS,
                                amount: amount,
                                sender: account,
                                recipientId: recipientId,
                                keypair: keyPair,
                                secondKeypair: secondKeypair,
                                message: msg,
                                assets: assets
                            });
                        } catch (e) {
                            return cb(e.toString(), 13009);
                        }
                        library.modules.transactions.receiveTransactions([transaction], cb);
                    }
                });
            });
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash});
    });
};

module.exports = Transfers;