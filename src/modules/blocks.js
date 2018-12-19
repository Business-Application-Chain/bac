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

var header = ['b_hash', 'b_version', 'b_timestamp', 'b_height', 'b_previousBlock', 'b_numberOfTransactions', 'b_totalAmount', 'b_totalFee','b_reward','b_generatorPublicKey','b_blockSignature', 'b_merkleRoot', 'b_difficulty', 'b_basic', 'b_decisionSignature', 'b_decisionAddress', 'b_minerHash',
    't_hash', 't_type','t_timestamp','t_senderPublicKey', 't_senderId','t_recipientId','t_senderUsername','t_recipientUsername','t_amount','t_fee','t_signature','t_signSignature', 's_publicKey', 'd_address',
    'da_hash', 'da_issuersAddress','da_className', 'da_abi', 'da_tokenList', 'da_gasPrice', 'da_gasLimit', 'da_gasUsed',
    'do_dappHash', 'do_fun', 'do_params', 'i_name', 'i_desc','i_issuersAddress', 'dt_dappHash',
    'c_address','u_alias', 'm_min','m_lifetime','m_keysgroup','t_requesterPublicKey','t_signatures', 'a_name', 'a_description', 'a_hash', 'a_decimal', 'a_total', 'tr_amount', 'tr_assetsHash', 'tr_assetsName', 'l_lockHeight', 'min_ip', 'min_port'];

require('array.prototype.findindex'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null, shared_1_0 = {}, scoket_1_0 = {};

privated.loaded = false;
privated.isActive = false;
privated.lastBlock = {};
privated.blockStatus = new blockStatus();
// @formatter: off
privated.blocksDataFields = {
    'b_hash': String,
    'b_version': String,
    'b_timestamp': Number,
    'b_height': Number,
    'b_previousBlock': String,
    'b_numberOfTransactions': String,
    'b_totalAmount': String,
    'b_totalFee': String,
    'b_reward': String,
    'b_generatorPublicKey': String,
    'b_blockSignature': String,
    'b_merkleRoot': String,
    'b_difficulty': String,
    'b_basic': Number,
    'b_decisionSignature': String,
    'b_decisionAddress': String,
    'b_minerHash': String,

    't_hash': String,
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
    'd_address': String,

    'da_hash': String,
    'da_issuersAddress': String,
    'da_className': String,
    'da_abi': String,
    'da_gasPrice': Number,
    'da_gasLimit': Number,
    'da_gasUsed': Number,
    'da_tokenList': String,
    'do_dappHash': String,
    'do_fun': String,
    'do_params': String,
    'i_name': String,
    'i_desc': String,
    'i_issuersAddress': String,
    'dt_dappHash': String,

    'c_address': String,
    'u_alias': String,
    'm_min': Number,
    'm_lifetime': Number,
    'm_keysgroup': String,
    't_requesterPublicKey': String,
    't_signatures': String,
    'a_name': String,
    'a_description': String,
    'a_hash': String,
    'a_decimal': Number,
    'a_total': Number,
    'tr_amount': Number,
    'tr_assetsHash': String,
    'tr_assetsName': String,
    'l_lockHeight': Number,
    'min_ip': Number,
    'min_port': Number,

};
privated.serchSql = 'SELECT '+
    'b.hash as b_hash, b.version as b_version, b.timestamp as b_timestamp, b.height as b_height, b.previousBlock as b_previousBlock, b.numberOfTransactions as b_numberOfTransactions, b.totalAmount as b_totalAmount, b.totalFee as b_totalFee, b.reward as b_reward,  b.generatorPublicKey as b_generatorPublicKey, b.blockSignature as b_blockSignature,' +
    'b.merkleRoot as b_merkleRoot, b.difficulty as b_difficulty, b.basic as b_basic, b.decisionSignature as b_decisionSignature, b.decisionAddress as b_decisionAddress, b.minerHash as b_minerHash, ' +
    't.hash as t_hash, t.type as t_type, t.timestamp as t_timestamp, t.senderPublicKey as t_senderPublicKey, t.senderId as t_senderId, t.recipientId as t_recipientId, t.senderUsername as t_senderUsername, t.recipientUsername as t_recipientUsername, t.amount as t_amount, t.fee as t_fee, t.signature as t_signature, t.signSignature as t_signSignature, ' +
    's.publicKey as s_publicKey, ' +
    'd.address as d_address, ' +
    'da.hash as da_hash, da.issuersAddress as da_issuersAddress, da.className as da_className, da.abi as da_abi, da.tokenList as da_tokenList, da.gasPrice as da_gasPrice, da.gasLimit as da_gasLimit, da.gasUsed as da_gasUsed, ' +
    'do.dappHash as do_dappHash, do.fun as do_fun, do.params as do_params, '+
    'i.name as i_name, i.desc as i_desc, i.issuersAddress as i_issuersAddress, '+
    'dt.dappHash as dt_dappHash, ' +
    'c.address as c_address, ' +
    'u.username as u_alias,' +
    'm.min as m_min, m.lifetime as m_lifetime, m.keysgroup as m_keysgroup, ' +
    't.requesterPublicKey as t_requesterPublicKey, t.signatures as t_signatures, ' +
    'a.name as a_name, a.description as a_description, a.hash as a_hash,  a.decimal as a_decimal, a.total as a_total, ' +
    'tr.amount as tr_amount, tr.assetsHash as tr_assetsHash, tr.assets_name as tr_assetsName, ' +
    'l.lockHeight as l_lockHeight, ' +
    'min.ip as min_ip, min.port as min_port ' +
    "FROM blocks b " +
    "left outer join transactions as t on t.blockHash=b.hash " +
    "left outer join delegates as d on d.transactionHash=t.hash " +
    "left outer join dapp2assets as da on da.transactionHash=t.hash " +
    "left outer join dapp2assets_handle as do on do.transactionHash=t.hash " +
    "left outer join dapp2issuers as i on i.transactionHash=t.hash " +
    "left outer join dapp2transfersAdmin as dt on dt.transactionHash=t.hash " +
    "left outer join signatures as s on s.transactionHash=t.hash " +
    "left outer join contacts as c on c.transactionHash=t.hash " +
    "left outer join usernames as u on u.transactionHash=t.hash " +
    "left outer join multisignatures as m on m.transactionHash=t.hash " +
    "left outer join account2assets as a on a.transactionHash=t.hash " +
    "left outer join transfers as tr on tr.transactionHash=t.hash " +
    "left outer join lock_height as l on l.transactionHash=t.hash " +
    "left outer join miner_ip as min on min.transactionHash=t.hash ";

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
    library.dbClient.query("SELECT hash FROM blocks WHERE hash = $hash", {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            hash: genesisblock.block.hash
        }
    }).then(function (rows) {
        var blockHash = rows.length && rows[0].hash;
        if (!blockHash) {
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
    var save_records = [];
    save_records.push(new Promise((resolve, reject) => {
        library.base.block.save(blockObj, function (err) {
            if (err) {
                library.log.Error("saveBlock", "Error", err.toString());
                reject("saveBlock", "Error", err.toString());
            }
            else {
                resolve();
            }
        });
    }));
    async.each(blockObj.transactions, function (txObj, cb) {
        txObj.blockHash = blockObj.hash;
        save_records.push(new Promise((resolve, reject) => {
            library.base.transaction.save(txObj, function (err) {
                if (err) {
                    library.log.Error("saveBlock", "Error", err.toString());
                    reject("saveBlock", "Error", err.toString());
                } else {
                    resolve();
                }
            });
        }));
        setImmediate(cb);
    }, function (err) {
        if(err) {
            cb(err);
        }
        Promise.all(save_records).then(() => {
            library.log.Debug("saveBlock successed");
            cb();
        }).catch((err) => {
            library.log.Error("saveBlock failed", "Error", err);
            cb(err);
        });
    });
};

privated.saveBlocks = function (blockObj, cb) {
    library.dbClient.transaction(t => {
        return library.base.block.dbSave(blockObj, t);
    }).then(() => {
        async.eachSeries(blockObj.transactions, function (transaction, cb) {
            transaction.blockHash = blockObj.hash;
            if(transaction.mark) {
                return cb();
            }
            library.base.transaction.save(transaction, cb);
        }, function (err) {
            return cb(err);
        });
    });
};

privated.deleteBlock = function (blockHash, cb) {
    library.dbClient.query(`DELETE FROM blocks WHERE hash = "${blockHash}"`, {
        type: Sequelize.QueryTypes.DELETE
    }).then((data) => {
        cb(null, data);
    }).catch((err) => {
        cb(err);
    });
};

privated.list = function (filter, cb) {
    var sortFields = ['b.hash', 'b.timestamp', 'b.height', 'b.previousBlock', 'b.totalAmount', 'b.totalFee', 'b.reward', 'b.numberOfTransactions', 'b.generatorPublicKey'];
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
    library.dbClient.query(`SELECT count(b.hash) as Number FROM blocks b ${fields.length ? "WHERE " + fields.join(' and ') : ''}`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        let count = rows[0].count;
        library.dbClient.query('SELECT b.hash, b.version, b.timestamp, b.height, b.previousBlock, b.numberOfTransactions, b.totalAmount, b.totalFee, b.reward, lower(hex(b.generatorPublicKey)), lower(hex(b.blockSignature)), (select max(height) + 1 from blocks) - b.height' +
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
// 0区块，1交易
privated.getTransactionsOrBlock = function (hash, cb) {
    let result = {};
    library.dbClient.query(`SELECT * FROM transactions WHERE hash like "%${hash}%"`, {
        type: Sequelize.QueryTypes.SELECT
    }).then(tRows => {
        if(tRows[0]) {
            result = tRows[0];
            result.searchType = 1;
            return cb(null, result);
        } else {
            library.dbClient.query(`SELECT * FROM blocks where hash like "%${hash}%" `, {
                type: Sequelize.QueryTypes.SELECT
            }).then((bRows) => {
                let block = bRows[0];
                block.searchType = 0;
                return block;
            }).then(block => {
                if(!block)
                    return cb({message: "not find hash"});
                library.dbClient.query('SELECT * FROM `transactions` WHERE `blockHash` = $blockHash ', {
                    type: Sequelize.QueryTypes.SELECT,
                    bind: {
                        blockHash: block.hash
                    }
                }).then((rows) => {
                    block.transactions = rows;
                    return cb(null, block);
                });
            });
        }
    }).catch(err => {
        return cb(err);
    });
};

privated.serachBlocksUseNumber = function (height, cb) {
    library.dbClient.query(`SELECT * FROM blocks where height = "${height}" `, {
        type: Sequelize.QueryTypes.SELECT
    }).then((bRows) => {
        let block = bRows[0];
        block.searchType = 0;
        return block;
    }).then(block => {
        if(!block)
            return cb({message: "not find hash"});
        library.dbClient.query('SELECT * FROM `transactions` WHERE `blockHash` = $blockHash ', {
            type: Sequelize.QueryTypes.SELECT,
            bind: {
                blockHash: block.hash
            }
        }).then((rows) => {
            block.transactions = rows;
            return cb(null, block);
        });
    });
};

privated.getById = function (hash, cb) {
    async.waterfall([
        function (cb) {
            library.dbClient.query(`SELECT blockHash FROM transactions WHERE hash = "${hash}"`, {
                type: Sequelize.QueryTypes.SELECT
            }).then((rows) => {
                if(rows[0]) {
                    cb(null, rows[0].blockHash);
                } else {
                    cb(null, hash);
                }
            }).catch((err) => {
                console.log(err);
                cb(null, hash);
            });
        }
    ], function (err, hash) {
        library.dbClient.query(privated.serchSql +  `where b.hash = "${hash}" or b.height = "${hash}" `, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            var blocks = privated.readDbRows(rows);
            blocks.forEach(function (block) {
                block.blockSignature = block.blockSignature.toString('utf8');
                block.generatorPublicKey = block.generatorPublicKey.toString('utf8');
                block.confirmations = privated.lastBlock.height - block.b_height;
            });
            return cb(null, blocks);
        }).catch((err) => {
            return cb(err);
        });
    });
};

privated.getBlocks = function(option, cb) {
    let height = option.height || 0;
    let size = option.size || 10;
    let sql = 'SELECT ' +
        'hash, version, timestamp, height , previousBlock , numberOfTransactions , totalAmount , totalFee , reward , lower(generatorPublicKey) as generatorPublicKey, lower(blockSignature) as blockSignature FROM blocks';
    if(height) {
        sql += ' WHERE height < ' + height;
    }
    sql += ' ORDER BY height desc LIMIT ' + size;

    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        rows.forEach(function (block) {
            block.blockSignature = block.blockSignature.toString('utf8');
            block.generatorPublicKey = block.generatorPublicKey.toString('utf8');
        });
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};

privated.popLastBlock = function (oldLastBlock, cb) {
    library.balancesSequence.add(function (cb) {
        self.loadBlocksPart({hash: oldLastBlock.previousBlock}, function (err, previousBlock) {
            if (err || !previousBlock.length) {
                return cb(err || 'previousBlock is null');
            }
            previousBlock = previousBlock[0];

            async.eachSeries(oldLastBlock.transactions.reverse(), function (transaction, cb) {
                async.series([
                    function (cb) {
                        library.modules.accounts.getAccount({publicKey: transaction.senderPublicKey}, function (err, sender) {
                            if (err) {
                                return cb(err);
                            }
                            library.modules.transactions.undo(transaction, oldLastBlock, sender, cb);
                        });
                    }, function (cb) {
                        library.modules.transactions.undoUnconfirmed(transaction, cb);
                    }, function (cb) {
                        library.modules.transactions.pushHiddenTransaction(transaction);
                        setImmediate(cb);
                    }
                ], cb);
            }, function (err) {
                library.modules.round.backwardTick(oldLastBlock, previousBlock, function () {
                    privated.deleteBlock(oldLastBlock.hash, function (err) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null, previousBlock);
                    });
                });
            });
        });
    }, cb);
};

privated.getIdSequence = function (height, cb) {
    library.dbClient.query('SELECT height AS firstHeight, hash AS ids FROM blocks ORDER BY height DESC LIMIT 10', {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows);
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
            if (!blocks[__block.hash]) {
                // if (__block.id == genesisblock.block.id) {
                //     __block.generationSignature = (new Array(65)).join('0');
                // }
                order.push(__block.hash);
                blocks[__block.hash] = __block;
            }

            var __transaction = library.base.transaction.dbRead(rows[i]);
            blocks[__block.hash].transactions = blocks[__block.hash].transactions || {};
            if (__transaction) {
                if (!blocks[__block.hash].transactions[__transaction.hash]) {
                    blocks[__block.hash].transactions[__transaction.hash] = __transaction;
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
                    message: "Can't apply transaction: " + transaction.hash,
                    transaction: transaction,
                    block: block
                });
            }
            setImmediate(cb);
        });
    });
};

privated.checkBlocks = function (transactionsHash, cb) {
    // library.dbClient.query('SELECT * FROM `blocks` WHERE hash = $blockHash', {
    library.dbClient.query('SELECT * FROM `blocks` WHERE `hash` = (SELECT `blockHash` FROM `transactions` where `hash`=$transactionsHash)', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            transactionsHash: transactionsHash
        }
    }).then(rows => {
        if(!rows[0]) {
            return cb("not find blocks ");
        } else {
            return cb();
        }
    }).catch(err => {
        console.log(err);
        return cb(err);
    });
};

// public methods
Blocks.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Blocks.prototype.callApi = function (call, rpcjson, args, peerIp, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
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
                let max = data[0].firstHeight;
                lastBlockHeight = data[data.length-1].firstHeight;
                let ids = "";
                data.forEach((item) => {
                    ids += item.ids + ",";
                });
                ids = ids.substring(0, ids.length - 1);
                library.modules.kernel.getFromPeerNews(peer, {
                    api:'kernel',
                    method:'POST',
                    func:'blocks_common',
                    data: JSON.stringify({
                        ids: ids,
                        max: max,
                        min: lastBlockHeight
                    }),
                    id: Math.random(),
                    jsonrpc: '1.0'
                }, function (err, data) {
                    if (err || data.code !== 200) {
                        return next(err || data.message);
                    }
                    var cBlock = data.result || null;
                    if (!cBlock) {
                        return next();
                    }
                    library.dbClient.query(`SELECT COUNT(*) as cnt from blocks where hash="${cBlock.hash}" and height=${cBlock.height}`,{
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
            // blocks.unshift(privated.lastBlock);
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


Blocks.prototype.loadBlocksPart = function (filter, cb) {
    self.loadBlocksData(filter, function (err, rows) {
        let blocks = [];
        let blocksTemp = [];
        csvtojson({
            noheader: true,
            headers: header
        }).fromString(rows).subscribe((csvLine) => {
            blocksTemp.push(csvLine);
        }).then(() => {
            blocks = privated.readDbRows(blocksTemp);
            // cb(null, blocks, data);
            return cb(null, blocks);
        }).catch((err) => {
            return cb(err);
        });
        // _rows.push(rows);
        // if (!err) {
        //     blocks = privated.readDbRows(blocksTemp);
        // }
    });
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
                    library.modules.kernel.getFromPeerNews(peer, {
                        api:'kernel',
                        method:'POST',
                        func:'blocks',
                        data: [lastCommonBlockId],
                        id: Math.random(),
                        jsonrpc: '1.0'
                    }, function (err, data) {
                        if (err || data.code !== 200) {
                            return next(err || data.message);
                        }
                        let blocks = data.result;
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
                        } else {
                            cb("block is full");
                        }
                    });
                }, function (blocks, data, cb) {
                    async.eachSeries(blocks, function (block, cb) {
                        try {
                            block = library.base.block.objectNormalize(block);
                        } catch (e) {
                            var peerStr = data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
                            library.log.Debug('Block ' + (block ? block.hash : 'null') + ' is not valid, ban 60 min', peerStr);
                            library.modules.peer.state(peer.ip, peer.port, 0, 3600);
                            cb(e.toString());
                        }
                        self.processBlock(block, false, function (err) {
                            if (!err) {
                                lastCommonBlockId = block.hash;
                                lastValidBlock = block;
                                cb();
                            } else {
                                var peerStr = data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
                                library.log.Info('Block ' + (block ? block.hash : 'null') + ' is not valid, ban 60 min', peerStr);
                                library.modules.peer.state(peer.ip, peer.port, 0, 3600);
                                console.log(err);
                                cb(err);
                                // cb(err);
                            }
                        });
                    }, function (err) {
                        if(err) {
                            cb(err);
                        } else {
                            cb();
                        }
                    })
                }
            ], function (err) {
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
        let sql = privated.serchSql +
            `where b.height >= ${params.offset} and b.height < ${params.limit} ` +
            "ORDER BY b.height, t.hash";
        library.dbClient.query(sql, {
            type: Sequelize.QueryTypes.SELECT
        }).then((rows) => {
            var blocks = privated.readDbRows(rows);

            async.eachSeries(blocks, function (block, cb) {
                async.series([
                    function (cb) {
                        if (block.hash !== genesisblock.block.hash) {
                            if (verify) {
                                if (block.previousBlock !== privated.lastBlock.hash) {
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
                            if (block.hash === genesisblock.block.hash) {
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
                                    if (block.hash !== genesisblock.block.hash) {
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
                                console.log(err.message);
                                var lastValidTransaction = block.transactions.findIndex(function (trs) {
                                    return trs.hash === err.transaction.hash;
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

Blocks.prototype.simpleDeleteAfterBlock = function (blockHash, cb) {
    // library.dbClient.query(`DELETE FROM blocks WHERE height not in (SELECT height FROM blocks where id = ${blockId}) `, {
    library.dbClient.query(`DELETE FROM blocks WHERE height >= (SELECT height from (SELECT height FROM blocks where hash = "${blockHash}") a) `, {
        type: Sequelize.QueryTypes.DELETE
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    });
};

Blocks.prototype.count = function(cb) {
    library.dbClient.query('SELECT count(hash) as Number from blocks', {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows[0].Number);
    }).catch((err) => {
        return cb(err);
    });
};

Blocks.prototype.processBlock = function(block, broadcast, cb) {
    privated.isActive = true;
    library.balancesSequence.add(function (cb) {
        try {
            block.hash = library.base.block.getBlockHash(block);
        } catch (e) {
            privated.isActive = false;
            return setImmediate(cb, e.toString());
        }
        block.height = privated.lastBlock.height + 1;
        library.modules.transactions.undoBlockUnconfirmedList(block, function (err, unconfirmedTransactions) {
            if (err) {
                privated.isActive = false;
                return process.exit(0);
            }
            function done(err) {
                // setImmediate(cb, err);
                if(err) {
                    console.log('undoUnconfirmedList done is err', err);
                    return cb(err);
                } else {
                    library.modules.transactions.applyUnconfirmedList(unconfirmedTransactions, function () {
                        privated.isActive = false;
                        setImmediate(cb, err);
                    });
                }
            }

            if (!block.previousBlock && block.height !== 1) {
                return setImmediate(done, "Invalid previous block");
            }
            var expectedReward = privated.blockStatus.calcReward(block.height);
            if (block.height !== 1 && expectedReward !== block.reward) {
                return setImmediate(done, "Invalid block reward");
            }
            library.dbClient.query(`SELECT hash FROM blocks WHERE hash="${block.hash}"`,{
                type:Sequelize.QueryTypes.SELECT
            }).then((rows) => {
                let bHash = rows.length && rows[0].hash;
                if (bHash) {
                    return done("Block already exists: " + block.hash);
                }
                try {
                    var valid = library.base.block.verifySignature(block);
                    var verifyMerkle = library.base.block.verifyMerkle(block);
                } catch (e) {
                    return setImmediate(cb, e.toString());
                }
                if (!valid) {
                    return done("Can't verify signature: " + block.hash);
                }
                if(!verifyMerkle) {
                    return done("Can't verify merkleRoot: " + block.hash);
                }
                if (block.previousBlock !== privated.lastBlock.hash) {
                    // Fork same height and different previous block
                    library.modules.delegates.fork(block, 1);
                    return done("Can't verify previous block: " + block.hash);
                }
                if (block.height === privated.lastBlock.height) {
                    library.modules.delegates.fork(block, 1);
                    return done("Can't verify previous height: " + block.hash);
                }
                if (block.version > 0) {
                    return done("Invalid block version: " + block.hash);
                }
                if (typeof block.basic !== "number" || block.basic < 1) {
                    return done("basic should more 16: " + block.hash);
                }
                if (!block.difficulty) {
                    return done("Can't find difficulty: " + block.hash);
                }
                // if (block.transactions.length != block.numberOfTransactions || block.transactions.length > 100) {
                if (block.transactions.length !== block.numberOfTransactions) {
                    return done("Invalid amount of block assets: " + block.hash);
                }
                var totalAmount = 0, totalFee = 0, appliedTransactions = {};

                async.eachSeries(block.transactions, function (transaction, cb) {
                    transaction.blockHash = block.hash;
                    library.dbClient.query(`SELECT hash FROM transactions WHERE hash="${transaction.hash}"`,{
                        type: Sequelize.QueryTypes.SELECT
                    }).then((rows) => {
                        var tId = rows.length && rows[0].hash;
                        if (tId) {
                            privated.checkBlocks(tId, function (err) {
                                if(err) {
                                    // 找不到这个交易所在的区块，应该删除此交易
                                    totalAmount += transaction.amount;
                                    totalFee += transaction.fee;
                                    transaction.mark = true;
                                    setImmediate(cb);
                                } else {
                                    library.modules.delegates.fork(block, 2);
                                    return setImmediate(cb, "Transaction already exists: " + transaction.hash);
                                }
                            });
                        } else {
                            library.modules.accounts.getAccount({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                if (err) {
                                    return setImmediate(cb, err);
                                }
                                library.base.transaction.verify(transaction, sender, function (err) {
                                    if (err) {
                                       return cb(err);
                                    }
                                    library.modules.transactions.applyUnconfirmed(transaction, sender, function (err) {
                                        if (err) {
                                            return setImmediate(cb, "Failed to apply transaction: " + transaction.hash);
                                        }
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
                    if (totalAmount !== block.totalAmount) {
                        errors.push("Invalid total amount: " + block.id);
                    }
                    if (totalFee !== block.totalFee) {
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
                            library.modules.accounts.setAccountAndGet({master_pub: transaction.senderPublicKey}, function (err, sender) {
                                if (err) {
                                    library.log.Error("accounts.setAccountAndGet Failed to apply transactions: " + transaction.hash);
                                    process.exit(0);
                                }
                                if(transaction.mark) {
                                    return setImmediate(cb);
                                }
                                library.modules.transactions.apply(transaction, block, sender, function (err) {
                                    if (err) {
                                        library.log.Error("2Failed to apply transactions: " + transaction.hash);
                                        process.exit(0);
                                    }
                                    library.modules.transactions.removeUnconfirmedTransaction(transaction.hash);
                                    setImmediate(cb);
                                });
                            });
                        }, function (err) {
                            privated.saveBlocks(block, function (err) {
                                if (err) {
                                    library.log.Error("Failed to save block...");
                                    library.log.Error(err);
                                    process.exit(0);
                                }
                                privated.lastBlock = block;
                                library.log.Debug("saveBlock success, block height is " + block.height);
                                // library.notification_center.notify('sendNewBlock');
                                self.sendNewBlock();
                                library.modules.round.tick(block, done);
                                // setImmediate(done);
                            });
                        });
                    }
                });
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
    if (filter.lastBlockHash && filter.hash) {
        return cb("Invalid filter");
    }
    let params = {limit: filter.limit || 1};
    filter.lastBlockHash && (params.lastBlockHash = filter.lastBlockHash);
    filter.hash && !filter.lastBlockHash && (params.hash = filter.hash);
    let fields = privated.blocksDataFields;
    let method = false;

    if (options.plain) {
        method = true;
        fields = false;
    } else {
        method = false;
    }
    library.dbSequence.add(function (cb) {
        let sql = "SELECT height as Number FROM `blocks` WHERE `hash` = $hash";
        // library.dbClient.query(`SELECT height as Number FROM blocks WHERE hash = "${filter.lastBlockHash || null}"`, {
        library.dbClient.query(sql, {
            type: Sequelize.QueryTypes.SELECT,
            bind: {
                hash: filter.lastBlockHash? filter.lastBlockHash: filter.hash
            }
        }).then((rows) => {
            var height = rows.length ? rows[0].Number : 0;
            if(height === 0) {
                return cb('hash is error, height is 0');
            }
            var realLimit = height + (parseInt(filter.limit) || 1);
            params.limit = realLimit;
            params.height = height;
            var limitPart = " ";

            if (!filter.hash && !filter.lastHash) {
                limitPart = "where b.height < $limit ";
            }

            let sql = privated.serchSql +
                (filter.hash || filter.lastBlockHash ? " where " : " ") + " " +
                (filter.hash ? " b.hash = $hash " : " ") + (filter.hash && filter.lastBlockHash ? " and " : " ") + (filter.lastBlockHash ? " b.height > $height and b.height < $limit " : " ") +
                "ORDER BY b.height";
            library.dbClient.query(sql, {
                type: Sequelize.QueryTypes.SELECT,
                bind: params,
            }).then((blocks) => {
                blocks.forEach(function (block) {
                    block.b_blockSignature = block.b_blockSignature.toString('utf8');
                    block.b_generatorPublicKey = block.b_generatorPublicKey.toString('utf8');
                });
                if(!blocks || blocks.length === 0)
                    return cb(null, null);
                let json2csv = new Json2csv({header: false});
                let csv = json2csv.parse(blocks);
                return cb(null, csv);
            });
        }).catch((err) => {
            return cb(err);
        })
    }, cb);
};


Blocks.prototype.onHasNewBlock = function(block) {
    self.processBlock(block, true);
};

Blocks.prototype.onSendLastBlock = function(cb) {
    let lastBlockJson = JSON.stringify(privated.lastBlock);
    library.socket.webSocket.send('201|blocks|block|' + lastBlockJson, cb);
};

Blocks.prototype.sendNewBlock = function() {
    let lastBlockJson = JSON.stringify(privated.lastBlock);
    library.socket.webSocket.send('201|blocks|block|' + lastBlockJson);
    library.modules.minersIp.checkMiner(function (err) {
        if(err) {
            library.log.Debug("account isn't miner," + err);
        } else {
            library.log.Debug("account is miner, send new block to peers");
            library.modules.kernel.broadcast({limit: 100}, {api: '/kernel',func: 'addBlocks', data: lastBlockJson, method: "POST"});
        }
    });
};

shared_1_0.height = function(req, cb) {
    return cb(null, 200, privated.lastBlock.height);
};

shared_1_0.blocks = function(params, cb) {
    let height = params[0] || 0;
    let size = params[1] || 10;
    let option = {
        height: height,
        size: size,
    };
    privated.getBlocks(option, function (err, rows) {
        if(err) {
            return cb(err, 12001);
        } else {
            return cb(null, 200, rows);
        }
    });
};
// type 0 :block; type 1 : transactions;
shared_1_0.block = function(params, cb) {
    let bId = params[0] || 0;
    if(!bId) {
        return cb('missing block id', 11000);
    }
    if (isNaN(bId)) {
        let tra = library.modules.transactions.getUnconfirmedTransactionHash(bId);
        if(tra) {
            tra.searchType = 1;
            return cb(null, 200, tra);
        }
        privated.getTransactionsOrBlock(bId, function (err, result) {
            if (err) {
                return cb(err.message, 12001);
            }
            if (result)
                return cb(null, 200, result);
            else {
                return cb('not find transaction', 13004);
            }
        });
    } else {
        privated.serachBlocksUseNumber(bId, function (err, result) {
            if (err) {
                return cb(err.message, 12001);
            }
            if (result)
                return cb(null, 200, result);
            else {
                return cb('not find block height', 13004);
            }
        });
    }
};

shared_1_0.getLastBlock = function(params, cb) {
    return cb(null, 200, privated.lastBlock);
};

scoket_1_0.height = function(cb) {
    return cb(null, 200, privated.lastBlock.height);
};

scoket_1_0.onNewBlock = function(cb) {
    return cb(null, privated.lastBlock);
};

// export
module.exports = Blocks;