var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var Sequelize = require('sequelize');

var modules_loaded, library, self, privated = {}, shared = {};

privated.loaded = false;

privated.feesByRound = {};
privated.rewardsByRound = [];
privated.delegatesByRound = [];
privated.unFeesByRound = {};
privated.unRewardsByRound = [];
privated.unDelegatesByRound = [];

// constructor
function Round(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

//Round changes
function RoundChanges (round) {
    var roundFees = parseInt(privated.feesByRound[round]) || 0;
    var roundRewards = (privated.rewardsByRound[round + 1] || []);

    this.at = function () {
        var fees = Math.floor(roundFees / constants.delegates);
        var feesRemaining = roundFees - (fees * constants.delegates);
        var rewards = parseInt(roundRewards) || 0;

        return {
            fees: fees,
            feesRemaining: feesRemaining,
            rewards: rewards,
            balance: fees + rewards
        };
    };
}

// public methods
Round.prototype.loaded = function () {
    return privated.loaded;
};

Round.prototype.calc = function (height) {
    return Math.floor(height / constants.delegates) + (height % constants.delegates > 0 ? 1 : 0);
};

Round.prototype.getVotes = function (round, cb) {
    var sql = 'SELECT delegate, amount FROM (SELECT m.delegate, SUM(m.amount) as amount , m.round FROM accounts_round m GROUP BY m.delegate, m.round) a WHERE round = $round';

    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            round: round
        }
    }).then(function (rows) {

    }, function (err) {
        cb(err, undefined);
    });
};

Round.prototype.flush = function (round, cb) {
    library.dbClient.query("DELETE FROM accounts_round WHERE round = $round", {
        type: Sequelize.QueryTypes.DELETE,
        bind: {
            round: round
        }
    }).then(function (rows) {
        cb();
    }, function (err) {
        cb(err, undefined);
    });
};

Round.prototype.directionSwap = function (direction, lastBlockObj, cb) {
    if (direction == 'backward') {
        privated.feesByRound = {};
        privated.rewardsByRound = {};
        privated.delegatesByRound = {};
        self.flush(self.calc(lastBlockObj.height), cb);
    } else {
        privated.unFeesByRound = {};
        privated.unRewardsByRound = {};
        privated.unDelegatesByRound = {};
        self.flush(self.calc(lastBlockObj.height), cb);
    }
};

Round.prototype.backwardTick = function (blockObj, previousBlockObj, cb) {
    function done(err) {
        cb && cb(err);
    }

    library.modules.accounts.mergeAccountAndGet({
        master_address: blockObj.generatorPublicKey,
        prod_blocks: -1,
        blockHash: blockObj.hash,
        round: self.calc(blockObj.height)
    }, function (err) {
        if (err) {
            return done(err);
        }

        var round = self.calc(blockObj.height);

        var preRound = self.calc(previousBlockObj.height);

        privated.unFeesByRound[round] = privated.unFeesByRound[round] || 0;
        privated.unFeesByRound[round] += blockObj.totalFee;

        privated.unRewardsByRound[round] = privated.unRewardsByRound[round] || [];
        privated.unRewardsByRound[round].push(blockObj.reward);

        privated.unDelegatesByRound[round] = privated.unDelegatesByRound[round] || [];
        privated.unDelegatesByRound[round].push(blockObj.generatorPublicKey);

        if (preRound !== round || previousBlockObj.height == 1) { // means preRound is the last item in that round
            if (privated.unDelegatesByRound[round].length == constants.delegates || previousBlockObj.height == 1) {
                var outsiders = [];

                async.series([
                    function (cb) {
                        if (blockObj.height != 1) {
                            library.modules.delegates.generateDelegateList(blockObj.height, function (err, roundDelegates) {
                                if (err) {
                                    return cb(err);
                                }
                                for (var i = 0; i < roundDelegates.length; i++) {
                                    if (privated.unDelegatesByRound[round].indexOf(roundDelegates[i]) == -1) {
                                        outsiders.push(library.modules.accounts.generateAddressByPubKey(roundDelegates[i]));
                                    }
                                }
                                cb();
                            });
                        } else {
                            cb();
                        }
                    },
                    function (cb) {
                        if (!outsiders.length) {
                            return cb();
                        }
                        var escaped = outsiders.map(function (item) {
                            return "'" + item + "'";
                        });
                        library.dbClient.query("UPDATE accounts SET missed_blocks = missed_blocks + 1 WHERE master_address IN (" + escaped.join(',') + ")", {
                            type: Sequelize.QueryTypes.BULKUPDATE
                        }).then(function (rows) {
                            cb();
                        }, function (err) {
                            cb(err, undefined);
                        });
                    },
                    function (cb) {
                        self.getVoices(round, function (err, votes) {
                            if (err) {
                                return cb(err);
                            }
                            async.eachSeries(votes, function (vote, cb) {
                                library.dbClient.query("UPDATE accounts SET vote = vote + $amount WHERE master_address = $master_address", {
                                    type: Sequelize.QueryTypes.UPDATE,
                                    bind: {
                                        master_address: library.modules.accounts.generateAddressByPubKey(vote.delegate),
                                        amount: vote.amount
                                    }
                                }).then(function (rows) {
                                    self.flush(round, function (err) {
                                        cb(err);
                                    });
                                }, function (err) {
                                    self.flush(round, function (err) {
                                        cb(err);
                                    });
                                });
                            });
                        });
                    },
                    function (cb) {
                        var roundChanges = new RoundChanges(round);

                        async.forEachOfSeries(privated.delegatesByRound[round], function (delegate, index, cb) {
                            var changes = roundChanges.at(index);

                            library.modules.account.mergeAccountAndGet({
                                master_pub: delegate,
                                balance: -changes.balance,
                                balance_unconfirmed: -changes.balance,
                                blockHash: blockObj.hash,
                                round: self.calc(blockObj.height),
                                fees: -changes.fees,
                                rewards: -changes.rewards
                            }, function (err) {
                                if (err) {
                                    return cb(err);
                                }
                                if (index === privated.delegatesByRound[round].length - 1) {
                                    library.modules.account.mergeAccountAndGet({
                                        master_pub: delegate,
                                        balance: -changes.feesRemaining,
                                        balance_unconfirmed: -changes.feesRemaining,
                                        blockHash: blockObj.hash,
                                        round: self.calc(blockObj.height),
                                        fees: -changes.feesRemaining
                                    }, cb);
                                } else {
                                    cb();
                                }
                            });
                        }, cb);
                    },
                    function (cb) {
                        self.getVotes(round, function (err, votes) {
                            if (err) {
                                return cb(err);
                            }
                            async.eachSeries(votes, function (vote, cb) {
                                library.dbClient.query("UPDATE accounts SET vote = vote + $amount WHERE master_address = $master_address", {
                                    type: Sequelize.QueryTypes.UPDATE,
                                    bind: {
                                        master_address: library.modules.accounts.generateAddressByPubKey(vote.delegate),
                                        amount: vote.amount
                                    }
                                }).then(function (rows) {
                                    library.notification_center.notify('finishRound', round);
                                    self.flush(round, function (err) {
                                        cb(err);
                                    });
                                }, function (err) {
                                    library.notification_center.notify('finishRound', round);
                                    self.flush(round, function (err) {
                                        cb(err);
                                    });
                                });
                            });
                        })
                    }
                ], function (err) {
                    delete privated.unFeesByRound[round];
                    delete privated.unRewardsByRound[round];
                    delete privated.unDelegatesByRound[round];

                    done(err);
                });
            } else {
                done();
            }
        } else {
            done();
        }
    });
};

Round.prototype.tick = function (blockObj, cb) {
    function done(err) {
        cb && setImmediate(cb, err);
    }

    library.modules.accounts.mergeAccountAndGet({
        master_address: blockObj.generatorPublicKey,
        prod_blocks: 1,
        blockHash: blockObj.hash,
        round: self.calc(blockObj.height)
    }, function (err) {
        if (err) {
            return done(err);
        }
        var round = self.calc(blockObj.height);

        privated.feesByRound[round] = privated.feesByRound[round] || 0;
        privated.feesByRound[round] += blockObj.totalFee;

        privated.rewardsByRound[round] = privated.rewardsByRound || [];
        privated.rewardsByRound[round].push(blockObj.reward);

        privated.delegatesByRound[round] = privated.delegatesByRound[round] || [];
        privated.delegatesByRound[round].push(blockObj.generatorPublicKey);

        var nextRound = self.calc(blockObj.height + 1);
        // return done();
        if (round !== nextRound || blockObj.height === 1) { // means it is the last item in current round
            if (privated.delegatesByRound[round].length === constants.delegates || blockObj.height === 1 || blockObj.height === 101) {
                var outsiders = [];

                async.series([
                    function (cb) {
                        if (!outsiders.length) {
                            return cb();
                        }
                        var escaped = outsiders.map(function (item) {
                            return "'" + item + "'";
                        });
                        library.dbClient.query("UPDATE accounts SET missed_blocks = missed_blocks + 1 WHERE master_address IN (" + escaped.join(',') + ")", {
                            type: Sequelize.QueryTypes.UPDATE
                        }).then(function (rows) {
                            cb();
                        }, function (err) {
                            cb(err, undefined);
                        });
                    },
                    function (cb) {
                        var roundChanges = new RoundChanges(round);
                        var changes = roundChanges.at();

                        library.modules.accounts.mergeAccountAndGet({
                            master_pub: blockObj.generatorPublicKey,
                            balance: changes.balance,
                            balance_unconfirmed: changes.balance,
                            blockHash: blockObj.hash,
                            round: self.calc(blockObj.height),
                            fees: changes.fees,
                            rewards: changes.rewards
                        }, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            library.modules.accounts.mergeAccountAndGet({
                                master_pub: blockObj.generatorPublicKey,
                                balance: changes.feesRemaining,
                                balance_unconfirmed: changes.feesRemaining,
                                blockHash: blockObj.hash,
                                round: self.calc(blockObj.height),
                                fees: changes.feesRemaining
                            }, cb);
                        });

                        /*async.forEachOfSeries(privated.delegatesByRound[round], function (delegate, index, cb) {
                            var changes = roundChanges.at(index);

                            library.modules.accounts.mergeAccountAndGet({
                                master_pub: delegate,
                                balance: changes.balance,
                                balance_unconfirmed: changes.balance,
                                blockHash: blockObj.hash,
                                round: self.calc(blockObj.height),
                                fees: changes.fees,
                                rewards: changes.rewards
                            }, function (err) {
                                if (err) {
                                    return cb(err);
                                }
                                if (index === privated.delegatesByRound[round].length - 1) {
                                    library.modules.accounts.mergeAccountAndGet({
                                        master_pub: delegate,
                                        balance: changes.feesRemaining,
                                        balance_unconfirmed: changes.feesRemaining,
                                        blockHash: blockObj.hash,
                                        round: self.calc(blockObj.height),
                                        fees: changes.feesRemaining
                                    }, cb);
                                } else {
                                    cb();
                                }
                            });
                        }, cb);*/
                    }
                ], function (err) {
                    delete privated.feesByRound[round];
                    delete privated.rewardsByRound[round];
                    delete privated.delegatesByRound[round];

                    done(err);
                });
            } else {
                done();
            }
        } else {
            done();
        }
    });
};

// Events
Round.prototype.onInit = function (modules_loaded) {
    modules_loaded = modules_loaded;
};

Round.prototype.onBlockchainReady = function () {
    // var round = self.calc(library.modules.blocks.getLastBlock().height);
    // var sql = 'SELECT SUM(b.totalFee), GROUP_CONCAT(b.reward), GROUP_CONCAT(lower(b.generatorPublicKey)) FROM blocks b WHERE (SELECT (CAST(b.height / 1 AS INTEGER) + (CASE WHEN b.height % 101 > 0 THEN 1 ELSE 0 END))) = $round';
    //
    // library.dbClient.query(sql, {
    //     type: Sequelize.QueryTypes.SELECT,
    //     bind: {
    //         round: round
    //     }
    // }).then(function (rows) {
    //     if (rows.length) {
    //         privated.feesByRound[round] = rows[0].fees;
    //         privated.rewardsByRound[round] = rows[0].rewards;
    //         privated.delegatesByRound[round] = rows[0].delegates;
    //         privated.loaded = true;
    //     }
    // }, function (err) {
    //     library.log.Error("Round [onBlockchainReady]", "Error", err.toString());
    // });
};

Round.prototype.onFinishRound = function () {

};

Round.prototype.onEnd = function (cb) {
    privated.loaded = false;
    cb();
};

// Export
module.exports = Round;