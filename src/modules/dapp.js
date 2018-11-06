var TransactionTypes = require('../utils/transaction-types.js');
var constants = require('../utils/constants.js');
var crypto = require('crypto');
var Sequelize = require('sequelize');
var bip39 = require('bip39');
var bacLib = require('bac-lib');
var hashMap = require('hashmap');
var library, self, privated = {}, shared_1_0 = {};

function Dapp() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        let mnemonic = bip39.generateMnemonic();
        let keyPair = library.base.account.getKeypair(mnemonic);
        let address = bacLib.bacECpair.fromPublicKeyBuffer(keyPair.getPublicKeyBuffer()).getAddress();
        txObj.asset.dapp = {
            hash: address
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.dapp, {
            type: 'object',
            properties: {
                hash: {
                    type: 'string'
                }
            },
            required: ['hash']
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
        if (!txObj.asset.dapp) {
            return setImmediate(cb, "Invalid transaction dapp")
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
        if(!(raw.da_hash)) {
            return null;
        }
        let dapp = {
            hash: raw.da_hash
        };

        return {dapp: dapp};
    };

    this.save = function (txObj, cb) {
        library.buna.buna.createContract(txObj, function (err, dappData) {
            if(err) {
                return cb(err);
            }
            if(dappData.data.name && dappData.data.symbol && dappData.data.decimals && dappData.data.totalAmount) {
                let dapp = txObj.asset.dapp;
                return library.dbClient.query("INSERT INTO dapp2assets(`hash`, `name`, `symbol`, `decimals`, `totalAmount`, `transactionHash`, `createTime`, `accountId`, `others`, `contract`) VALUES ($hash, $name, $symbol, $decimals, $totalAmount, $transactionHash, $createTime, $accountId, $others, $contract)", {
                    type: Sequelize.QueryTypes.INSERT,
                    bind: {
                        hash: dapp.hash,
                        name: dappData.data.name,
                        symbol: dappData.data.symbol,
                        description: dappData.data.description,
                        decimals: dappData.data.decimals,
                        totalAmount: dappData.data.totalAmount,
                        transactionHash: txObj.hash,
                        createTime: txObj.timestamp,
                        accountId: txObj.senderId,
                        contract: txObj.message,
                        others: dappData.data.others
                    },
                }).then(() => {
                    return library.base.accountAssets.addDappBalance(txObj.senderId, {dappHash: dapp.hash, name: dappData.data.name, symbol: dappData.data.symbol, others: dappData.data.others}, dappData.data.totalAmount);
                }).then(() => {
                    cb();
                }).catch((err) => {
                    cb(err);
                });
            } else {
                return cb("dappData miss params");
            }
        });
    };
}

function DoDapp() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.amount = 0;
        let _params = {};
        data.params.forEach((item) => {
            // _params.push({item: typeof item});
            _params[item] = typeof item;
        });
        txObj.asset.doDapp = {
            params: JSON.stringify(_params),
            fun: data.fun,
            dappHash: data.dappHash
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.dapp, {
            type: 'object',
            properties: {
                params: {
                    type: 'string'
                },
                fun: {
                    type: 'string',
                },
                dappHash: {
                    type: 'string'
                }
            },
            required: ['params', 'fun', 'dappHash']
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
        if (!txObj.asset.doDapp) {
            return setImmediate(cb, "Invalid transaction dapp")
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
        if(!(raw.do_dappHash || raw.do_fun || raw.do_params)) {
            return null;
        }
        let doDapp = {
            params: raw.do_params,
            fun: raw.do_fun,
            dappHash: raw.do_dappHash,
        };
        return {doDapp: doDapp};
    };

    this.save = function (txObj, cb) {
        let doDapp = txObj.asset.doDapp;
        library.dbClient.query("SELECT * FROM dapp2assets WHERE hash=$hash", {
            type: Sequelize.QueryTypes.SELECT,
            bind: {hash: doDapp.dappHash}
        }).then((rows) => {
            if(rows[0]) {
                if(rows[0].name && rows[0].symbol && rows[0].decimals && rows[0].totalAmount) {
                    return library.dbClient.query("INSERT INTO dapp2assets_handle(`dappHash`, `transactionHash`, `fun`, `params`, `timestamp`, `accountId`) VALUES ($dappHash, $transactionHash, $fun, $params, $timestamp, $accountId)", {
                        type: Sequelize.QueryTypes.INSERT,
                        bind: {
                            dappHash: doDapp.dappHash,
                            transactionHash: txObj.hash,
                            timestamp: txObj.timestamp,
                            accountId: txObj.senderId,
                            fun: doDapp.fun,
                            params: doDapp.params
                        },
                    }).then(() => {
                        return library.base.accountAssets.getDappBalances(doDapp.dappHash);
                    }).then((rows) => {
                        if(rows.length === 0)
                            return cb("dapp hash is error");
                        let balances = {};
                        let statuses = {};
                        let dappHash = rows[0].dappHash;
                        let fun = doDapp.fun;
                        let params = [];
                        let jsonParams = JSON.parse(doDapp.params);
                        let keys = Object.keys(jsonParams);
                        keys.forEach((item) => {
                            if(jsonParams[item] === "number") {
                                params.push(parseInt(item));
                            } else {
                                balances[item] = 0;
                                params.push(item.toString());
                            }
                            statuses[item] = JSON.parse(rows[0].defaultOthers);
                        });
                        rows.forEach(function (row) {
                            balances[row.accountId] = row.balance;
                            statuses[row.accountId] = JSON.parse(row.others);
                        });
                        let data = library.buna.buna.doBunaHandle({from: txObj.senderId, admin: rows[0].dappAdmin}, dappHash, balances, statuses, fun, params);
                        if(data.type === 1)
                            return library.base.accountAssets.upDateDappBalances(data.data, dappHash);
                        if(data.type === 2) {
                            return library.base.accountAssets.upDateDappStatuses(data.data, dappHash);
                        }
                        setImmediate(cb, "newBalance is false");
                    }).then(() => {
                        setImmediate(cb);
                    }).catch((err) => {
                        cb(err);
                    });
                } else {
                    return cb("dappData miss params");
                }
            } else {
                return cb("dappData miss params");
            }
        });
    };
}

function Dapps(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.DAPP, new Dapp());
    library.base.transaction.attachAssetType(TransactionTypes.DO_DAPP, new DoDapp());
    setImmediate(cb, null, self);
}

Dapps.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

shared_1_0.upDateDapp = function(params, cb) {
    let mnemonic = params[0] || '';
    let secondSecret = params[1] || '';
    let msg = params[2] || '';

    if(!(mnemonic && msg)) {
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
            let lastBlock = library.modules.blocks.getLastBlock();
            let lastBlockHeight = lastBlock.height;
            if(account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            try {
                var transaction = library.base.transaction.create({
                    type: TransactionTypes.DAPP,
                    sender: account,
                    message: msg,
                    keypair: keyPair,
                    secondKeypair: secondKeypair,
                });
            } catch (e) {
                return cb(e.toString(), 13009);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash, dappHash: transaction[0].asset.dapp.hash});
    })
};

shared_1_0.handleDapp = function(params, cb) {
    let mnemonic = params[0] || '';
    let dappHash = params[1] || '';
    let fun = params[2] || '';
    let param = params[3] || [];
    let secondSecret = params[4] || '';

    if(!(mnemonic || fun || dappHash || recipientId)) {
        return cb("miss must params", 11000);
    }
    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount({master_pub: publicKey}, function (err, account) {
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
            let lastBlock = library.modules.blocks.getLastBlock();
            let lastBlockHeight = lastBlock.height;
            if(account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            try {
                var transaction = library.base.transaction.create({
                    type: TransactionTypes.DO_DAPP,
                    sender: account,
                    params: param,
                    fun: fun,
                    dappHash: dappHash,
                    keypair: keyPair,
                    secondKeypair: secondKeypair,
                });
            } catch (e) {
                return cb(e.toString(), 13009);
            }
            library.modules.transactions.receiveTransactions([transaction], cb);
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash});
    });
};

module.exports = Dapps;



