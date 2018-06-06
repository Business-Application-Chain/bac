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

var header = ['b_id', 'b_version', 'b_timestamp', 'b_height', 'b_previousBlock', 'b_numberOfTransactions', 'b_totalAmount', 'b_totalFee','b_reward', 'b_payloadLength', 'b_payloadHash','b_generatorPublicKey','b_blockSignature','t_id',
    't_type','t_timestamp','t_senderPublicKey','t_senderId','t_recipientId','t_senderUsername','t_recipientUsername','t_amount','t_fee','t_signature','t_signSignature','s_publicKey','d_username','v_votes','c_address','u_alias',
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
    't_requesterPublicKey': String,
    't_senderId': String,
    't_recipientId': String,
    't_senderUsername': String,
    't_recipientUsername': String,
    't_amount': String,
    't_fee': String,
    't_signature': String,
    't_signSignautre': String,
    't_signatures': String,
    's_publicKey': String,
    'd_username': String,
    'v_votes': String,
    'u_alias': String,
    'm_min': Number,
    'm_lifetime': Number,
    'm_keysgroup': String,
    'dapp_name': String,
    'dapp_description': String,
    'dapp_tags': String,
    'dapp_type': Number,
    'dapp_category': Number,
    'dapp_git': String,
    'dapp_icon': String,
    'dapp_saiAscii': String,
    'dapp_saiIcon': String,
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

};

privated.list = function (filter, cb) {

};

privated.getById = function (blockId, cb) {

};

privated.popLastBlock = function (oldLastBlock, cb) {

};

privated.getIdSequence = function (height, cb) {

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

privated.applyTransaction = function (txObj, blockObj, sender, cb) {

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
    self.loadBlocksOffset(function (err, block) {
        if(err) {
            console.log('loadBlocksOffset error -> ', err.toString());
        } else {
            privated.lastBlock = block[0];
            library.notification_center.notify('peerReady');
        }
    });
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
                        method: 'GET',
                        api: '/blocks?lastBlockId=' + lastCommonBlockId
                    }, function (err, data) {
                        if (err || data.body.error) {
                            return next(err || data.body.error.toString());
                        }
                        var blocks = data.body.blocks;
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
                                library.modules.peer.state(peer.ip, peer.port, 0, 3600);
                                cb(err);
                            }
                        });
                    }, cb);
                }
            ], function (err, data) {
                if(err) {
                    return setImmediate(cb, err);
                } else {
                    next();
                }
            });
        },
        function (err) {
            setImmediate(cb, err, lastValidBlock);
        });
};

Blocks.prototype.loadBlocksOffset = function(cb) {

    library.dbSequence.add(function (cb) {
        library.dbClient.query('SELECT * FROM blocks ORDER BY height DESC LIMIT 1').then((rows) => {
            let block = rows[0];
            privated.lastBlock = block;
            return cb(null, block);
        }).catch((error) => {
            return cb(error);
        });
    }, cb);
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
                setImmediate(cb, err);
                // library.modules.transactions.applyUnconfirmedList(unconfirmedTransactions, function () {
                //     privated.isActive = false;
                //     setImmediate(cb, err);
                // });
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
                debugger;
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
                            transaction.id = library.base().transaction.getId(transaction);
                        } catch (e) {
                            return setImmediate(cb, e.toString());
                        }
                        transaction.blockId = block.id;
                        library.dbClient.query("SELECT id FROM transactions WHERE id=$id", {id: transaction.id}, ['id'], function (err, rows) {
                            if (err) {
                                return cb(err);
                            }
                            var tId = rows.length && rows[0].id;
                            if (tId) {
                                // Fork transactions already exist
                                library.modules.delegates.fork(block, 2);
                                setImmediate(cb, "Transaction already exists: " + transaction.id);
                            } else {
                                if (appliedTransactions[transaction.id]) {
                                    return setImmediate(cb, "Duplicated transaction in block: " + transaction.id);
                                }
                                library.modules.accounts.getAccount({publicKey: transaction.senderPublicKey}, function (err, sender) {
                                    if (err) {
                                        return cb(err);
                                    }
                                    library.logic.transaction.verify(transaction, sender, function (err) {
                                        if (err) {
                                            return setImmediate(cb, err);
                                        }

                                        library.modules.transactions.applyUnconfirmed(transaction, sender, function (err) {
                                            if (err) {
                                                return setImmediate(cb, "Failed to apply transaction: " + transaction.id);
                                            }

                                            try {
                                                var bytes = library.logic.transaction.getBytes(transaction);
                                            } catch (e) {
                                                return setImmediate(cb, e.toString());
                                            }

                                            appliedTransactions[transaction.id] = transaction;

                                            var index = unconfirmedTransactions.indexOf(transaction.id);
                                            if (index >= 0) {
                                                unconfirmedTransactions.splice(index, 1);
                                            }

                                            payloadHash.update(bytes);

                                            totalAmount += transaction.amount;
                                            totalFee += transaction.fee;

                                            setImmediate(cb);
                                        });
                                    });
                                });
                            }
                        });
                    }, function (err) {
                        var errors = [];

                        if (err) {
                            errors.push(err);
                        }

                        if (payloadHash.digest().toString('hex') !== block.payloadHash) {
                            errors.push("Invalid payload hash: " + block.id);
                        }

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
                                setImmediate(cb);
                                // library.modules.accounts.setAccountAndGet({publicKey: transaction.senderPublicKey}, function (err, sender) {
                                //     if (err) {
                                //         library.log.error("Failed to apply transactions: " + transaction.id);
                                //         process.exit(0);
                                //     }
                                //     library.modules.transactions.apply(transaction, block, sender, function (err) {
                                //         if (err) {
                                //             library.log.error("Failed to apply transactions: " + transaction.id);
                                //             process.exit(0);
                                //         }
                                //         library.modules.transactions.removeUnconfirmedTransaction(transaction.id);
                                //         setImmediate(cb);
                                //     });
                                // });
                            }, function (err) {
                                privated.saveBlock(block, function (err) {
                                    if (err) {
                                        library.log.error("Failed to save block...");
                                        library.log.error(err);
                                        process.exit(0);
                                    }

                                    // library.bus.message('newBlock', block, broadcast);
                                    library.notification_center.notify('newBlock', block, broadcast);
                                    privated.lastBlock = block;
                                    done();
                                    // library.modules.round.tick(block, done);
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

Blocks.prototype.onEnd = function (cb) {

};

// export
module.exports = Blocks;