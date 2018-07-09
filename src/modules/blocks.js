var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');
var util = require('util');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var blockStatus = require('../utils/blockStatus.js');
var csvtojson = require('csvtojson');
var	ip = require('ip');
var Json2csv = require('json2csv').Parser;

var header = ['b_id', 'b_version', 'b_timestamp', 'b_height', 'b_previousBlock', 'b_numberOfTransactions', 'b_totalAmount', 'b_totalFee','b_reward', 'b_payloadLength', 'b_payloadHash','b_generatorPublicKey','b_blockSignature','t_id',
    't_type','t_timestamp','t_senderPublicKey', 't_senderId','t_recipientId','t_senderUsername','t_recipientUsername','t_amount','t_fee','t_signature','t_signSignature','s_publicKey','d_username','v_votes','c_address','u_alias',
    'm_min','m_lifetime','m_keysgroup','dapp_name','dapp_description','dapp_tags','dapp_type','dapp_siaAscii','dapp_siaIcon','dapp_git','dapp_category','dapp_icon','in_dappId','ot_dappId','ot_outTransactionId','t_requesterPublicKey','t_signatures'];

require('array.prototype.findindex'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null;

privated.loaded = false;
privated.isActive = false;
privated.lastBlock = {};
privated.blockStatus = new blockStatus();
// @formatter: off
privated.blocksDataFields = {
    'b_id': String,
    'b_version': String,
    'b_timestamp': Number,
    'b_height': Number,
    'b_previousBlock': String,
    'b_numberOfTransactions': String,
    'b_totalAmount': String,
    'b_totalFee': String,
    'b_reward': String,
    'b_payloadLength': String,
    'b_payloadHash': String,
    'b_generatorPublicKey': String,
    'b_blockSignature': String,
    't_id': String,
    't_type': Number,
    't_timestamp': Number,
    't_senderPublicKey': String,
    't_senderId': String,
    't_recipientId': String,
    't_senderUsername': String,
    't_recipientUsername': String,
    't_amount': String,
    't_fee': String,
    't_signature': String,
    't_signSignature': String,
    's_publicKey': String,
    'd_username': String,
    'v_votes': String,
    'c_address': String,
    'u_alias': String,
    'm_min': Number,
    'm_lifetime': Number,
    'm_keysgroup': String,
    'dapp_name': String,
    'dapp_description': String,
    'dapp_tags': String,
    'dapp_type': Number,
    'dapp_siaAscii': String,
    'dapp_siaIcon': String,
    'dapp_git': String,
    'dapp_category': Number,
    'dapp_icon': String,
    'in_dappId': String,
    'ot_dappId': String,
    'ot_outTransactionId': String,
    't_requesterPublicKey': String,
    't_signatures': String
};

// constructor
function Blocks(cb, scope) {
    library = scope;
    genesisblock = library.genesisblock;
    self = this;
    self.__private = privated;

    privated.saveGenesisBlock(function (err) {
        setImmediate(cb, err, self);
    });
}

// private methods
privated.saveGenesisBlock = function (cb) {
    library.dbClient.query("SELECT id FROM blocks WHERE id = $id", {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            id: genesisblock.block.id
        }
    }).then(function (rows) {
        var blockId = rows.length && rows[0].id;

        if (!blockId) {
            privated.saveBlock(genesisblock.block, function (err) {
                if (err) {
                    library.log.Error("saveBlock", "Error", err.toString());
                }

                return cb(err);
            });
        } else {
            return cb();
        }
    }, function (err) {
        cb(err, undefined);
    });
};

privated.saveBlock = function (blockObj, cb) {

    library.dbClient.transaction(function (t1) {
        var save_records = [];
        save_records.push(library.base.block.save(blockObj, t1, function (err) {
            if (err) {
                library.log.Error("saveBlock", "Error", err.toString());
            }
        }));
        blockObj.transactions.forEach(function (txObj) {
            txObj.blockId = blockObj.id;
            save_records.push(library.base.transaction.save(txObj, t1, function (err) {
                if (err) {
                    library.log.Error("saveBlock", "Error", err.toString());
                }
            }));
        });
        return Promise.all(save_records).then(() => {
            library.log.Debug("saveBlock successed");
            cb();
        }).catch((err) => {
            library.log.Error("saveBlock failed", "Error", err.toString());
            cb(err);
        });
    });
};

privated.deleteBlock = function (blockId, cb) {
    library.dbClient.query(`DELETE FROM blocks WHERE id = ${blockId}`, {
        type: Sequelize.QueryTypes.DELETE
    }).then((data) => {
        cb(null, data);
    }).catch((err) => {
        cb(err);
    });
};

privated.list = function (filter, cb) {
    var sortFields = ['b.id', 'b.timestamp', 'b.height', 'b.previousBlock', 'b.totalAmount', 'b.totalFee', 'b.reward', 'b.numberOfTransactions', 'b.generatorPublicKey'];
    var params = {}, fields = [], sortMethod = '', sortBy = '';
    if (filter.generatorPublicKey) {
        fields.push('lower(hex(generatorPublicKey)) = $generatorPublicKey');
        params.generatorPublicKey = filter.generatorPublicKey;
    }
    if (filter.numberOfTransactions) {
        fields.push('numberOfTransactions = $numberOfTransactions');
        params.numberOfTransactions = filter.numberOfTransactions;
    }
    if (filter.previousBlock) {
        fields.push('previousBlock = $previousBlock');
        params.previousBlock = filter.previousBlock;
    }
    if (filter.height === 0 || filter.height > 0) {
        fields.push('height = $height');
        params.height = filter.height;
    }
    if (filter.totalAmount >= 0) {
        fields.push('totalAmount = $totalAmount');
        params.totalAmount = filter.totalAmount;
    }
    if (filter.totalFee >= 0) {
        fields.push('totalFee = $totalFee');
        params.totalFee = filter.totalFee;
    }
    if (filter.reward >= 0) {
        fields.push('reward = $reward');
        params.reward = filter.reward;
    }
    if (filter.orderBy) {
        var sort = filter.orderBy.split(':');
        sortBy = sort[0].replace(/[^\w\s]/gi, '');
        sortBy = "b." + sortBy;
        if (sort.length == 2) {
            sortMethod = sort[1] == 'desc' ? 'desc' : 'asc';
        } else {
            sortMethod = 'desc';
        }
    }
    if (sortBy) {
        if (sortFields.indexOf(sortBy) < 0) {
            return cb("Invalid sort field");
        }
    }
    if (!filter.limit) {
        filter.limit = 100;
    }
    if (!filter.offset) {
        filter.offset = 0;
    }
    params.limit = filter.limit;
    params.offset = filter.offset;
    if (filter.limit > 100) {
        return cb("Invalid limit. Maximum is 100");
    }
    library.dbClient.query(`SELECT count(b.id) as Number FROM blocks b ${fields.length ? "WHERE " + fields.join(' and ') : ''}`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        let count = rows[0].count;
        library.dbClient.query('SELECT b.id, b.version, b.timestamp, b.height, b.previousBlock, b.numberOfTransactions, b.totalAmount, b.totalFee, b.reward, b.payloadLength, lower(hex(b.payloadHash)), lower(hex(b.generatorPublicKey)), lower(hex(b.blockSignature)), (select max(height) + 1 from blocks) - b.height' +
        "from blocks b " + (fields.length ? "where " + fields.join(' and ') : '') + " " +
        (filter.orderBy ? 'order by ' + sortBy + ' ' + sortMethod : '') + ` limit ${params.limit} offset ${params.offset} `, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            var blocks = [];
            for (var i = 0; i < rows.length; i++) {
                blocks.push(library.base.block.dbRead(rows[i]));
            }
            var data = {
                blocks: blocks,
                count: count
            };
            cb(null, data);
        }).catch((err) => {
            library.log.Error(err);
            return cb(err);
        });
    }).catch((err) => {
        return cb(err);
    });
};

privated.getById = function (id, cb) {
    library.dbClient.query('SELECT b.id, b.version, b.timestamp, b.height, b.previousBlock, b.numberOfTransactions, b.totalAmount, b.totalFee, b.reward, b.payloadLength,  b.payloadHash, b.generatorPublicKey, b.blockSignature, (select max(height) + 1 from blocks) - b.height ' +
        'from blocks b ' +
        `where b.id = ${id}`, {
            type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        rows.forEach(function (block) {
            block.blockSignature = block.blockSignature.toString('utf8');
            block.generatorPublicKey = block.generatorPublicKey.toString('utf8');
            block.payloadHash = block.payloadHash.toString('utf8');
        });
        var block = library.base.block.dbRead(rows[0]);
        cb(null, block);
    }).catch((err) => {
        cb(err);
    });
};

privated.popLastBlock = function (oldLastBlock, cb) {

};

privated.getIdSequence = function (height, cb) {
    library.dbClient.query('SELECT height AS firstHeight, id AS ids FROM blocks ORDER BY height DESC LIMIT 1',{
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows[0]);
    }).catch((error) => {
        cb(error);
    });
};

privated.readDbRows = function (rows) {
    var blocks = {};
    var order = [];
    for (var i = 0, length = rows.length; i < length; i++) {
        var __block = library.base.block.dbRead(rows[i]);
        if (__block) {
            if (!blocks[__block.id]) {
                if (__block.id == genesisblock.block.id) {
                    __block.generationSignature = (new Array(65)).join('0');
                }
                order.push(__block.id);
                blocks[__block.id] = __block;
            }

            var __transaction = library.base.transaction.dbRead(rows[i]);
            blocks[__block.id].transactions = blocks[__block.id].transactions || {};
            if (__transaction) {
                if (!blocks[__block.id].transactions[__transaction.id]) {
                    blocks[__block.id].transactions[__transaction.id] = __transaction;
                }
            }
        }
    }

    blocks = order.map(function (v) {
        blocks[v].transactions = Object.keys(blocks[v].transactions).map(function (t) {
            return blocks[v].transactions[t];
        });
        return blocks[v];
    });

    return blocks;
};

privated.applyTransaction = function (block, transaction, sender, cb) {
    library.modules.transactions.applyUnconfirmed(transaction, sender, function (err) {
        if (err) {
            return setImmediate(cb, {
                message: err,
                transaction: transaction,
                block: block
            });
        }

        library.modules.transactions.apply(transaction, block, sender, function (err) {
            if (err) {
                return setImmediate(cb, {
                    message: "Can't apply transaction: " + transaction.id,
                    transaction: transaction,
                    block: block
                });
            }
            setImmediate(cb);
        });
    });
};

// public methods
Blocks.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Blocks.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Blocks.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Blocks.prototype.getCommonBlock = function(peer, height, cb) {
    var commonBlock = null;
    var lastBlockHeight = height;
    var count = 0;

    async.whilst(
        function () {
            return !commonBlock && count < 30 && lastBlockHeight > 1;
        },
        function (next) {
            count++;
            privated.getIdSequence(lastBlockHeight, function (err, data) {
                if(err) {
                    return next(err);
                }
                let max = lastBlockHeight;
                lastBlockHeight = data.firstHeight;
                library.modules.kernel.getFromPeer(peer, {
                    api: "/blocks/common?ids=" + data.ids + ',&max=' + max + '&min=' + lastBlockHeight,
                    method: "GET"
                // library.modules.kernel.getFromPeerNews(peer, {
                //     api:'kernel',
                //     method:'POST',
                //     func:'blocks_common',
                //     data: JSON.stringify({
                //         ids: data.ids,
                //         max: max,
                //         min: lastBlockHeight
                //     }),
                //     id: Math.random(),
                //     jsonrpc: '1.0'
                }, function (err, data) {
                    if (err) {
                        return next(err || data.message);
                    }
                    var cBlock = data.body.common || null;
                    if (!cBlock) {
                        return next();
                    }
                    library.dbClient.query(`SELECT COUNT(*) as cnt from blocks where id="${cBlock.id}" and height=${cBlock.height}`,{
                        type:Sequelize.QueryTypes.SELECT
                    }).then((rows) => {
                        if(!rows.length) {
                            return next("Can't compare blocks");
                        }
                        if (rows[0].cnt) {
                            commonBlock = cBlock;
                        }
                        next();
                    }).catch((err) => {
                        setImmediate(cb, err, commonBlock);
                    });
                });
            });
        },
        function (err) {
            setImmediate(cb, err, commonBlock);
        }
    );
};

Blocks.prototype.deleteBlocksBefore = function (block, cb) {
    var blocks = [];

    async.whilst(
        function () {
            return !(block.height >= privated.lastBlock.height);
        },
        function (next) {
            blocks.unshift(privated.lastBlock);
            privated.popLastBlock(privated.lastBlock, function (err, newLastBlock) {
                privated.lastBlock = newLastBlock;
                next(err);
            });
        },
        function (err) {
            setImmediate(cb, err, blocks);
        }
    );
};

Blocks.prototype.getLastBlock = function() {
    return privated.lastBlock;
};

Blocks.prototype.onReceiveBlock = function (blockObj) {

};

Blocks.prototype.loadBlocksFromPeer = function(peer, lastCommonBlockId, cb) {
    var loaded = false;
    var count = 0;
    var lastValidBlock = null;

    async.whilst(
        function () {
            return !loaded && count < 30;
        },
        function (next) {
            async.waterfall([
                function (cb) {
                    count++;
                    library.modules.kernel.getFromPeer(peer, {
                        method: "GET",
                        api: '/blocks?lastBlockId=' + lastCommonBlockId
                    // library.modules.kernel.getFromPeerNews(peer, {
                    //     api:'kernel',
                    //     method:'POST',
                    //     func:'blocks',
                    //     data: lastCommonBlockId,
                    //     id: Math.random(),
                    //     jsonrpc: '1.0'
                    }, function (err, data) {
                        if (err) {
                            return next(err || data.message);
                        }
                        let blocks = data.body.blocks;
                        let blocksTemp = [];
                        if (typeof blocks === 'string') {
                            csvtojson({
                                noheader: true,
                                headers: header
                            }).fromString(blocks).subscribe((csvLine) => {
                                blocksTemp.push(csvLine);
                            }).then(() => {
                                blocks = privated.readDbRows(blocksTemp);
                                cb(null, blocks, data);
                            }).catch((err) => {
                                cb(err);
                            });
                        }
                    });
                }, function (blocks, data, cb) {
                    async.eachSeries(blocks, function (block, cb) {
                        try {
                            block = library.base.block.objectNormalize(block);
                        } catch (e) {
                            var peerStr = data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
                            library.log.Debug('Block ' + (block ? block.id : 'null') + ' is not valid, ban 60 min', peerStr);
                            library.modules.peer.state(peer.ip, peer.port, 0, 3600);
                            cb(e.toString());
                        }
                        self.processBlock(block, false, function (err) {
                            if (!err) {
                                lastCommonBlockId = block.id;
                                lastValidBlock = block;
                                cb();
                            } else {
                                var peerStr = data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
                                library.log.Info('Block ' + (block ? block.id : 'null') + ' is not valid, ban 60 min', peerStr);
                                library.modules.peer.state(peer.ip, peer.port, 0, 3600, function (err) {
                                    if(err) {
                                       cb(err);
                                    }
                                });
                            }
                        });
                    }, cb);
                }
            ], function (err, data) {
                if(err) {
                    return setImmediate(cb, err);
                } else {
                    cb();
                }
            });
        },
        function (err) {
            setImmediate(cb, err, lastValidBlock);
        });
};

Blocks.prototype.loadBlocksOffset = function(limit, offset, verify, cb) {
    var newLimit = limit + (offset || 0);
    var params = {limit: newLimit, offset: offset || 0};

    library.dbSequence.add(function (cb) {
        library.dbClient.query('SELECT b.id as b_id, b.version as b_version, b.timestamp as b_timestamp, b.height as b_height, b.previousBlock as b_previousBlock, b.numberOfTransactions as b_numberOfTransactions, b.totalAmount as b_totalAmount, b.totalFee as b_totalFee, b.reward as b_reward, b.payloadLength as b_payloadLength, b.payloadHash as b_payloadHash, b.generatorPublicKey as b_generatorPublicKey,  lower(b.blockSignature) as b_blockSignature, ' +
            't.id as t_id, t.type as t_type, t.timestamp as t_timestamp, t.senderPublicKey as t_senderPublicKey, t.senderId as t_senderId, t.recipientId as t_recipientId, t.senderUsername as t_senderUsername, t.recipientUsername as t_recipientUsername, t.amount as t_amount, t.fee as t_fee, t.signature as t_signature, t.signSignature as t_signSignature,  ' +
            's.publicKey as s_publicKey, ' +
            'd.username as d_username, ' +
            'c.address as c_address, ' +
            'u.username as u_alias,' +
            'm.min as m_min, m.lifetime as m_lifetime, m.keysgroup as m_keysgroup, ' +
            't.requesterPublicKey as t_requesterPublicKey, t.signatures as t_signatures ' +
            "FROM blocks b " +
            "left outer join transactions as t on t.blockId=b.id " +
            "left outer join delegates as d on d.transactionId=t.id " +
            "left outer join signatures as s on s.transactionId=t.id " +
            "left outer join contacts as c on c.transactionId=t.id " +
            "left outer join usernames as u on u.transactionId=t.id " +
            "left outer join multisignatures as m on m.transactionId=t.id " +
            `where b.height >= ${params.offset} and b.height < ${params.limit} ` +
            "ORDER BY b.height, t.id", {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            var blocks = privated.readDbRows(rows);
            blocks.forEach(function (block) {
                block.blockSignature = block.blockSignature.toString('utf8');
                block.generatorPublicKey = block.generatorPublicKey.toString('utf8');
                block.payloadHash = block.payloadHash.toString('utf8');
            });
            async.eachSeries(blocks, function (block, cb) {
                async.series([
                    function (cb) {
                        if (block.id !== genesisblock.block.id) {
                            if (verify) {
                                if (block.previousBlock !== privated.lastBlock.id) {
                                    return cb({
                                        message: "Can't verify previous block",
                                        block: block
                                    });
                                }
                                try {
                                    var valid = library.base.block.verifySignature(block);
                                } catch (e) {
                                    return setImmediate(cb, {
                                        message: e.toString(),
                                        block: block
                                    });
                                }
                                if (!valid) {
                                    // Need to break cycle and delete this block and blocks after this block
                                    return cb({
                                        message: "Can't verify signature",
                                        block: block
                                    });
                                }
                                cb();
                            } else {
                                setImmediate(cb);
                            }
                        } else {
                            setImmediate(cb);
                        }
                    }, function (cb) {
                        block.transactions = block.transactions.sort(function (a, b) {
                            if (block.id === genesisblock.block.id) {
                                if (a.type === TransactionTypes.VOTE)
                                    return 1;
                            }

                            if (a.type === TransactionTypes.SIGNATURE) {
                                return 1;
                            }

                            return 0;
                        });
                        async.eachSeries(block.transactions, function (transaction, cb) {
                            if (verify) {
                                library.modules.accounts.setAccountAndGet({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                    if (err) {
                                        return cb({
                                            message: err,
                                            transaction: transaction,
                                            block: block
                                        });
                                    }
                                    if (block.id !== genesisblock.block.id) {
                                        library.base.transaction.verify(transaction, sender, function (err) {
                                            if (err) {
                                                return setImmediate(cb, {
                                                    message: err,
                                                    transaction: transaction,
                                                    block: block
                                                });
                                            }
                                            privated.applyTransaction(block, transaction, sender, cb);
                                        });
                                    } else {
                                        privated.applyTransaction(block, transaction, sender, cb);
                                    }
                                });
                            } else {
                                setImmediate(cb);
                            }
                        }, function (err) {
                            if(err) {
                                // library.log.Error(err.message.stack);
                                console.log(err.message.stack);
                                var lastValidTransaction = block.transactions.findIndex(function (trs) {
                                    return trs.id == err.transaction.id;
                                });
                                var transactions = block.transactions.slice(0, lastValidTransaction + 1);
                                async.eachSeries(transactions.reverse(), function (transaction, cb) {
                                    async.series([
                                        function (cb) {
                                            library.modules.accounts.getAccount({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                                if (err) {
                                                    return cb(err);
                                                }
                                                library.modules.transactions.undo(transaction, block, sender, cb);
                                            });
                                        }, function (cb) {
                                            library.modules.transactions.undoUnconfirmed(transaction, cb);
                                        }
                                    ], cb);
                                }, cb);
                            } else {
                                privated.lastBlock = block;
                                library.modules.round.tick(privated.lastBlock, cb);
                            }
                        });
                    }
                ], cb);
            }, function (err) {
                cb(err, privated.lastBlock);
            });
        }).catch((err) => {
            console.log(err);
        });
    }, cb);
};

Blocks.prototype.simpleDeleteAfterBlock = function (blockId, cb) {
    // library.dbClient.query(`DELETE FROM blocks WHERE height not in (SELECT height FROM blocks where id = ${blockId}) `, {
    library.dbClient.query(`DELETE FROM blocks WHERE height >= (SELECT height from (SELECT height FROM blocks where id = ${blockId}) a) `, {
        type: Sequelize.QueryTypes.DELETE
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};


Blocks.prototype.count = function(cb) {
    library.dbClient.query('SELECT count(id) as Number from blocks', {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows[0].Number);
    }).catch((err) => {
        return cb(err);
    });
};

Blocks.prototype.processBlock = function(block, broadcast, cb) {
    // if (!privated.loaded) {
    //     return setImmediate(cb, "Blockchain is loading");
    // }
    privated.isActive = true;
    library.balancesSequence.add(function (cb) {
        try {
            block.id = library.base.block.getId(block);
        } catch (e) {
            privated.isActive = false;
            return setImmediate(cb, e.toString());
        }
        block.height = privated.lastBlock.height + 1;

        library.modules.transactions.undoUnconfirmedList(function (err, unconfirmedTransactions) {
            if (err) {
                privated.isActive = false;
                return process.exit(0);
            }
            function done(err) {
                // setImmediate(cb, err);
                library.modules.transactions.applyUnconfirmedList(unconfirmedTransactions, function () {
                    privated.isActive = false;
                    setImmediate(cb, err);
                });
            }

            if (!block.previousBlock && block.height != 1) {
                return setImmediate(done, "Invalid previous block");
            }
            var expectedReward = privated.blockStatus.calcReward(block.height);
            if (block.height != 1 && expectedReward !== block.reward) {
                return setImmediate(done, "Invalid block reward");
            }
            library.dbClient.query(`SELECT id FROM blocks WHERE id=${block.id}`,{
                type:Sequelize.QueryTypes.SELECT
            }).then((rows) => {
                let bId = rows.length && rows[0].id;
                if (bId) {
                    return done("Block already exists: " + block.id);
                }
                try {
                    var valid = library.base.block.verifySignature(block);
                } catch (e) {
                    return setImmediate(cb, e.toString());
                }
                if (!valid) {
                    return done("Can't verify signature: " + block.id);
                }
                if (block.previousBlock != privated.lastBlock.id) {
                    // Fork same height and different previous block
                    library.modules.delegates.fork(block, 1);
                    return done("Can't verify previous block: " + block.id);
                }
                if (block.version > 0) {
                    return done("Invalid block version: " + block.id);
                }
                var blockSlotNumber = slots.getSlotNumber(block.timestamp);
                var lastBlockSlotNumber = slots.getSlotNumber(privated.lastBlock.timestamp);
                if (blockSlotNumber > slots.getSlotNumber() || blockSlotNumber <= lastBlockSlotNumber) {
                    return done("Can't verify block timestamp: " + block.id);
                }
                //用户信息，需要添加回去。暂时注释
                // library.modules.delegates.validateBlockSlot(block, function (err) {
                //     if (err) {
                //         // Fork another delegate's slot
                //         library.modules.delegates.fork(block, 3);
                //         return done("Can't verify slot: " + block.id);
                //     }
                    if (block.payloadLength > constants.maxPayloadLength) {
                        return done("Can't verify payload length of block: " + block.id);
                    }
                    if (block.transactions.length != block.numberOfTransactions || block.transactions.length > 100) {
                        return done("Invalid amount of block assets: " + block.id);
                    }
                    var totalAmount = 0, totalFee = 0, payloadHash = crypto.createHash('sha256'), appliedTransactions = {}, acceptedRequests = {}, acceptedConfirmations = {};
                    async.eachSeries(block.transactions, function (transaction, cb) {
                        try {
                            transaction.id = library.base.transaction.getId(transaction);
                        } catch (e) {
                            return setImmediate(cb, e.toString());
                        }
                        transaction.blockId = block.id;
                        library.dbClient.query(`SELECT id FROM transactions WHERE id="${transaction.id}"`,{
                            type: Sequelize.QueryTypes.SELECT
                        }).then((rows) => {
                            var tId = rows.length && rows[0].id;
                            if (tId) {
                                // Fork transactions already exist
                                library.modules.delegates.fork(block, 2);
                                setImmediate(cb, "Transaction already exists: " + transaction.id);
                            } else {
                                // cb();
                                // if (appliedTransactions[transaction.id]) {
                                //     return setImmediate(cb, "Duplicated transaction in block: " + transaction.id);
                                // }
                                library.modules.accounts.getAccount({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    library.base.transaction.verify(transaction, sender, function (err) {
                                        if (err) {
                                            return setImmediate(cb, err);
                                        }

                                        library.modules.transactions.applyUnconfirmed(transaction, sender, function (err) {
                                            if (err) {
                                                return setImmediate(cb, "Failed to apply transaction: " + transaction.id);
                                            }

                                            try {
                                                var bytes = library.base.transaction.getBytes(transaction);
                                            } catch (e) {
                                                return setImmediate(cb, e.toString());
                                            }

                                            appliedTransactions[transaction.id] = transaction;

                                            var index = unconfirmedTransactions.indexOf(transaction.id);
                                            if (index >= 0) {
                                                unconfirmedTransactions.splice(index, 1);
                                            }

                                            // payloadHash.update(bytes);

                                            totalAmount += transaction.amount;
                                            totalFee += transaction.fee;

                                            setImmediate(cb);
                                        });
                                    });
                                });
                            }
                        }).catch((err) => {
                            cb(err);
                        });
                    }, function (err) {
                        var errors = [];

                        if (err) {
                            errors.push(err);
                        }

                        // if (payloadHash.digest().toString('hex') !== block.payloadHash) {
                        //     errors.push("Invalid payload hash: " + block.id);
                        // }

                        if (totalAmount != block.totalAmount) {
                            errors.push("Invalid total amount: " + block.id);
                        }

                        if (totalFee != block.totalFee) {
                            errors.push("Invalid total fee: " + block.id);
                        }

                        if (errors.length > 0) {
                            async.eachSeries(block.transactions, function (transaction, cb) {
                                if (appliedTransactions[transaction.id]) {
                                    library.modules.transactions.undoUnconfirmed(transaction, cb);
                                } else {
                                    setImmediate(cb);
                                }
                            }, function () {
                                done(errors[0]);
                            });
                        } else {
                            try {
                                block = library.base.block.objectNormalize(block);
                            } catch (e) {
                                return setImmediate(done, e);
                            }

                            async.eachSeries(block.transactions, function (transaction, cb) {
                                // setImmediate(cb);
                                library.modules.accounts.setAccountAndGet({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                    if (err) {
                                        library.log.Error("Failed to apply transactions: " + transaction.id);
                                        process.exit(0);
                                    }
                                    library.modules.transactions.apply(transaction, block, sender, function (err) {
                                        if (err) {
                                            library.log.Error("Failed to apply transactions: " + transaction.id);
                                            process.exit(0);
                                        }
                                        library.modules.transactions.removeUnconfirmedTransaction(transaction.id);
                                        setImmediate(cb);
                                    });
                                });
                            }, function (err) {
                                privated.saveBlock(block, function (err) {
                                    if (err) {
                                        library.log.Error("Failed to save block...");
                                        library.log.Error(err);
                                        process.exit(0);
                                    }

                                    // library.bus.message('newBlock', block, broadcast);
                                    library.notification_center.notify('newBlock', block, broadcast);
                                    privated.lastBlock = block;
                                    // done();
                                    library.modules.round.tick(block, done);
                                });
                            });
                        }
                    });
                // });
            }).catch((error) => {
                if (error) {
                    return done(error);
                }
            });
        });
    }, cb);
};

Blocks.prototype.loadBlocksData = function(filter, options, cb) {
    if (arguments.length < 3) {
        cb = options;
        options = {};
    }
    options = options || {};
    if (filter.lastId && filter.id) {
        return cb("Invalid filter");
    }
    var params = {limit: filter.limit || 1};
    filter.lastId && (params.lastId = filter.lastId);
    filter.id && !filter.lastId && (params.id = filter.id);
    var fields = privated.blocksDataFields;
    var method;

    if (options.plain) {
        method = true;
        fields = false;
    } else {
        method = false;
    }
    library.dbSequence.add(function (cb) {
        library.dbClient.query(`SELECT height as Number FROM blocks WHERE id = ${filter.lastId || null}`, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            var height = rows.length ? rows[0].Number : 0;
            if(height === 0) {
                return cb('id is error, height is 0');
            }
            var realLimit = height + (parseInt(filter.limit) || 1);
            params.limit = realLimit;
            params.height = height;
            var limitPart = "";

            if (!filter.id && !filter.lastId) {
                limitPart = "where b.height < $limit ";
            }
            library.dbClient.query('SELECT '+
                'b.id as b_id, b.version , b.timestamp as b_timestamp , b.height , b.previousBlock , b.numberOfTransactions , b.totalAmount , b.totalFee , b.reward , b.payloadLength , b.payloadHash , b.generatorPublicKey ,lower(b.blockSignature) as blockSignature, ' +
                "t.id as t_id, t.type , t.timestamp as t_timestamp , t.senderPublicKey , t.senderId , t.recipientId , t.senderUsername , t.recipientUsername , t.amount , t.fee , t.signature , t.signSignature , " +
                "s.publicKey , " +
                'd.username , ' +
                'c.address , ' +
                'u.username ,' +
                'm.min , m.lifetime , m.keysgroup , ' +
                't.requesterPublicKey , t.signatures ' +
                "FROM blocks b " +
                "left outer join transactions as t on t.blockId=b.id " +
                "left outer join delegates as d on d.transactionId=t.id " +
                "left outer join signatures as s on s.transactionId=t.id " +
                "left outer join contacts as c on c.transactionId=t.id " +
                "left outer join usernames as u on u.transactionId=t.id " +
                "left outer join multisignatures as m on m.transactionId=t.id " +
                (filter.id || filter.lastId ? "where " : "") + " " +
                (filter.id ? " b.id = $id " : "") + (filter.id && filter.lastId ? " and " : "") + (filter.lastId ? " b.height > $height and b.height < $limit " : "") +
                limitPart +
                "ORDER BY b.height, t.id", {
                type: Sequelize.QueryTypes.SELECT,
                bind: params,
            }).then((blocks) => {
                blocks.forEach(function (block) {
                    block.blockSignature = block.blockSignature.toString('utf8');
                    block.generatorPublicKey = block.generatorPublicKey.toString('utf8');
                    block.payloadHash = block.payloadHash.toString('utf8');
                });
                let json2csv = new Json2csv({header: false});
                let csv = json2csv.parse(blocks);
                console.log(csv);
               return cb(null, csv);
            });
        }).catch((err) => {
            return cb(err);
        })
    }, cb);
};

Blocks.prototype.onEnd = function (cb) {

};

// export
module.exports = Blocks;