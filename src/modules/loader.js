var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var bignum = require('../utils/bignum');
// private objects
var modules_loaded, library, self, privated = {}, shared = {};
var Sequelize = require('sequelize');

privated.loaded = false;
privated.genesisBlock = null;
privated.loadingLastBlock = null;
// constructor
function Loader(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.genesisBlock = privated.loadingLastBlock = library.genesisblock;
    setImmediate(cb, null, self);
}

// private methods
privated.loadApp = function () {
    privated.loaded = true;
    library.notification_center.notify('blockchainReady');
};

privated.loadBlocks = function(lastBlock, cb) {
    library.modules.kernel.getFromRandomPeerNews({
        api:'kernel',
        method:'POST',
        func:'height',
        data:'[]',
        jsonrpc: '1.0',
        id: Math.random()
    }, function (err, data) {
        var peerStr = data && data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
        if (err || data.code !== 200) {
            library.log.Info("Failed to get height from peer: " + peerStr);
            return cb();
        }
        library.log.Info("Check blockchain on " + peerStr);

        let height = data.result;
        if (height <= 0) {
            library.log.Info("Failed to parse blockchain height: " + peerStr + "\n" + library.scheme.getLastError());
            return cb();
        }

        if (bignum(library.modules.blocks.getLastBlock().height).lt(height)) { // Diff in chainbases
            privated.blocksToSync = height;
            library.socket.webSocket.send('201|kernel|status|' + JSON.stringify({
                height: library.modules.blocks.getLastBlock().height,
                peerHeight: height,
                peerCount: library.modules.peer.getCount()
            }));
            if (lastBlock.id != privated.genesisBlock.block.id) { // Have to find common block
                // console.log('findUpdate');
                privated.findUpdate(lastBlock, data.peer, cb);
            } else { // Have to load full db
                privated.loadFullDb(data.peer, cb);
            }
        } else {
            cb();
        }
    });
};

/*privated.loadBlocks = function(lastBlock, cb) {
    library.modules.kernel.getFromRandomPeer({
        api: '/height',
        method: 'GET'
    }, function (err, data) {
        var peerStr = data && data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
        if (err) {
            // library.log.Error("Failed to get height from peer: " + peerStr);
            return cb();
        }
        library.log.Info("Check blockchain on " + peerStr);

        let height = data.body.height;
        if (height <= 0) {
            library.log.Info("Failed to parse blockchain height: " + peerStr + "\n" + library.scheme.getLastError());
            return cb();
        }

        if (bignum(library.modules.blocks.getLastBlock().height).lt(height)) { // Diff in chainbases
            privated.blocksToSync = height;
            library.socket.webSocket.send('201|kernel|status|' + JSON.stringify({
                height: library.modules.blocks.getLastBlock().height,
                peerHeight: height,
                peerCount: library.modules.peer.getCount()
            }));
            if (lastBlock.id != privated.genesisBlock.block.id) { // Have to find common block
                // console.log('findUpdate');
                privated.findUpdate(lastBlock, data.peer, cb);
            } else { // Have to load full db
                privated.loadFullDb(data.peer, cb);
            }
        } else {
            cb();
        }
    });
};*/


privated.loadBlockChain = function () {
    var offset = 0, limit = library.config.loading.loadPerIteration;
    var verify = library.config.loading.verifyOnLoading;
    function load(count) {
        verify = true;
        privated.total = count;
        library.base.account.removeTables(function (err) {
            if (err) {
                throw err;
            } else {
                library.base.account.createTables(function (err) {
                    if(err) {
                        throw err;
                    } else {
                        async.until(
                            function () {
                                return count < offset;
                            }, function (cb) {
                                library.log.Info('Current ', offset);
                                setImmediate(function () {
                                    library.modules.blocks.loadBlocksOffset(limit, offset, verify, function (err, lastBlockOffset) {
                                        if(err) {
                                            console.log('Err !!!!!!!!!!!!!!!!!!!');
                                            console.log(err);
                                            return cb(err);
                                        }
                                        offset = offset + limit;
                                        privated.loadingLastBlock = lastBlockOffset;
                                        return cb();
                                    });
                                });
                            }, function (err) {
                                if(err) {
                                    library.log.Error('loadBlocksOffset', err);
                                    if (err.block) {
                                        library.log.Error('Blockchain failed at ', err.block.height);
                                        library.modules.blocks.simpleDeleteAfterBlock(err.block.id, function (err, res) {
                                            if(err) {
                                                console.log('simpleDeleteAfterBlock is err');
                                                console.log(err);
                                            } else {
                                                console.log('simpleDeleteAfterBlock is Success!');
                                                console.log(res);
                                                library.log.Error('Blockchain clipped');
                                                library.notification_center.notify('blockchainReady');
                                            }
                                        });
                                    }
                                } else {
                                    library.log.Info('Blockchain ready');
                                    library.notification_center.notify('blockchainReady');
                                }
                            }
                        );
                    }
                });
            }
        });
    }
    library.base.account.createTables(function (err) {
        if (err) {
            throw err;
        } else {
            library.dbClient.query('SELECT count(*) as Number from accounts where create_block = (select id from blocks where numberOfTransactions > 0 order by height desc limit 1)', {
                type: Sequelize.QueryTypes.SELECT
            }).then((rows) => {
                var reject = !(rows[0].Number);
                library.modules.blocks.count(function (err, count) {
                    // console.log(count);
                    if (err) {
                        return library.log.Error('Failed to count blocks', err);
                    } else {
                        library.dbClient.query('UPDATE accounts SET isDelegate_unconfirmed=isDelegate,secondsign_unconfirmed=secondsign,username_unconfirmed=username,balance_unconfirmed=balance,delegates_unconfirmed=delegates,multisignatures_unconfirmed=multisignatures', {
                            type:Sequelize.QueryTypes.UPDATE
                        }).then((rows) => {
                            if(rows) {
                                library.log.Error("Encountered missing block, looks like node went down during block processing");
                                library.log.Info("Unable to load without verifying, clearing accounts from database and loading");
                                load(count);
                            } else {
                                library.dbClient.query('SELECT master_pub FROM accounts WHERE isDelegate=1', {
                                    type: Sequelize.QueryTypes.SELECT
                                }).then((rows) => {
                                    if(rows.length === 0) {
                                        library.log.Error("No delegates, reload database");
                                        library.log.Info("Unable to load without verifying, clearing accounts from database and loading");
                                        load(count);
                                    } else {
                                        library.modules.blocks.loadBlocksOffset(1, count, verify, function (err, lastBlock) {

                                        });
                                    }
                                }).catch((err) => {
                                    library.log.Error(err);
                                    library.log.Info("Unable to load without verifying, clearing accounts from database and loading");
                                    load(count);
                                });
                            }
                        }).catch((err) => {
                            library.log.Info("Unable to load without verifying, clearing accounts from database and loading");
                            library.log.Error(err);
                            load(count);
                        })
                    }
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    });
};

privated.loadUnconfirmedTransactions = function (cb) {
    library.modules.kernel.getFromPeerNews({
        api: '/kernel',
        method: 'post',
        func: 'transactions',
        id: 10,
        jsonrpc: '1.0'
    }, function (err, data) {
        if(err) {
            return cb();
        }
        // var report = library.schema.validate(data.body, {
        //     type: "object",
        //     properties: {
        //         transactions: {
        //             type: "array",
        //             uniqueItems: true
        //         }
        //     },
        //     required: ['transactions']
        // });
        // if (!report) {
        //     return cb();
        // }

        if(data.code !== 200) {
            console.log(data);
            return cb();
        }
        var transactions = data.result;

        for (var i = 0; i < transactions.length; i++) {
            try {
                transactions[i] = library.base.transaction.objectNormalize(transactions[i]);
            } catch (e) {
                var peerStr = data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
                library.log.Debug('Transaction ' + (transactions[i] ? transactions[i].id : 'null') + ' is not valid, ban 60 min', peerStr);
                library.modules.peer.state(data.peer.ip, data.peer.port, 0, 3600);
                return setImmediate(cb);
            }
        }
        library.balancesSequence.add(function (cb) {
            library.modules.transactions.receiveTransactions(transactions, cb);
        }, cb);
    });
};

privated.findUpdate = function(lastBlock, peer, cb) {
    var peerStr = peer ? ip.fromLong(peer.ip) + ":" + peer.port : 'unknown';
    library.log.Info("Looking for common block with " + peerStr);

    library.modules.blocks.getCommonBlock(peer, lastBlock.height, function (err, commonBlock) {
        if(err) {
            return cb(err);
        }
        library.log.Info("Found common block " + commonBlock.id + " (at " + commonBlock.height + ")" + " with peer " + peerStr);
        var toRemove = lastBlock.height - commonBlock.height;
        if (toRemove > 1010) {
            library.log.log("long fork, ban 60 min", peerStr);
            library.modules.peer.state(peer.ip, peer.port, 0, 3600);
            return cb();
        }
        var overTransactionList = [];
        library.modules.transactions.undoUnconfirmedList(function (err, unconfirmedList) {
            if (err) {
                return process.exit(0);
            }
            for (var i = 0; i < unconfirmedList.length; i++) {
                var transaction = library.modules.transactions.getUnconfirmedTransaction(unconfirmedList[i]);
                overTransactionList.push(transaction);
                library.modules.transactions.removeUnconfirmedTransaction(unconfirmedList[i]);
            }
            async.series([
                function (cb) {
                    if (commonBlock.id != lastBlock.id) {
                        library.modules.round.directionSwap('backward', lastBlock, cb);
                        console.log('modules.round.directionSwap -> backward')
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    // library.bus.message('deleteBlocksBefore', commonBlock);
                    // library.notification_center.notify('blockchainReady', commonBlock);

                    library.modules.blocks.deleteBlocksBefore(commonBlock, cb);
                },
                function (cb) {
                    if (commonBlock.id != lastBlock.id) {
                        console.log('modules.round.directionSwap -> forward');
                        library.modules.round.directionSwap('backward', lastBlock, cb);
                    } else {
                        cb();
                    }
                },
                function (cb) {
                    library.log.Debug("Loading blocks from peer " + peerStr);
                    library.modules.blocks.loadBlocksFromPeer(peer, commonBlock.id, function (err, lastValidBlock) {
                        if(err) {
                            console.log(err);
                            //撤销操作
                            console.log('loadBlocksFromPeer is error!!!!!!!!!!!!!');
                            cb();
                        } else {
                            for (var i = 0; i < overTransactionList.length; i++) {
                                library.modules.transactions.pushHiddenTransaction(overTransactionList[i]);
                            }

                            var trs = library.modules.transactions.shiftHiddenTransaction();
                            async.whilst(
                                function () {
                                    return trs;
                                },
                                function (next) {
                                    library.modules.transactions.processUnconfirmedTransaction(trs, true, function () {
                                        trs = library.modules.transactions.shiftHiddenTransaction();
                                        next();
                                    });
                                },
                            cb);
                        }
                    });
                }
            ], cb)
        });
    });
};

privated.loadSignatures = function (cb) {
    library.modules.kernel.getFromRandomPeer({
        api: '/signatures',
        method: 'GET',
        not_ban: true
    }, function (err, data) {
        if (err) {
            return cb();
        }
        library.scheme.validate(data.body, {
            type: "object",
            properties: {
                signatures: {
                    type: "array",
                    uniqueItems: true
                }
            },
            required: ['signatures']
        }, function (err) {
            if (err) {
                return cb();
            }

            // library.sequence.add(function (cb) {
            //     async.eachSeries(data.body.signatures, function (signature, cb) {
            //         async.eachSeries(signature.signatures, function (s, cb) {
            //             library.modules.multisignatures.processSignature({
            //                 signature: s,
            //                 transaction: signature.transaction
            //             }, function (err) {
            //                 setImmediate(cb);
            //             });
            //         }, cb);
            //     }, cb);
            // }, cb);
        });
    });
};

privated.loadFullDb = function(peer, cb) {
    var peerStr = peer ? ip.fromLong(peer.ip) + ":" + peer.port : 'unknown';
    var commonBlockId = privated.genesisBlock.block.id;
    library.log.Debug("Loading blocks from genesis from " + peerStr);

    library.modules.blocks.loadBlocksFromPeer(peer, commonBlockId, cb);
};

// public methods
Loader.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Loader.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Loader.prototype.callApi = function (args) {

};

Loader.prototype.blockIsReady = function() {
    return privated.loaded;
};

// events
Loader.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;

    // privated.loadApp();
    privated.loadBlockChain();
};

Loader.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Loader.prototype.onSendBlockStatus = function() {
    let status = {
        status: privated.loaded ? "blockchainReady" : "blockchainError"
    };
    let msg = '201|loader|start|' + JSON.stringify(status);
    library.socket.webSocket.send(msg);
};

Loader.prototype.onPeerReady = function() {
    setImmediate(function nextLoadBlock() {
        if(!privated.loaded) return;
        privated.isActive = true;
        library.sequence.add(function (cb) {
            let lastBlock = library.modules.blocks.getLastBlock();
            privated.loadBlocks(lastBlock, cb);
        }, function (err) {
            err && library.log.Error('loadBlocks timer', err);
            privated.isActive = false;
            if (!privated.loaded)
                return;
            setTimeout(nextLoadBlock, 9 * 1000);
        });
    });

    // setImmediate(function nextLoadUnconfirmedTransactions() {
    //     if (!privated.loaded)
    //         return;
    //     privated.loadUnconfirmedTransactions(function (err) {
    //         err && library.log.Error('loadUnconfirmedTransactions timer', err);
    //         setTimeout(nextLoadUnconfirmedTransactions, 14 * 1000);
    //     });
    // });

    // setImmediate(function nextLoadSignatures() {
    //     if (!privated.loaded)
    //         return;
    //     privated.loadSignatures(function (err) {
    //         err && library.log.Error('loadSignatures timer', err);
    //
    //         setTimeout(nextLoadSignatures, 14 * 1000);
    //     });
    // });
};

Loader.prototype.onEnd = function (cb) {
    privated.loaded = false;
    cb();
};

// shared
shared.status = function (req, cb) {

};

shared.status_sync = function (req, cb) {

};

// export
module.exports = Loader;