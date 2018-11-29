var TransactionTypes = require('../utils/transaction-types.js');
var constants = require('../utils/constants.js');
var crypto = require('crypto');
var Sequelize = require('sequelize');
var bip39 = require('bip39');
var bacLib = require('bac-lib');
var library, self, privated = {}, shared_1_0 = {};
var ed = require('ed25519');

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
        if (!(raw.da_hash)) {
            return null;
        }
        let dapp = {
            hash: raw.da_hash,
            className: raw.da_className,
            issuersAddress: raw.da_issuersAddress,
            abi: JSON.parse(raw.da_abi),
            tokens: JSON.parse(raw.da_tokenList)
        };

        return {dapp: dapp};
    };

    this.save = function (txObj, cb) {
        let dapp = txObj.asset.dapp;
        let cTokens = dapp.tokens;
        let cAbi = dapp.abi;
        let dappState = 0;
        library.buna.buna.dealCreateContract(txObj, dapp.tokens, function (err, dappData) {
            if (err || dappData.hadError || dappData.hadRuntimeError) {
                // return cb(err);
                dappState = 1;
            }
            console.log(JSON.stringify(cAbi));
            return library.dbClient.query("INSERT INTO dapp2assets(`hash`, `name`, `symbol`, `decimals`, `totalAmount`, `transactionHash`, `createTime`, `accountId`, `others`, `contract`, `className`, `abi`, `tokenList`, `tokenCode`, `issuersAddress`, `status`) VALUES ($hash, $name, $symbol, $decimals, $totalAmount, $transactionHash, $createTime, $accountId, $others, $contract, $className, $abi, $tokenList, $tokenCode, $issuersAddress, $status)", {
                type: Sequelize.QueryTypes.INSERT,
                bind: {
                    hash: dapp.hash,
                    name: dappData.name || '',
                    symbol: dappData.symbol || '',
                    description: dappData.description,
                    decimals: dappData.decimals || 1,
                    totalAmount: dappData.totalAmount || 0,
                    transactionHash: txObj.hash,
                    createTime: txObj.timestamp,
                    accountId: txObj.senderId,
                    contract: "",
                    others: dappData.others,
                    className: dapp.className,
                    abi: JSON.stringify(cAbi),
                    tokenList: JSON.stringify(cTokens),
                    tokenCode: " ",
                    issuersAddress: dapp.issuersAddress,
                    status: dappState
                },
            }).then(() => {
                return library.base.accountAssets.addDappBalance(txObj.senderId, {
                    dappHash: dapp.hash,
                    name: dappData.name,
                    symbol: dappData.symbol,
                    others: dappData.others
                }, dappData.totalAmount);
            }).then(() => {
                cb();
            }).catch((err) => {
                cb(err);
            });
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
            params: JSON.stringify(param),
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        if (typeof txObj.asset.doDapp.params === 'object') {
            txObj.asset.doDapp.params = JSON.stringify(txObj.asset.doDapp.params);
        }
        var report = library.schema.validate(txObj.asset.doDapp, {
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
        // for(let i=0; i<param.length; i++) {
        //     if(param[i] === account.master_address) {
        //         return cb("合约参数错误", 11000);
        //     }
        // }
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.load = function (raw) {
        if (!(raw.do_dappHash || raw.do_fun || raw.do_params)) {
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
        let balances = {};
        let statuses = {};
        // let dappHash = rows[0].dappHash;
        let dappHash;
        let fun = doDapp.fun;
        let params = [];
        let _rows;
        library.dbClient.query("SELECT * FROM dapp2assets WHERE hash=$hash", {
            type: Sequelize.QueryTypes.SELECT,
            bind: {hash: doDapp.dappHash}
        }).then((row) => {
            if (row[0]) {
                if (row[0].name && row[0].symbol && row[0].decimals && row[0].totalAmount) {
                    return library.dbClient.query("INSERT INTO dapp2assets_handle(`dappHash`, `transactionHash`, `fun`, `params`, `timestamp`, `accountId`, `dealResult`) VALUES ($dappHash, $transactionHash, $fun, $params, $timestamp, $accountId, $dealResult)", {
                        type: Sequelize.QueryTypes.INSERT,
                        bind: {
                            dappHash: doDapp.dappHash,
                            transactionHash: txObj.hash,
                            timestamp: txObj.timestamp,
                            accountId: txObj.senderId,
                            fun: doDapp.fun,
                            params: doDapp.params,
                            dealResult: 0
                        },
                    }).then(() => {
                        return library.base.accountAssets.getDappBalances(doDapp.dappHash, txObj.senderId, doDapp.params);
                    }).then((rows) => {
                        if (rows.length === 0)
                            return cb("dapp hash is error");
                        _rows = rows;
                        dappHash = rows[0].dappHash;
                        doDapp.params = JSON.parse(doDapp.params);
                        doDapp.params.forEach((item) => {
                            item = JSON.parse(item);
                            if (item.type === "number") {
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
                        for (let i = 0; i < params.length; i++) {
                            if (typeof params[i] !== "number")
                                params[i] = `"${params[i]}"`;
                        }
                        let messages = rows[0].className + "()." + fun + "(" + params.toString() + ");";
                        return library.buna.buna.getAbiAndTokens({senderId: txObj.senderId, message: messages});
                    }).then(tokens => {
                        let dealTokens = JSON.parse(_rows[0].tokenList);
                        tokens.token.forEach(item => {
                            dealTokens.push(item);
                        });
                        return library.buna.buna.dealTokenContract({
                            from: txObj.senderId,
                            admin: _rows[0].dappAdmin
                        }, balances, statuses, dealTokens);
                    }).then(dealValue => {
                        if (dealValue.hadRuntimeError || dealValue.hadError) {
                            return library.dbClient.query('UPDATE `dapp2assets_handle` SET `dealResult`=1 WHERE transactionHash=$transactionHash', {
                                type: Sequelize.QueryTypes.UPDATE,
                                bind: {
                                    transactionHash: txObj.hash
                                }
                            });
                        } else {
                            if (dealValue.tag === 1)
                                return library.base.accountAssets.upDateDappBalances(dealValue.balance, dappHash);
                            else {
                                return library.base.accountAssets.upDateDappStatuses(dealValue.status, dappHash);
                            }
                        }
                    }).then(() => {
                        cb();
                    }).catch(err => {
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
        txObj.recipientId = data.recipientId;
        txObj.asset.transferDapp = {
            dappHash: data.dappHash
        };
        return txObj;
    };

    this.objectNormalize = function (txObj) {
        var report = library.schema.validate(txObj.asset.dapp, {
            type: 'object',
            properties: {
                dappHash: {
                    type: 'string'
                }
            },
            required: ['dappHash']
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
        if (!(raw.dt_dappHash)) {
            return null;
        }
        let transferDapp = {
            dappHash: raw.dt_dappHash
        };
        return {transferDapp: transferDapp};
    };

    this.save = function save(txObj, cb) {
        let transferDapp = txObj.asset.transferDapp;
        library.dbClient.query("INSERT INTO dapp2transfersAdmin(`dappHash`, `transactionHash`, `accountId`, `recipientId`, `timestamp`) VALUES ($dappHash, $transactionHash, $accountId, $recipientId, $timestamp)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                dappHash: transferDapp.dappHash,
                transactionHash: txObj.hash,
                accountId: txObj.senderId,
                recipientId: txObj.recipientId,
                timestamp: Date.now(),
            }
        }).then(() => {
            return library.dbClient.query('UPDATE dapp2assets SET `accountId`=$recipientId WHERE `hash`=$dappHash and `accountId`=$accountId', {
                type: Sequelize.QueryTypes.INSERT,
                bind: {
                    recipientId: txObj.recipientId,
                    dappHash: transferDapp.dappHash,
                    accountId: txObj.senderId
                }
            });
        }).then(() => {
            cb();
        }).catch(err => {
            return cb(err);
        });
    }
}

function Dapps(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    library.base.transaction.attachAssetType(TransactionTypes.DAPP, new Dapp());
    library.base.transaction.attachAssetType(TransactionTypes.DO_DAPP, new DoDapp());
    library.base.transaction.attachAssetType(TransactionTypes.DAPP_TRANSFER, new TransferDapp());
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

privated.checkAccount = function (account, cb) {
    library.dbClient.query('SELECT * FROM dapp2issuers WHERE `accountId`=$accountId', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            accountId: account.master_address
        }
    }).then(rows => {
        if (rows[0]) {
            cb(null, rows[0].issuersAddress);
        } else {
            cb();
        }
    }).catch(err => {
        cb(err);
    });
};

privated.findIssuersAddress = function (issuersAddress, cb) {
    library.dbClient.query('SELECT * FROM dapp2assets WHERE `hash`=$dappHash', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            dappHash: issuersAddress
        }
    }).then((rows) => {
        if (!rows[0]) {
            cb("issuers applyUnconfirmed is error")
        } else {
            cb();
        }
    }).catch((err) => {
        cb(err);
    });
};

privated.getAssetsAdmin = function (address, dappHash, cb) {
    library.dbClient.query('SELECT * FROM `dapp2assets` WHERE `hash` = $hash and `accountId` = $accountId', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            hash: dappHash,
            accountId: address
        }
    }).then(rows => {
        if (rows[0]) {
            cb();
        } else {
            cb("该用户不是此合约的管理员");
        }
    }).catch(err => {
        cb(err);
    });
};

privated.searchDpaaBalance = function (address, dappHash, cb) {
    let sql = 'SELECT * FROM `dapp2assets_balances` WHERE `accountId` = $accountId ';
    if (dappHash) {
        sql += 'and `dappHash`=$dappHash';
    }
    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            accountId: address,
            dappHash: dappHash
        }
    }).then((rows) => {
        cb(null, rows);
    }).catch(err => {
        cb(err);
    })
};

privated.searchHandle = function (data, cb) {
    let sql = 'SELECT * FROM `dapp2assets_handle` WHERE ';
    if (data.dappHash) {
        sql += "`dappHash` = $dappHash ";
        if (data.transactionHash) {
            sql += "AND `transactionHash`=$transactionHash "
        }
        if (data.address) {
            sql += 'AND `accountId` = $address ';
        }
    } else if (data.transactionHash) {
        sql += "`transactionHash`=$transactionHash ";
        if (data.address) {
            sql += 'AND `accountId` = $address ';
        }
    } else if (data.address) {
        sql += '`accountId` = $address ';
    } else {
        return cb("data is null");
    }
    sql += " ORDER BY `timestamp` DESC LIMIT $height, $size ";
    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            address: data.address,
            transactionHash: data.transactionHash,
            dappHash: data.dappHash,
            height: data.height,
            size: data.size
        }
    }).then(rows => {
        return cb(null, rows);
    }).catch(err => {
        return cb(err);
    });
};
// 上传合约
shared_1_0.upLoadDapp = function (params, cb) {
    let mnemonic = params[0] || '';
    let className = params[1] || '';
    let msg = params[2] || '';
    let secondSecret = params[3] || '';
    if (!(mnemonic && msg && className)) {
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
            if (account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            privated.checkAccount(account, function (err, issuersAddress) {
                if (err) {
                    cb(err, 11000);
                } else {
                    library.buna.buna.testContract({
                        accountId: account.master_address,
                        message: msg,
                        className: className
                    }, function (err, dappData) {
                        if (err || dappData.hadError) {
                            return cb(err || "合约缺少关键属性", 11000);
                        } else {
                            if (dappData.name && dappData.symbol && dappData.decimals && dappData.totalAmount) {
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
// 使用合约方法
shared_1_0.handleDapp = function (params, cb) {
    let mnemonic = params[0] || '';
    let dappHash = params[1] || '';
    let fun = params[2] || '';
    let param = params[3] || [];
    let secondSecret = params[4] || '';

    if (!(mnemonic || fun || dappHash)) {
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
            if (account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            // for(let i=0; i<param.length; i++) {
            //     if(param[i] === account.master_address) {
            //         return cb("合约参数错误", 11000);
            //     }
            // }
            privated.findIssuersAddress(dappHash, function (err) {
                if (err) {
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
// 转移合约所有人
shared_1_0.transferDapp = function (params, cb) {
    let mnemonic = params[0] || '';
    let dappHash = params[1] || '';
    let transferAddress = params[2] || '';
    let secondSecret = params[3] || '';
    if (!(mnemonic && dappHash && transferAddress)) {
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
            if (account.lockHeight > lastBlockHeight) {
                return cb("Account is locked", 11000);
            }
            privated.getAssetsAdmin(account.master_address, dappHash, function (err) {
                if (err) {
                    return cb("此账户不是该dapp的管理员", 11000);
                } else {
                    try {
                        var transaction = library.base.transaction.create({
                            type: TransactionTypes.DAPP_TRANSFER,
                            admin: transferAddress,
                            dappHash: dappHash,
                            keypair: keyPair,
                            sender: account,
                            recipientId: transferAddress,
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
// 查询dapp余额
shared_1_0.searchDappBalance = function (params, cb) {
    let address = params[0] || '';
    let dappHash = params[1] || '';
    if (!address) {
        return cb(11000, "缺少合约人地址");
    }
    privated.searchDpaaBalance(address, dappHash, (err, rows) => {
        if (err) {
            return cb(err, 11000);
        } else {
            return cb(null, 200, rows);
        }
    })
};
// 查询全部合约列表
shared_1_0.searchDappList = function (params, cb) {
    let searchData = [0] || '';
    let page = params[1] || 1;
    let size = params[2] || 10;
    let height = (page - 1) * size;
    // let sql = "SELECT * FROM `dapp2assets` WHERE `dappHash` = $searchData or `name`=$searchData ORDER BY `createTime` DESC LIMIT $height, $size";
    let sql = "SELECT * FROM `dapp2assets`";
    if(searchData) {
        sql += " WHERE `dappHash` = $searchData or `name`=$searchData";
    }
    sql += " ORDER BY `createTime` DESC LIMIT $height, $size";
    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            height: height,
            size: size,
            searchData: searchData
        }
    }).then(rows => {
        return cb(null, 200, rows);
    }).catch(err => {
        return cb(err, 11000);
    });
};

shared_1_0.searchDappHash = function (params, cb) {
    let hash = params[0] || '';
    if(!hash) {
        return cb("dapp hash is empty", 11000);
    } else {
        library.dbClient.query(`SELECT hash from dapp2assets WHERE hash like "%${hash}%"`, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            return cb(null, 200, rows);
        });
    }
};

// 查询自己的合约
shared_1_0.searchMineList = function (params, cb) {
    let address = params[0];
    let page = params[1] || 1;
    let size = params[2] || 10;
    let height = (page-1)*size;
    library.dbClient.query('SELECT * FROM `dapp2assets` WHERE `accountId`=$accountId ORDER BY `createTime` DESC LIMIT $height, $size', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            accountId: address,
            height: height,
            size: size
        }
    }).then((rows) => {
        return cb(null, 200, rows);
    });
};
// 查看操作记录
shared_1_0.searchDappHandle = function (params, cb) {
    let dappHash = params[0];
    let transactionHash = params[1];
    let address = params[2];
    let page = params[3] || 1;
    let size = params[4] || 10;
    let height = (page - 1) * size;
    if (!(dappHash || transactionHash || address)) {
        return cb("缺少参数", 11000);
    }
    let data = {
        dappHash: dappHash,
        transactionHash: transactionHash,
        address: address,
        height: height,
        size: size
    };
    privated.searchHandle(data, function (err, data) {
        if (err) {
            return cb(err, 11000);
        } else {
            return cb(null, 200, data);
        }
    });
};

//拉取dapp详情
shared_1_0.getDappInfo = function (params, cb) {
    let dappHash = params[0];
    library.dbClient.query('SELECT * FROM `dapp2assets` WHERE `hash`=$dappHash', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            dappHash: dappHash
        }
    }).then((rows) => {
        if (rows) {
            return cb(null, 200, rows[0]);
        } else {
            return cb(null, 200, "");
        }
    }).catch((err) => {
        cb("获取dapp详情失败", 11000);
    });
};

// 创建合约费用
shared_1_0.getCreateDappFee = function (params, cb) {
    let fee = 1 * constants.fixedPoint;
    return cb(200, fee);
};

module.exports = Dapps;



