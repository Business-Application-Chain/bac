var async = require('async');
var constants = require('../utils/constants.js');
var sandboxHelper = require('../utils/sandbox.js');

var modules_loaded, library, self, privated = {}, shared = {};

privated.feesByRound = {};
privated.rewardsByRound = {};
privated.delegatesByRound = {};
privated.unFeesByRound = {};
privated.unRewardsByRound = {};
privated.unDelegatesByRound = {};

// Constructor
function Round(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    setImmediate(cb, null, self);
}

//Round changes
function RoundChanges(round) {
    var roundFees = parseInt(privated.feesByRound[round]) || 0;
    var roundRewards = (privated.rewardsByRound[round] || []);

    this.at = function (index) {
        var fees = Math.floor(roundFees / constants.delegates);
        var feesRemaining = roundFees - (fees * constants.delegates);
        var rewards = parseInt(roundRewards[index]) || 0;

        return {
            fees: fees,     //费用
            feesRemaining: feesRemaining,   //剩下的费用
            rewards: rewards,   //酬劳
            balance: fees + rewards     //总共的支出
        };
    };
}

Round.prototype.loaded = function () {
    return privated.loaded;
};

Round.prototype.calc = function (height) {
    //Math.floor 求一个最接近的整数
    return Math.floor(height / constants.delegates) + (height % constants.delegates > 0 ? 1 : 0);
};

Round.prototype.getVotes = function (round, cb) {

};

Round.prototype.flush = function (round, cb) {

};

Round.prototype.dircetionSwap = function (direction, lastBlock, cb) {

};

Round.prototype.backwardTick = function (block, previousBlock, cb) {

};

Round.prototype.onBind = function (modules_loaded) {
    modules_loaded = modules_loaded;
};

Round.prototype.onBlockchainReady = function () {
    var round = self.calc(library.block.getLastBlock().height);
};