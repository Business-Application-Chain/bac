var TransactionTypes = require('../utils/transaction-types.js');
var constants = require('../utils/constants.js');
var crypto = require('crypto');
var Sequelize = require('sequelize');
var bip39 = require('bip39');
var bacLib = require('bac-lib');
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
            hash: address,
            className: data.className,
            issuersAddress: data.issuersAddress,
            abi: data.abi,
            tokens: data.tokens
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
            return setImmediate(cb, "Invalid transaction dapp");
        }
        if (txObj.amount !== 0) {
            return setImmediate(cb, "Invalid transaction amount");
        }
        setImmediate(cb);
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
            hash: raw.da_hash,
            className: raw.da_className,
            issuersAddress: raw.da_issuersAddress,
            abi: JSON.parse(raw.da_abi) ,
            tokens: JSON.parse(raw.da_tokenList)
        };

        return {dapp: dapp};
    };

    this.save = function (txObj, cb) {
        let dapp = txObj.asset.dapp;
        let cTokens = dapp.tokens;
        let cAbi = dapp.abi;
        library.buna.buna.dealCreateContract(txObj, dapp.tokens, function (err, dappData) {
            if(err || dappData.hadError || dappData.hadRuntimeError) {
                return cb(err);
            }
            if(dappData.name && dappData.symbol && dappData.decimals && dappData.totalAmount) {

                return library.dbClient.query("INSERT INTO dapp2assets(`hash`, `name`, `symbol`, `decimals`, `totalAmount`, `transactionHash`, `createTime`, `accountId`, `others`, `contract`, `className`, `abi`, `tokenList`, `tokenCode`, `issuersAddress`) VALUES ($hash, $name, $symbol, $decimals, $totalAmount, $transactionHash, $createTime, $accountId, $others, $contract, $className, $abi, $tokenList, $tokenCode, $issuersAddress)", {
                    type: Sequelize.QueryTypes.INSERT,
                    bind: {
                        hash: dapp.hash,
                        name: dappData.name,
                        symbol: dappData.symbol,
                        description: dappData.description,
                        decimals: dappData.decimals,
                        totalAmount: dappData.totalAmount,
                        transactionHash: txObj.hash,
                        createTime: txObj.timestamp,
                        accountId: txObj.senderId,
                        contract: "",
                        others: dappData.others,
                        className: dapp.className,
                        abi: JSON.stringify(cAbi),
                        tokenList: JSON.stringify(cTokens),
                        tokenCode: " ",
                        issuersAddress: dapp.issuersAddress
                    },
                }).then(() => {
                    return library.base.accountAssets.addDappBalance(txObj.senderId, {dappHash: dapp.hash, name: dappData.name, symbol: dappData.symbol, others: dappData.others}, dappData.totalAmount);
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
        let param = [];
        data.params.forEach((item) => {
            param.push(JSON.stringify({data: item, type: typeof item}));
        });
        txObj.asset.doDapp = {
            dappHash: data.dappHash,
            fun: data.fun,
            params: param,
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
        cb();
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.load = function (raw) {
        if(!(raw.do_dappHash || raw.do_fun || raw.do_params)) {
            return null;
        }
        let doDapp = {
            dappHash: raw.do_dappHash,
            fun: raw.do_fun,
            params: JSON.parse(raw.do_params),
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
                            params: JSON.stringify(doDapp.params)
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
                        doDapp.params.forEach((item) => {
                            item = JSON.parse(item);
                            if(item.type === "number") {
                                params.push(parseInt(item.data));
                            } else {
                                balances[item.data] = 0;
                                params.push(item.data);
                                statuses[item.data] = JSON.parse(rows[0].defaultOthers);
                            }
                        });
                        rows.forEach(function (row) {
                            balances[row.accountId] = row.balance;
                            statuses[row.accountId] = JSON.parse(row.others);
                        });
                        for (let i=0; i<params.length; i++) {
                            if (typeof params[i] !== "number")
                                params[i] = `"${params[i]}"`;
                        }
                        let messages = rows[0].className + "()." + fun + "(" + params.toString() + ");";
                        library.buna.buna.getAbiAndTokens({senderId: txObj.senderId, message: messages}, function (err, tokens) {
                            if(err) {
                                return cb(err);
                            } else {
                                let dealTokens = JSON.parse(rows[0].tokenList);
                                tokens.token.forEach(item => {
                                    dealTokens.push(item);
                                });
                                library.buna.buna.dealTokenContract({from: txObj.senderId, admin: rows[0].dappAdmin}, balances, statuses, dealTokens, function (err, dealValue) {
                                    if(err || dealValue.hadRuntimeError || dealValue.hadError) {
                                        return library.dbClient.query('UPDATE `dapp2assets_handle` SET `dealResult`=1 WHERE transactionHash=$transactionHash', {
                                            type: Sequelize.QueryTypes.UPDATE,
                                            bind: {
                                                transactionHash: txObj.hash
                                            }
                                        });
                                    }
                                    if(dealValue.tag === 1)
                                        return library.base.accountAssets.upDateDappBalances(dealValue.balance, dappHash);
                                    else {
                                        return library.base.accountAssets.upDateDappStatuses(dealValue.status, dappHash);
                                    }
                                });
                            }
                        });
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

function TransferDapp() {
    this.calculateFee = function (txObj, sender) {
        return 1 * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.amount = 0;
        txObj.asset.transferDapp = {
            dappHash: data.dappHash,
            admin: data.admin
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.dapp, {
            type: 'object',
            properties: {
                dappHash: {
                    type: 'string'
                },
                admin: {
                    type: 'string',
                }
            },
            required: ['dappHash', 'admin']
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
        if (!txObj.asset.transferDapp) {
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
        cb();
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.load = function (raw) {
        if(!(raw.dt_dappHash || raw.dt_admin)) {
            return null;
        }
        let transferDapp = {
            dappHash: raw.dt_dappHash,
            admin: raw.dt_admin,
        };
        return {transferDapp: transferDapp};
    };

    this.save = function save(txObj, cb) {
        // cb();

    }
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

privated.checkAccount = function(account, cb) {
    library.dbClient.query('SELECT * FROM dapp2issuers WHERE `accountId`=$accountId', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            accountId: account.master_address
        }
    }).then(rows => {
        if(rows[0]) {
            cb(null, rows[0].issuersAddress);
        } else {
            cb();
        }
    }).catch(err => {
        cb(err);
    });
};

privated.findIssuersAddress = function(issuersAddress, cb) {
    library.dbClient.query('SELECT * FROM dapp2assets WHERE `hash`=$dappHash',{
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            dappHash: issuersAddress
        }
    }).then((rows) => {
        if(!rows[0]) {
            cb("issuers applyUnconfirmed is error")
        } else {
            cb();
        }
    }).catch((err) => {
        cb(err);
    });
};

privated.getAssetsAdmin = function(address, dappHash, cb) {
    library.dbClient.query('SELECT * FROM `dapp2assets` WHERE `hash` = $hash and `accountId` = $accountId', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            hash: dappHash,
            accountId: address
        }
    }).then(rows => {
        if(rows[0]) {
            cb(null, rows[0]);
        } else {
            cb("该用户不是此合约的管理员");
        }
    })
};

shared_1_0.upLoadDapp = function(params, cb) {
    let mnemonic = params[0] || '';
    let className = params[1] || '';
    let msg = params[2] || '';
    let secondSecret = params[3] || '';
    if(!(mnemonic && msg && className)) {
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
            privated.checkAccount(account, function (err, issuersAddress) {
                if(err) {
                    cb(err, 11000);
                } else {
                    library.buna.buna.testContract({accountId: account.master_address, message: msg, className: className}, function (err, dappData) {
                        if(err || dappData.hadError) {
                            return cb(err || "合约缺少关键属性", 11000);
                        } else {
                            if(dappData.name && dappData.symbol && dappData.decimals && dappData.totalAmount) {
                                dappData.token.pop();
                                try {
                                    var transaction = library.base.transaction.create({
                                        type: TransactionTypes.DAPP,
                                        className: className,
                                        sender: account,
                                        keypair: keyPair,
                                        secondKeypair: secondKeypair,
                                        tokens: dappData.token,
                                        abi: dappData.abi,
                                        issuersAddress: issuersAddress || " "
                                    });
                                } catch (e) {
                                    return cb(e.toString(), 13009);
                                }
                                library.modules.transactions.receiveTransactions([transaction], cb);
                            } else {
                                return cb("合约不正确", 11111);
                            }
                        }
                    });
                }
            });
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

    if(!(mnemonic || fun || dappHash)) {
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
            privated.findIssuersAddress(dappHash, function (err) {
                if(err) {
                    return cb(err, 11000);
                } else {
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
                }
            });
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 13009);
        }
        cb(null, 200, {transactionHash: transaction[0].hash});
    });
};

shared_1_0.transferDapp = function(params, cb) {
    let mnemonic = params[0] || '';
    let dappHash = params[2] || '';
    let transferAddress = params[3] || '';
    if(!(mnemonic && dappHash && transferAddress)) {
        return cb("miss must params", 11000);
    }
    let keyPair = library.base.account.getKeypair(mnemonic);
    let publicKey = keyPair.getPublicKeyBuffer().toString('hex');
    let query = {
        master_pub: publicKey
    };
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
            privated.getAssetsAdmin(account.master_address, dappHash, function (err, data) {

            });
        });
    });
};

module.exports = Dapps;



