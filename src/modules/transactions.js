var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var bignum = require('../utils/bignum.js');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var Sequelize = require('sequelize');
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null, shared_1_0 = {};
var constants = require('../utils/constants');

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
        delete txObj.blockId;
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
        if(txObj.recipientId.toLowerCase().match('/^[0-9]+[L|l]$/g')) {
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
                blockId: blockObj.id,
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
                blockId: blockObj.id,
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
    var sortFields = ['t.id', 't.blockId', 't.amount', 't.fee', 't.type', 't.timestamp', 't.senderPublicKey', 't.senderId', 't.recipientId', 't.senderUsername', 't.recipientUsername', 't.confirmations', 'b.height'];
    var fields = {}, fields_or = [], owner = '';

    if (filter.blockId) {
        fields_or.push('blockId = $blockId');
        fields.blockId = filter.blockId;
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
    // if (filter.orderBy) {
    //     filter.orderBy =
    // }
    // if (sortBy) {
    //     if (sortFields.indexOf(sortBy) < 0) {
    //         return cb("Invalid sort field");
    //     }
    // }
    if (filter.limit > 100) {
        return cb("Invalid limit. Maximum is 100");
    }

    library.dbClient.query('SELECT COUNT(t.id) AS count ' +
        'FROM transactions t ' +
        'INNER JOIN blocks b on t.blockId = b.id ' +
        (fields_or.length || owner ? 'WHERE ' : '') + ' ' +
        (fields_or.length ? '(' + fields_or.join(' or ') + ') ' : '') + (fields_or.length && owner ? ' AND ' + owner : owner), {
        type: Sequelize.QueryTypes.SELECT,
        bind: fields
    }).then(function (rows) {
        var count = rows.length ? rows[0].count : 0;

        library.dbClient.query('SELECT t.id AS t_id, b.height AS b_height, t.blockId AS t_blockId, t.type AS t_type, t.timestamp AS t_timestamp, lower(t.senderPublicKey) AS t_senderPublicKey, t.senderId AS t_senderId, t.recipientId AS t_recipientId, t.senderUsername AS t_senderUsername, t.recipientUsername AS t_recipientUsername, t.amount AS t_amount, t.fee AS t_fee, lower(t.signature) AS t_signature, lower(t.signSignature) AS t_signSignature, (SELECT MAX(height) + 1 FROM blocks) AS t_confirmations ' +
            'FROM transactions t ' +
            'INNER JOIN blocks b on t.blockId = b.id ' +
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

privated.getById = function (id, cb) {
    library.dbClient.query('SELECT t.id AS t_id, b.height AS b_height, t.blockId AS t_blockId, t.type AS t_type, t.timestamp AS t_timestamp, lower(t.senderPublicKey) AS t_senderPublicKey, t.senderId AS t_senderId, t.recipientId AS t_recipientId, t.senderUsername AS t_senderUsername, t.recipientUsername AS t_recipientUsername, t.amount AS t_amount, t.fee AS t_fee, lower(t.signature) AS t_signature, lower(t.signSignature) AS t_signSignature, (SELECT MAX(height) + 1 FROM blocks) AS t_confirmations ' +
        'FROM transactions t ' +
        'INNER JOIN blocks b on t.blockId = b.id WHERE t.id = $id', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            id: id
        }
    }).then(function (rows) {
        if (!rows.length) {
            return cb("Can't find transaction: " + id);
        }

        var txObj = library.base.transaction.load(rows[0]);
        cb(null, txObj);
    }, function (err) {
        cb(err, undefined);
    });
};

privated.getByBlockId = function(id, cb) {
    library.dbClient.query(`SELECT * FROM transactions where blockId = ${id}`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        if(!rows.length) {
            return cb("Can't find transaction: " + id);
        }
        return cb(null, rows);
    }).catch((err) => {
        return cb(err);
    });
};

privated.addUnconfirmedTransaction = function (txObj, sender, cb) {
    self.applyUnconfirmed(txObj, sender, function (err) {
        if (err) {
            self.addDoubleSpendingTransaction(txObj);
            return setImmediate(cb, err);
        }

        privated.unconfirmedTransactions.push(txObj);
        var index = privated.unconfirmedTransactions.length - 1;
        privated.unconfirmedTransactionsIdIndex[txObj.id] = index;

        setImmediate(cb);
    });
};

// public methods
Transactions.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Transactions.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};


Transactions.prototype.getUnconfirmedTransactionById = function (id) {
    var index = privated.unconfirmedTransactionsIdIndex[id];
    return privated.unconfirmedTransactions[index];
};

Transactions.prototype.undoUnconfirmedList = function (cb) {
    var ids = [];
    async.eachSeries(privated.unconfirmedTransactions, function (transaction, cb) {
        if (transaction !== false) {
            ids.push(transaction.id);
            self.undoUnconfirmed(transaction, cb);
        } else {
            setImmediate(cb);
        }
    }, function (err) {
        cb(err, ids);
    })
};

Transactions.prototype.addDoubleSpendingTransaction = function (txObj) {
    privated.doubleSpendingTransactions[txObj.id] = txObj;
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
    var index = privated.unconfirmedTransactionsIdIndex[id];
    delete privated.unconfirmedTransactionsIdIndex[id];
    privated.unconfirmedTransactions[index] = false;
};

Transactions.prototype.processUnconfirmedTransaction = function (txObj, broadcast, cb) {
    library.modules.accounts.setAccountAndGet({master_pub: txObj.senderPublicKey}, function (err, sender) {
        function done(err) {
            if (err) {
                return cb(err);
            }

            privated.addUnconfirmedTransaction(txObj, sender, function (err) {
                if (err) {
                    return cb(err);
                }

                library.notification_center.notify('unconfirmedTransaction', txObj, broadcast);

                cb();
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
                    if (privated.unconfirmedTransactionsIdIndex[txObj.id] !== undefined || privated.doubleSpendingTransactions[txObj.id]) {
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
                if (privated.unconfirmedTransactionsIdIndex[txObj.id] !== undefined || privated.doubleSpendingTransactions[txObj.id]) {
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
    if (!sender && txObj.blockId != genesisblock.block.id) {
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
    var index = privated.unconfirmedTransactionsIdIndex[id];
    return privated.unconfirmedTransactions[index];
};

Transactions.prototype.removeUnconfirmedTransaction = function (id) {
    var index = privated.unconfirmedTransactionsIdIndex[id];
    delete privated.unconfirmedTransactionsIdIndex[id];
    privated.unconfirmedTransactions[index] = false;
};

Transactions.prototype.addDoubleSpending = function (transaction) {
    privated.doubleSpendingTransactions[transaction.id] = transaction;
};

Transactions.prototype.applyUnconfirmedList = function (ids, cb) {
    async.eachSeries(ids, function (id, cb) {
        var transaction = self.getUnconfirmedTransaction(id);
        library.modules.accounts.setAccountAndGet({publicKey: transaction.senderPublicKey}, function (err, sender) {
            if (err) {
                self.removeUnconfirmedTransaction(id);
                self.addDoubleSpending(transaction);
                return setImmediate(cb);
            }
            self.applyUnconfirmed(transaction, sender, function (err) {
                if (err) {
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
        cb(err, transactions);
    });
};

// Events
Transactions.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

shared_1_0.transaction = function(params, cb) {
    let tId = params[0] || undefined;
    if(!tId) {
        return cb('missing params', 21000);
    }
    // privated.getByTrsId(tId, function (err, data) {
    privated.getById(tId, function (err, data) {
        if(err) {
            return cb(err, 21000);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.byBlockId = function(params, cb) {
    let bId = params[0] || undefined;
    if(!bId) {
        return cb('missing params', 21000);
    }
    privated.getByBlockId(bId, function (err, data) {
        if(err) {
            return cb(err, 21000);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.transactions = function(params, cb) {
    let publicKey = params[0] || undefined;
    let page = params[1] || 1;
    let size = params[2] || 10;
    let limit = (page - 1) * size;
    let offset = size;
    if(!publicKey) {
        return cb('missing params', 21000);
    }
    let filter = {
        senderPublicKey: publicKey,
        limit: limit,
        offset: offset,
        orderBy: 'b_height'
    };
    privated.list(filter, function (err, data) {
        if(err) {
            return cb(err, 21000);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.addTransactions = function(params, cb) {

    var hash = crypto.createHash('sha256').update(params.secret, 'utf8').digest();
    var keypair = ed.MakeKeypair(hash);
    if (params.publicKey) {
        if (keypair.publicKey.toString('hex') != params.publicKey) {
            return cb("Invalid passphrase");
        }
    }
    var query = {};
    var isAddress = /^[0-9]+[L|l]$/g;
    if (isAddress.test(params.recipientId)) {
        query.master_address = params.recipientId;
    } else {
        query.username = params.recipientId;
    }
    library.balancesSequence.add(function (cb) {
        library.modules.accounts.getAccount(query, function (err, recipient) {
            if(err) {
                return cb(err.toString());
            }
            if (!recipient && query.username) {
                return cb("Recipient not found");
            }
            var recipientId = recipient ? recipient.master_address : params.recipientId;
            var recipientUsername = recipient ? recipient.username : null;

            if (params.multisigAccountPublicKey && params.multisigAccountPublicKey !== keypair.publicKey.toString('hex')) {
                library.modules.accounts.getAccount({publicKey: params.multisigAccountPublicKey}, function (err, account) {
                    if (err) {
                        return cb(err.toString());
                    }
                    if (!account || !account.publicKey) {
                        return cb("Multisignature account not found");
                    }

                    if (!account || !account.multisignatures) {
                        return cb("Account does not have multisignatures enabled");
                    }

                    if (account.multisignatures.indexOf(keypair.publicKey.toString('hex')) < 0) {
                        return cb("Account does not belong to multisignature group");
                    }
                    library.modules.accounts.getAccount({master_pub: keypair.publicKey}, function (err, requester) {
                        if (err) {
                            return cb(err.toString());
                        }
                        if (!requester || !requester.master_pub) {
                            return cb("Invalid requester");
                        }
                        if (requester.secondSignature && !body.secondSecret) {
                            return cb("Invalid second passphrase");
                        }
                        if (requester.master_pub == account.master_pub) {
                            return cb("Invalid requester");
                        }
                        var secondKeypair = null;
                        if (requester.secondsign) {
                            var secondHash = crypto.createHash('sha256').update(params.secondSecret, 'utf8').digest();
                            secondKeypair = ed.MakeKeypair(secondHash);
                        }
                        try {
                            var transaction = library.base.transaction.create({
                                type: TransactionTypes.SEND,
                                amount: params.amount,
                                sender: account,
                                recipientId: recipientId,
                                recipientUsername: recipientUsername,
                                keypair: keypair,
                                requester: keypair,
                                secondKeypair: secondKeypair
                            });
                        } catch (e) {
                            return cb(e.toString());
                        }
                        library.modules.transactions.receiveTransactions([transaction], cb);
                    });
                });
            } else {
                library.modules.accounts.getAccount({master_pub: keypair.publicKey.toString('hex')}, function (err, account) {
                    if (err) {
                        return cb(err.toString());
                    }
                    if (!account || !account.master_pub) {
                        return cb("Invalid account");
                    }

                    if (account.secondsign && !params.secondSecret) {
                        return cb("Invalid second passphrase");
                    }

                    var secondKeypair = null;

                    if (account.secondsign) {
                        var secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
                        secondKeypair = ed.MakeKeypair(secondHash);
                    }

                    try {
                        var transaction = library.base.transaction.create({
                            type: TransactionTypes.SEND,
                            amount: params.amount,
                            sender: account,
                            recipientId: recipientId,
                            recipientUsername: recipientUsername,
                            keypair: keypair,
                            secondKeypair: secondKeypair
                        });
                    } catch (e) {
                        return cb(e.toString());
                    }
                    library.modules.transactions.receiveTransactions([transaction], cb);
                });
            }
        });
    }, function (err, transaction) {
        if (err) {
            return cb(err.toString(), 21000);
        }
        cb(null, 200, {transactionId: transaction[0].id});
    });

};

shared.addTransactions = function (req, cb) {
    var body = req.body;
    library.schema.validate(body, {
        type: "object",
        properties: {
            secret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            amount: {
                type: "integer",
                minimum: 1,
                maximum: constants.totalAmount
            },
            recipientId: {
                type: "string",
                minLength: 1
            },
            publicKey: {
                type: "string",
                format: "publicKey"
            },
            secondSecret: {
                type: "string",
                minLength: 1,
                maxLength: 100
            },
            multisigAccountPublicKey: {
                type: "string",
                format: "publicKey"
            }
        },
        required: ["secret", "amount", "recipientId"]
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        var hash = crypto.createHash('sha256').update(body.secret, 'utf8').digest();
        var keypair = ed.MakeKeypair(hash);

        if (body.publicKey) {
            if (keypair.publicKey.toString('hex') != body.publicKey) {
                return cb("Invalid passphrase");
            }
        }

        var query = {};

        var isAddress = /^[0-9]+[L|l]$/g;
        if (isAddress.test(body.recipientId)) {
            query.address = body.recipientId;
        } else {
            query.username = body.recipientId;
        }

        library.balancesWorkQueue.add(function (cb) {
            library.modules.accounts.getAccount(query, function (err, recipient) {
                if (err) {
                    return cb(err.toString());
                }
                if (!recipient && query.username) {
                    return cb("Recipient not found");
                }
                var recipientId = recipient ? recipient.address : body.recipientId;
                var recipientUsername = recipient ? recipient.username : null;

                if (body.multisigAccountPublicKey && body.multisigAccountPublicKey != keypair.publicKey.toString('hex')) {
                    library.modules.accounts.getAccount({publicKey: body.multisigAccountPublicKey},function (err, account) {
                        if (err) {
                            return cb(err.toString());
                        }

                        if (!account || !account.publicKey) {
                            return cb("Multisignature account not found");
                        }

                        if (!account || !account.multisignatures) {
                            return cb("Account does not have multisignatures enabled");
                        }

                        if (account.multisignatures.indexOf(keypair.publicKey.toString('hex')) < 0) {
                            return cb("Account does not belong to multisignature group");
                        }

                        library.modules.accounts.getAccount({publicKey: keypair.publicKey}, function (err, requester) {
                            if (err) {
                                return cb(err.toString());
                            }

                            if (!requester || !requester.publicKey) {
                                return cb("Invalid requester");
                            }

                            if (requester.secondsign && !body.secondSecret) {
                                return cb("Invalid second passphrase");
                            }

                            if (requester.publicKey == account.publicKey) {
                                return cb("Invalid requester");
                            }

                            var secondKeypair = null;

                            if (requester.secondsign) {
                                var secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
                                secondKeypair = ed.MakeKeypair(secondHash);
                            }

                            try {
                                var transaction = library.base.transaction.create({
                                    type: TransactionTypes.SEND,
                                    amount: body.amount,
                                    sender: account,
                                    recipientId: recipientId,
                                    recipientUsername: recipientUsername,
                                    keypair: keypair,
                                    requester: keypair,
                                    secondKeypair: secondKeypair
                                });
                            } catch (e) {
                                return cb(e.toString());
                            }
                            library.modules.transactions.receiveTransactions([transaction], cb);
                        });
                    });
                } else {
                    library.modules.accounts.getAccount({publicKey: keypair.publicKey.toString('hex')}, function (err, account) {
                        if (err) {
                            return cb(err.toString());
                        }
                        if (!account || !account.publicKey) {
                            return cb("Invalid account");
                        }

                        if (account.secondsign && !body.secondSecret) {
                            return cb("Invalid second passphrase");
                        }

                        var secondKeypair = null;

                        if (account.secondsign) {
                            var secondHash = crypto.createHash('sha256').update(body.secondSecret, 'utf8').digest();
                            secondKeypair = ed.MakeKeypair(secondHash);
                        }

                        try {
                            var transaction = library.base.transaction.create({
                                type: TransactionTypes.SEND,
                                amount: body.amount,
                                sender: account,
                                recipientId: recipientId,
                                recipientUsername: recipientUsername,
                                keypair: keypair,
                                secondKeypair: secondKeypair
                            });
                        } catch (e) {
                            return cb(e.toString());
                        }
                        self.receiveTransactions([transaction], cb);
                    });
                }
            });
        }, function (err, transaction) {
            if (err) {
                return cb(err.toString());
            }

            cb(null, {transactionId: transaction[0].id});
        });
    });
};

// export
module.exports = Transactions;