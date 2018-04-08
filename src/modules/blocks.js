var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var constants = require('../utils/constants.js');
var	blockStatus = require("../utils/blockStatus.js");

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

privated.lastBlock = {};
privated.blockStatus = new blockStatus();

//block的数据字段
privated.blocksDataFields = {

};

// constructor
function Blocks(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

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

//privated methods
privated.saveGenesisBlock = function (cb) {

};

privated.deleteBlock = function (blockId, cb) {
    library.dbClient.query('DELETE FROM blocks where id = $id', {id: blockId}, function (err, res) {
        cb(err, res);
    });
};

privated.list = function (filter, cb) {

};

privated.getById = function (id, cb) {
    library.dbClient.query("select b.id, b.version, b.timestamp, b.height, b.previousBlock, b.numberOfTransactions, b.totalAmount, b.totalFee, b.reward, b.payloadLength,  lower(hex(b.payloadHash)), lower(hex(b.generatorPublicKey)), lower(hex(b.blockSignature)), (select max(height) + 1 from blocks) - b.height " +
        "from blocks b " +
        "where b.id = $id", {id: id}, ['b_id', 'b_version', 'b_timestamp', 'b_height', 'b_previousBlock', 'b_numberOfTransactions', 'b_totalAmount', 'b_totalFee', 'b_reward', 'b_payloadLength', 'b_payloadHash', 'b_generatorPublicKey', 'b_blockSignature', 'b_confirmations'], function (err, rows) {
        if (err || !rows.length) {
            return cb(err || "Block not found");
        }

        var block = library.logic.block.dbRead(rows[0]);
        cb(null, block);
    });
};

privated.saveBlock = function (block, cb) {
    library.dbClient.query('BEGIN TRANSACTION;');
    self.dbSave(block, (err) => {
        if(err) {
            library.dbClient.query('ROLLBACK;', function (rollbackErr) {
                cb(rollbackErr || err);
            });
            return;
        }

        async.eachSeries(block.transactions, function (transaction, cb) {
            transaction.blockId = block.id;
            //交易保存
            // library.logic.transaction.dbSave(transaction, cb);
        }, (err) => {
            if(err) {
                library.dbClient.query('ROLLBACK;', function (rollbackErr) {
                    cb(rollbackErr || err);
                });
                return;
            }

            library.dbClient.query('COMMIT;', cb);
        });
    });
};

privated.popLastBlock = function (oldLastBlock, cb) {
    library.balancesSequence.add(function (cb) {
        self.loadBlocksPart({id: oldLastBlock.previousBlock}, function (err, previousBlock) {
            if(err || !previousBlock.length) {
                return cb(err || 'previousBlock is null');
            }
            previousBlock = previousBlock[0];

            async.eachSeries(oldLastBlock.transactions.reverse(), function (transaction, cb) {
                async.series([
                    function (cb) {
                        library.accounts.getAccount({publicKey: transaction.senderPublicKey}, function (err, sender) {
                            if(err) {
                                return cb(err);
                            }
                            library.transactions.undo(transaction, oldLastBlock, sender, cb);
                        });
                    }, function (cb) {
                        library.transactions.undoUnconfirmed(transaction, cb);
                    }, function (cb) {
                        library.transactions.pushHiddenTransaction(transaction);
                        setImmediate(cb);
                    }
                ], cb);
            }, (err) => {
                library.round.backwardTick(oldLastBlock, previousBlock, function () {
                    privated.deleteBlock(oldLastBlock.id, function (err) {
                        if (err) {
                            return cb(err);
                        }

                        cb(null, previousBlock);
                    });
                });
            });
        })
    }, cb);
};

// Public methods

Blocks.prototype.getLastBlock = function () {
    return privated.lastBlock;
};

Blocks.prototype.dbRead = function (row) {
    if(!row.b_id) {
        return null;
    } else {
        var block = {
            id: row.b_id,
            version: parseInt(row.b_version),
            timestamp: parseInt(row.b_timestamp),
            height: parseInt(row.b_height),
            previousBlock: row.b_previousBlock,
            numberOfTransactions: parseInt(row.b_numberOfTransactions),
            totalAmount: parseInt(row.b_totalAmount),
            totalFee: parseInt(row.b_totalFee),
            reward: parseInt(row.b_reward),
            payloadLength: parseInt(row.b_payloadLength),
            payloadHash: row.b_payloadHash,
            generatorPublicKey: row.b_generatorPublicKey,
            generatorId: privated.getAddressByPublicKey(row.b_generatorPublicKey),
            blockSignature: row.b_blockSignature,
            confirmations: row.b_confirmations
        };
        block.totalForged = (block.totalFee + block.reward);
        return block;
    }
};

Blocks.prototype.loadBlocksPart = function (filter, cb) {
    self.loadBlocksData(filter, function (err, rows) {
        // Notes:
        // If while loading we encounter an error, for example, an invalid signature on
        // a block & transaction, then we need to stop loading and remove all blocks
        // after the last good block. We also need to process all transactions within
        // the block.

        var blocks = [];

        if (!err) {
            blocks = privated.readDbRows(rows);
        }

        cb(err, blocks);
    });
};

Blocks.prototype.dbSave = function (block, cb) {
    try {
        var payloadHash = new Buffer(block.payloadHash, 'hex'); // 防止block被恶意修改，所以这里选择重新计算
        var generatorPublicKey = new Buffer(block.generatorPublicKey, 'hex');
        var blockSignature = new Buffer(block.blockSignature, 'hex');
    } catch (e) {
        return cb(e.toString())
    }

    this.scope.dbClient.query("INSERT INTO blocks(id, version, timestamp, height, previousBlock," +
        " numberOfTransactions, totalAmount, totalFee, reward, payloadLength, payloadHash," +
        " generatorPublicKey, blockSignature) VALUES($id, $version, $timestamp, $height," +
        " $previousBlock, $numberOfTransactions, $totalAmount, $totalFee, $reward, $payloadLength," +
        " $payloadHash, $generatorPublicKey, $blockSignature)", {
        id: block.id,
        version: block.version,
        timestamp: block.timestamp,
        height: block.height,
        previousBlock: block.previousBlock || null,
        numberOfTransactions: block.numberOfTransactions,
        totalAmount: block.totalAmount,
        totalFee: block.totalFee,
        reward: block.reward || 0,
        payloadLength: block.payloadLength,
        payloadHash: payloadHash,
        generatorPublicKey: generatorPublicKey,
        blockSignature: blockSignature
    }, cb);
};

// export
module.exports = Blocks;