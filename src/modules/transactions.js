var async = require('async');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var TransactionTypes = require('../utils/transaction-types.js');
var Sequelize = require('sequelize');
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null, shared_1_0 = {};
var ByteBuffer = require("bytebuffer");
var errorCode = require('../utils/error-code');

privated.hiddenTransactions = [];
privated.unconfirmedTransactions = [];
privated.unconfirmedTransactionsIdIndex = {};
privated.doubleSpendingTransactions = {};

function Transaction() {

    this.calculateFee = function (txObj, sender) {
        return library.base.block.calculateFee();
    };

    this.create = function (data, txObj) {
        txObj.recipientId = data.recipientId;
        txObj.recipientUsername = data.recipientUsername;
        txObj.amount = data.amount;

        return txObj;
    };

    this.objectNormalize = function (txObj) {
        delete txObj.blockHash;
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

            return txObj.signatures.length >= sender.multisign - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if (!txObj.recipientId.match(/^[B]+[A-Za-z|0-9]{33}$/)) {
            return cb("Invalid recipient master_address");
        }

        if (txObj.amount <= 0) {
            return cb("Invalid transaction amount");
        }

        cb(null, txObj);
    };

    this.apply = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({master_address: txObj.recipientId}, function (err, recipient) {
            if (err) {
                return cb(err);
            }
            library.modules.accounts.mergeAccountAndGet({
                master_address: txObj.recipientId,
                balance: txObj.amount,
                balance_unconfirmed: txObj.amount,
                blockHash: blockObj.hash,
                round: library.modules.round.calc(blockObj.height)
            }, function (err) {
                cb(err);
            });
        });
    };

    this.undo = function (txObj, blockObj, sender, cb) {
        library.modules.accounts.setAccountAndGet({master_address: txObj.recipientId}, function (err, recipient) {
            if (err) {
                return cb(err);
            }
            library.modules.accounts.mergeAccountAndGet({
                master_address: txObj.recipientId,
                balance: -txObj.amount,
                balance_unconfirmed: -txObj.amount,
                blockHash: blockObj.hash,
                round: library.modules.round.calc(blockObj.height)
            }, function (err) {
                cb(err);
            });
        });
    };

    this.applyUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.undoUnconfirmed = function (txObj, sender, cb) {
        setImmediate(cb);
    };

    this.load = function (raw) {
        return null;
    };

    this.save = function (txObj, cb) {
        setImmediate(cb);
    };
}

// constructor
function Transactions(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    genesisblock = library.genesisblock;
    library.base.transaction.attachAssetType(TransactionTypes.SEND, new Transaction());

    setImmediate(cb, null, self);
}

// private methods
privated.list = function (filter, cb) {
    var sortFields = ['t.hash', 't.blockHash', 't.amount', 't.fee', 't.type', 't.timestamp', 't.senderPublicKey', 't.senderId', 't.recipientId', 't.senderUsername', 't.recipientUsername', 't.confirmations', 'b.height'];
    var fields = {}, fields_or = [], owner = '';

    if (filter.blockHash) {
        fields_or.push('blockHash = $blockHash');
        fields.blockHash = filter.blockHash;
    }
    if (filter.senderPublicKey) {
        fields_or.push('lower(senderPublicKey) = $senderPublicKey');
        fields.senderPublicKey = filter.senderPublicKey;
    }
    if (filter.senderId) {
        fields_or.push('senderId = $senderId');
        fields.senderId = filter.senderId;
    }
    if (filter.recipientId) {
        fields_or.push('recipientId = $recipientId');
        fields.recipientId = filter.recipientId;
    }
    if (filter.senderUsername) {
        fields_or.push('senderUsername = $senderUsername');
        fields.senderUsername = filter.senderUsername;
    }
    if (filter.recipientUsername) {
        fields_or.push('recipientUsername = $recipientUsername');
        fields.recipientUsername = filter.recipientUsername;
    }
    if (filter.ownerMasterAddress && filter.ownerMasterPublicKey) {
        owner = '(lower(senderPublicKey) = ownerMasterPublicKey OR recipientId = ownerMasterAddress)';
        fields.ownerMasterPublicKey = filter.ownerMasterPublicKey;
        fields.ownerMasterAddress = filter.ownerMasterAddress;
    }
    if (filter.type >= 0) {
        fields_or.push('type = $type');
        fields.type = filter.type;
    }
    if (filter.limit >= 0) {
        fields.limit = filter.limit;
    }
    if (filter.offset >= 0) {
        fields.offset = filter.offset;
    }
    if (filter.limit > 100) {
        return cb("Invalid limit. Maximum is 100");
    }

    library.dbClient.query('SELECT COUNT(t.hash) AS count ' +
        'FROM transactions t ' +
        'INNER JOIN blocks b on t.blockHash = b.hash ' +
        (fields_or.length || owner ? 'WHERE ' : '') + ' ' +
        (fields_or.length ? '(' + fields_or.join(' or ') + ') ' : '') + (fields_or.length && owner ? ' AND ' + owner : owner), {
        type: Sequelize.QueryTypes.SELECT,
        bind: fields
    }).then(function (rows) {
        var count = rows.length ? rows[0].count : 0;

        library.dbClient.query('SELECT t.hash AS t_hash, b.height AS b_height, t.blockHash AS t_blockHash, t.type AS t_type, t.timestamp AS t_timestamp, lower(t.senderPublicKey) AS t_senderPublicKey, t.senderId AS t_senderId, t.recipientId AS t_recipientId, t.senderUsername AS t_senderUsername, t.recipientUsername AS t_recipientUsername, t.amount AS t_amount, t.fee AS t_fee, lower(t.signature) AS t_signature, lower(t.signSignature) AS t_signSignature, (SELECT MAX(height) + 1 FROM blocks) AS t_confirmations ' +
            'FROM transactions t ' +
            'INNER JOIN blocks b on t.blockHash = b.hash ' +
            (fields_or.length || owner ? 'WHERE ' : '') + ' ' +
            (fields_or.length ? '(' + fields_or.join(' or ') + ') ' : '') + (fields_or.length && owner ? ' AND ' + owner : owner) + ' ' +
            (filter.orderBy ? 'ORDER BY ' + filter.orderBy : '') + ' ' +
            ('LIMIT $limit') + ' ' +
            (filter.offset ? ', $offset' : ''), {
            type: Sequelize.QueryTypes.SELECT,
            bind: fields
        }).then(function (rows) {
            var transactions = [];
            for (var i = 0; i < rows.length; i++) {
                transactions.push(library.base.transaction.load(rows[i]));
            }
            var data = {
                transactions: transactions,
                count: count
            }
            cb(null, data);
        }, function (err) {
            cb(err, undefined);
        });
    }, function (err) {
        cb(err, undefined);
    });
};

privated.getAllTransactions = function (filter, cb) {
    let sql = 'SELECT t.hash AS hash, b.height AS b_height, t.blockHash AS blockHash, t.type AS type, t.timestamp AS timestamp, lower(t.senderPublicKey) AS senderPublicKey, t.senderId AS senderId, t.recipientId AS recipientId, t.senderUsername AS senderUsername, t.recipientUsername AS recipientUsername, t.amount AS amount, t.fee AS fee, lower(t.signature) AS signature, lower(t.signSignature) AS signSignature';
    sql += ' FROM transactions t ';
    sql += ' INNER JOIN blocks b on t.blockHash = b.hash ';
    if (filter.height) {
        sql += ' WHERE height < ' + filter.height;
    }
    if (filter.publicKey) {
        sql += filter.height ? " AND " : " WHERE ";
        sql += `senderPublicKey = "${filter.master_pub}"`;
    }
    sql += ' ORDER BY ' + filter.orderBy + ' desc';
    sql += ' LIMIT ' + filter.limit;
    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
    }).then(function (rows) {
        rows.forEach(function (item) {
            item.confirmations = library.modules.blocks.getLastBlock().height - item.b_height;
        });
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};

privated.getUserTransactions = function (filter, cb) {
    let index = filter.page * filter.size;
    let sql = `SELECT * FROM transactions where senderId="${filter.address}" or recipientId = "${filter.address}" order by timestamp desc limit ${index}, ${filter.size} `;
    let sqlCount = `SELECT count(*) as number FROM transactions where senderId="${filter.address}" or recipientId="${filter.address}"`;
    library.dbClient.query(sqlCount, {
        type: Sequelize.QueryTypes.SELECT
    }).then((data) => {
        library.dbClient.query(sql, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            cb(null, rows, data[0].number);
        }).catch((err) => {
            cb(err);
        });
    }).catch((err) => {
        cb(err);
    });
};

privated.getByHash = function (hash, cb) {
    library.dbClient.query('SELECT t.hash AS t_hash, b.height AS b_height, t.blockHash AS t_blockHash, t.type AS t_type, t.timestamp AS t_timestamp, lower(t.senderPublicKey) AS t_senderPublicKey, t.senderId AS t_senderId, t.recipientId AS t_recipientId, t.senderUsername AS t_senderUsername, t.recipientUsername AS t_recipientUsername, t.amount AS t_amount, t.fee AS t_fee, lower(t.signature) AS t_signature, lower(t.signSignature) AS t_signSignature, (SELECT MAX(height) + 1 FROM blocks) AS t_confirmations ' +
        'FROM transactions t ' +
        'INNER JOIN blocks b on t.blockHash = b.hash WHERE t.hash = $hash', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            hash: hash
        }
    }).then(function (rows) {
        if (!rows.length) {
            return cb({
                msg: ("Can't find transaction: " + hash),
                code: errorCode.transactions.CAN_NOT_FIND_TRANSACTION
            });
        }

        var txObj = library.base.transaction.load(rows[0]);
        cb(null, txObj);
    }, function (err) {
        cb({
            msg: err,
            code: errorCode.server.SERVER_ERROR
        });
    });
};

privated.getByBlockHash = function (hash, cb) {
    library.dbClient.query(`SELECT * FROM transactions where blockHash = ${hash}`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        if (!rows.length) {
            return cb({
                msg: ("Can't find transaction: " + hash),
                code: errorCode.transactions.CAN_NOT_FIND_TRANSACTION
            });
        }
        return cb(null, rows);
    }).catch((err) => {
        return cb({
            msg: err,
            code: errorCode.server.SERVER_ERROR
        });
    });
};

privated.addUnconfirmedTransaction = function (txObj, sender, cb) {
    self.applyUnconfirmed(txObj, sender, function (err) {
        if (err) {
            self.addDoubleSpendingTransaction(txObj);
            return setImmediate(cb, err);
        }

        privated.unconfirmedTransactions.push(txObj);
        let index = privated.unconfirmedTransactions.length - 1;
        privated.unconfirmedTransactionsIdIndex[txObj.hash] = index;

        setImmediate(cb);
    });
};

privated.transactionGetBytes = function (trs) {
    try {
        let assetBytes = null;
        let assetSize = assetBytes ? assetBytes.length : 0;

        var bb = new ByteBuffer(1 + 4 + 32 + 32 + 8 + 8 + 64 + 64 + assetSize, true);
        bb.writeByte(trs.type);
        bb.writeInt(trs.timestamp);

        let senderPublicKeyBuffer = new Buffer(trs.senderPublicKey, 'hex');
        for (let i = 0; i < senderPublicKeyBuffer.length; i++) {
            bb.writeByte(senderPublicKeyBuffer[i]);
        }

        if (trs.requesterPublicKey) {
            let requesterPublicKey = new Buffer(trs.requesterPublicKey, 'hex');
            for (let i = 0; i < requesterPublicKey.length; i++) {
                bb.writeByte(requesterPublicKey[i]);
            }
        }

        bb.writeByte(0);

        bb.writeLong(trs.amount);

        if (assetSize > 0) {
            for (let i = 0; i < assetSize; i++) {
                bb.writeByte(assetBytes[i]);
            }
        }

        if (trs.signature) {
            let signatureBuffer = new Buffer(trs.signature, 'hex');
            for (let i = 0; i < signatureBuffer.length; i++) {
                bb.writeByte(signatureBuffer[i]);
            }
        }

        if (trs.signSignature) {
            let signSignatureBuffer = new Buffer(trs.signSignature, 'hex');
            for (let i = 0; i < signSignatureBuffer.length; i++) {
                bb.writeByte(signSignatureBuffer[i]);
            }
        }

        bb.flip();
    } catch (e) {
        throw Error(e.toString());
    }
    return bb.toBuffer();
}

// public methods
Transactions.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

privated.getPackageTransactions = function () {
    let unconfirmedTransactions = privated.unconfirmedTransactions;
    let transactions = unconfirmedTransactions.sort(function compare(a, b) { // 把交易進行排序
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.amount < b.amount) return -1;
        if (a.amount > b.amount) return 1;
        return 0;
    });
    let blockTransactions = [];
    let size = 0;
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        let bytes = privated.transactionGetBytes(transaction);

        if (size + bytes.length > 1024 * 1024) { // 如果超出包的最大体积则跳出
            break;
        }
        size += bytes.length;
        blockTransactions.push(transaction);
    }
    return blockTransactions;
};

Transactions.prototype.callApi = function (call, rpcjson, args, peerIp, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

Transactions.prototype.getUnconfirmedTransactionById = function (id) {
    let index = privated.unconfirmedTransactionsIdIndex[id];
    return privated.unconfirmedTransactions[index];
};

Transactions.prototype.undoBlockUnconfirmedList = function (block, cb) {
    var ids = [];
    async.eachSeries(block.transactions, function (transaction, cb) {
        if (transaction !== false && privated.unconfirmedTransactionsIdIndex[transaction.hash]) {
            ids.push(transaction.hash);
            self.undoUnconfirmed(transaction, cb);
        } else {
            setImmediate(cb);
        }
    }, function (err) {
        cb(err, ids);
    });
};

Transactions.prototype.undoUnconfirmedList = function (cb) {

    var ids = [];
    async.each(privated.unconfirmedTransactions, function (transaction, cb) {
        if (transaction !== false) {
            ids.push(transaction.hash);
            self.undoUnconfirmed(transaction, cb);
        } else {
            setImmediate(cb);
        }
    }, function (err) {
        cb(err, ids);
    })
};

Transactions.prototype.addDoubleSpendingTransaction = function (txObj) {
    privated.doubleSpendingTransactions[txObj.hash] = txObj;
};

Transactions.prototype.pushHiddenTransaction = function (txObj) {
    privated.hiddenTransactions.push(txObj);
};

Transactions.prototype.shiftHiddenTransaction = function () {
    return privated.hiddenTransactions.shift();
};

Transactions.prototype.deleteHiddenTransaction = function () {
    privated.hiddenTransactions = [];
};

Transactions.prototype.getUnconfirmedTransactionList = function (reverse) {
    var arr = [];
    for (var i = 0; i < privated.unconfirmedTransactions.length; i++) {
        arr.push(privated.unconfirmedTransactions[i]);
    }

    return reverse ? arr.reverse() : arr;
};

Transactions.prototype.removeUnconfirmTransactionById = function (id) {
    let index = privated.unconfirmedTransactionsIdIndex[id];
    delete privated.unconfirmedTransactionsIdIndex[id];
    privated.unconfirmedTransactions[index] = false;
};

Transactions.prototype.processUnconfirmedTransaction = function (txObj, broadcast, cb) {
    library.modules.accounts.setAccountAndGet({master_pub: txObj.senderPublicKey}, function (err, sender) {
        function done(err) {
            if (err) {
                if (privated.unconfirmedTransactionsIdIndex[txObj.hash])
                    privated.removeUnconfirmedTransaction(privated.unconfirmedTransactionsIdIndex[txObj.hash]);
                // return library.base.transaction.undoUnconfirmed(txObj, sender, cb);
                return cb(err);
            }
            privated.addUnconfirmedTransaction(txObj, sender, function (err) {
                if (err) {
                    return cb(err);
                }
                library.notification_center.notify('unconfirmedTransaction', txObj, broadcast);
                setImmediate(cb);
            });
        }

        if (err) {
            return done(err);
        }

        if (txObj.requesterPublicKey && sender && sender.multisignatures && sender.multisignatures.length) {
            library.modules.getAccount({master_pub: txObj.requesterPublicKey}, function (err, requester) {
                if (err) {
                    return done(err);
                }
                if (!requester) {
                    return cb("Invalid requester");
                }
                library.base.transaction.process(txObj, sender, requester, function (err, txObj) {
                    if (err) {
                        return done(err);
                    }
                    // Check in confirmed transactions
                    if (privated.unconfirmedTransactionsIdIndex[txObj.hash] !== undefined || privated.doubleSpendingTransactions[txObj.hash]) {
                        return cb("Transaction is already existed");
                    }
                    library.base.transaction.verify(txObj, sender, done);
                });
            });
        } else {
            library.base.transaction.process(txObj, sender, function (err, txObj) {
                if (err) {
                    return done(err);
                }
                // Check in confirmed transactions
                if (privated.unconfirmedTransactionsIdIndex[txObj.hash] !== undefined || privated.doubleSpendingTransactions[txObj.hash]) {
                    return cb("Transaction is already existed");
                }
                library.base.transaction.verify(txObj, sender, done);
            });
        }
    });
};

Transactions.prototype.apply = function (txObj, blockObj, sender, cb) {
    library.base.transaction.apply(txObj, blockObj, sender, cb);
};

Transactions.prototype.undo = function (txObj, blockObj, sender, cb) {
    library.base.transaction.undo(txObj, blockObj, sender, cb);
};

Transactions.prototype.applyUnconfirmed = function (txObj, sender, cb) {
    if (!sender && txObj.blockHash !== genesisblock.block.hash) {
        return cb("Invalid account");
    } else {
        if (txObj.requesterPublicKey) {
            library.modules.accounts.getAccount({master_pub: txObj.requesterPublicKey}, function (err, requester) {
                if (err) {
                    return cb(err);
                }

                if (!requester) {
                    return cb("Invalid requester");
                }

                library.base.transaction.applyUnconfirmed(txObj, sender, requester, cb);
            });
        } else {
            library.base.transaction.applyUnconfirmed(txObj, sender, cb);
        }
    }
};

Transactions.prototype.undoUnconfirmed = function (txObj, cb) {
    library.modules.accounts.getAccount({master_pub: txObj.senderPublicKey}, function (err, sender) {
        if (err) {
            return cb(err);
        }
        library.base.transaction.undoUnconfirmed(txObj, sender, cb);
    });
};

Transactions.prototype.getUnconfirmedTransaction = function (id) {
    let index = privated.unconfirmedTransactionsIdIndex[id];
    return privated.unconfirmedTransactions[index];
};

Transactions.prototype.removeUnconfirmedTransaction = function (id) {
    console.log("remove Unconfirmed Transaction; id -> ", id);
    let index = privated.unconfirmedTransactionsIdIndex[id];
    privated.unconfirmedTransactions[index] = false;
    delete privated.unconfirmedTransactionsIdIndex[id];
};

Transactions.prototype.addDoubleSpending = function (transaction) {
    privated.doubleSpendingTransactions[transaction.hash] = transaction;
};

Transactions.prototype.revertUnconfirmedTransactions = function (transactions) {
    privated.unconfirmedTransactions.push(transactions);
    console.log();
    transactions.forEachAsync(function (item) {
        let index = privated.unconfirmedTransactions.length - 1;
        privated.unconfirmedTransactionsIdIndex[item.hash] = index;
    });
};

Transactions.prototype.onSendUnconfirmedTrs = function () {
    let unconfirmedTrs = [];
    console.log(privated.unconfirmedTransactions);
    for(let item of privated.unconfirmedTransactions) {
        if(item) {
            unconfirmedTrs.push(item);
        }
    }
    privated.unconfirmedTransactions = unconfirmedTrs;
    privated.unconfirmedTransactionsIdIndex = {};
    for(let i = 0; i < privated.unconfirmedTransactions.length; i++) {
        privated.unconfirmedTransactionsIdIndex[privated.unconfirmedTransactions[i].hash] = i;
    }

    library.log.Info("unconfirmed transactions number", unconfirmedTrs.length);
    let send = [];
    let maxCount = unconfirmedTrs.length > 1000 ? 1000 : unconfirmedTrs.length;
    for (let i = 0; i < maxCount; i++) {
        send.push(unconfirmedTrs[i]);
    }
    library.socket.webSocket.send('201|transactions|unconfirmed|' + JSON.stringify({send}));
};

Transactions.prototype.applyUnconfirmedList = function (ids, cb) {
    async.each(ids, function (id, cb) {
        let transaction = self.getUnconfirmedTransaction(id);
        if(!transaction)
            return cb();
        library.modules.accounts.getAccount({master_pub: transaction.senderPublicKey}, function (err, sender) {
            if (err) {
                console.log('applyUnconfirmedList getAccount err', err);
                self.removeUnconfirmedTransaction(id);
                self.addDoubleSpending(transaction);
                return setImmediate(cb);
            }
            self.applyUnconfirmed(transaction, sender, function (err) {
                if (err) {
                    console.log('applyUnconfirmedList applyUnconfirmed err', err);
                    self.removeUnconfirmedTransaction(id);
                    self.addDoubleSpending(transaction);
                }
                setImmediate(cb);
            });
        });
    }, cb);
};

Transactions.prototype.receiveTransactions = function (transactions, cb) {
    async.eachSeries(transactions, function (txObj, cb) {
        self.processUnconfirmedTransaction(txObj, true, cb);
    }, function (err) {
        transactions.forEach((item) => {
            if (typeof item.asset === "string")
                item.asset = JSON.parse(item.asset);
        });
        return cb(err, transactions);
    });
};

Transactions.prototype.removeUnconfirmedTransactionByHash = function(hash) {
    let index = privated.unconfirmedTransactionsIdIndex[hash];
    self.removeUnconfirmTransactionById(index);
};

// Events
Transactions.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Transactions.prototype.getUnconfirmedTransactionHash = function (hash) {
    let index = privated.unconfirmedTransactionsIdIndex[hash];
    let unconfirmedTransaction = privated.unconfirmedTransactions[index];
    if (unconfirmedTransaction) {
        unconfirmedTransaction.unconfirmed = 0;
        return unconfirmedTransaction;
    }
};

shared_1_0.transaction = function (params, cb) {
    let tHash = params[0] || undefined;
    if (!tHash) {
        return cb('missing params', errorCode.server.MISSING_PARAMS);
    }
    let index = privated.unconfirmedTransactionsIdIndex[tHash];

    let unconfirmedTransaction = privated.unconfirmedTransactions[index];
    if (unconfirmedTransaction) {
        unconfirmedTransaction.unconfirmed = 0;
        return cb(null, 200, unconfirmedTransaction);
    }
    // console.log(unconfirmedTransaction);

    privated.getByHash(tHash, function (err, data) {
        if (err) {
            return cb(err.msg, err.code);
        }
        data.unconfirmed = library.modules.blocks.getLastBlock.height - data.height;
        return cb(null, 200, data);
    });
};

shared_1_0.byBlockHash = function (params, cb) {
    let bHash = params[0] || undefined;
    if (!bHash) {
        return cb('missing params', errorCode.server.MISSING_PARAMS);
    }
    privated.getByBlockHash(bHash, function (err, data) {
        if (err) {
            return cb(err.msg, err.code);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.getUnconfirmedTransactions = function (params, cb) {
    let sender = params[0];
    let transactions = self.getUnconfirmedTransactionList(true);
    let toSend = [];
    if (sender) {
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].senderPublicKey === sender || transactions[i].recipientId === sender) {
                toSend.push(transactions[i]);
            }
        }
    } else {
        for (let i = 0; i < transactions.length; i++) {
            toSend.push(transactions[i]);
        }
    }
    cb(null, 200, {transactions: toSend});
};

shared_1_0.getAllTransactions = function (params, cb) {
    let height = params[0] || 0;
    let size = params[1] || 10;
    let filter = {orderBy: 'b_height'};
    filter.height = height;
    filter.limit = size;
    privated.getAllTransactions(filter, function (err, data) {
        if (err) {
            return cb(err, errorCode.server.MISSING_PARAMS);
        }
        let send = [];
        data.forEach(function (item) {
            send.push(item);
        });
        return cb(null, 200, send);
    });
};

shared_1_0.transactions = function (params, cb) {
    let address = params[0] || '';
    let page = params[1] || 1;
    let size = params[2] || 10;
    let filter = {};
    filter.page = page - 1;
    filter.address = address;
    filter.size = size;

    privated.getUserTransactions(filter, function (err, data, count) {
        if (err) {
            return cb(err, errorCode.transactions.GET_TRANSACTIONS_FAILURE);
        }
        let transactions = self.getUnconfirmedTransactionList(true);
        let send = [];
        if (page === 1) {
            for (let i = 0; i < transactions.length; i++) {
                if (transactions[i].senderId === address || transactions.recipientId) {
                    if (transactions[i].senderId === address && transactions[i].recipientId === address) {
                        transactions[i].senderType = 'self';
                    } else if (transactions[i].recipientId === address) {
                        transactions[i].senderType = 'in';
                    } else {
                        transactions[i].senderType = 'out';
                    }
                    transactions[i].isUnconfirmed = true;
                    send.push(transactions[i]);
                }
            }
        }
        data.forEach(function (item) {
            if (item.senderId === address && item.recipientId === address) {
                item.senderType = 'self';
            } else if (item.recipientId === address) {
                item.senderType = 'in';
            } else {
                item.senderType = 'out';
            }
            send.push(item);
        });
        return cb(null, 200, {data: send, count: count});
    });
};

shared_1_0.addTransaction = function (params, cb) {
    var amount = params[0] || 0;
    var publicKey = params[1] || '';
    var recipientId = params[2] || '';
    var mnemonic = params[3] || '';
    var secondSecret = params[4] || '';
    var msg = params[5] || '';
    var multisigAccountPublicKey = params[6] || undefined;
    if (!(amount && publicKey && recipientId && mnemonic)) {
        return cb("miss must params", errorCode.server.MISSING_PARAMS);
    }
    let keyPair = library.base.account.getKeypair(mnemonic);
    if (publicKey) {
        if (keyPair.getPublicKeyBuffer().toString('hex') !== publicKey) {
            return cb("Invalid passphrase", errorCode.transactions.INVALID_PASSPHRASE);
        }
    }
    var query = {};
    //正则有问题，需要修改
    var isAddress = /^[B]+[A-Za-z|0-9]{33}$/;
    if (isAddress.test(recipientId)) {
        query.master_address = recipientId;
    } else {
        query.username = recipientId;
    }
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, recipient) {
            if (err) {
                return cb(err.toString());
            }
            if (!recipient && query.username) {
                return cb("Recipient not found", errorCode.transactions.RECIPIENT_NOT_FOUND);
            }
            recipientId = recipient ? recipient.master_address : query.master_address;
            var recipientUsername = recipient ? recipient.username : null;
            library.modules.accounts.getAccount({master_pub: keyPair.getPublicKeyBuffer().toString('hex')}, function (err, account) {
                if (err) {
                    return cb(err.toString());
                }
                if (!account || !account.master_pub) {
                    return cb("Invalid account", errorCode.transactions.INVALID_ACCOUNT);
                }

                if (account.secondsign && !secondSecret) {
                    return cb("Invalid second passphrase", errorCode.transactions.INVALID_SECOND_PASSPHRASE);
                }

                var secondKeypair = null;

                if (account.secondsign) {
                    var secondHash = crypto.createHash('sha256').update(secondSecret, 'utf8').digest();
                    secondKeypair = ed.MakeKeypair(secondHash);
                }
                let lastBlock = library.modules.blocks.getLastBlock();
                let lastBlockHeight = lastBlock.height;
                if (account.lockHeight > lastBlockHeight) {
                    return cb("Account is locked", errorCode.account.IS_LOCKING);
                }
                try {
                    var transaction = library.base.transaction.create({
                        type: TransactionTypes.SEND,
                        amount: amount,
                        sender: account,
                        recipientId: recipientId,
                        keypair: keyPair,
                        secondKeypair: secondKeypair,
                        message: msg
                    });
                } catch (e) {
                    return cb(e.toString(), errorCode.transactions.ADD_TRANSACTION_FAILURE);
                }
                library.modules.transactions.receiveTransactions([transaction], cb);
            });
        });
    }, function (err, transaction) {
        if (err) {
            if(typeof err === 'object') {
                return cb(err.message, err.code);
            }
            return cb(err.toString(), errorCode.transactions.ADD_TRANSACTION_FAILURE);
        }
        return cb(null, 200, {transactionHash: transaction[0].hash});
    });
};

shared_1_0.getPackageTransactions = function (params, cb) {
    let blockTransactions = privated.getPackageTransactions();
    return cb(null, 200, blockTransactions);
};

// export
module.exports = Transactions;