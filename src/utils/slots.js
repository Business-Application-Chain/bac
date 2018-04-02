var constants = require('./constants.js');
/**
 * Get time from Ebookcoin epoch.
 * @param {number|undefined} time Time in unix seconds
 * @returns {number}
 */

function beginEpochTime() {
    var d = new Date(Date.UTC(2016, 5, 20, 0, 0, 0, 0)); //Testnet starts from 2016.6.20

    return d;
}

function getEpochTime(time) {
    if (time === undefined) {
        time = (new Date()).getTime();
    }
    var d = beginEpochTime();
    var t = d.getTime();
    return Math.floor((time - t) / 1000);
}

module.exports = {
    getTime: function(time) {
        return getEpochTime(time);
    },

    getRealTime: function(epochTime) {
        if (epochTime === undefined) {
            epochTime = this.getTime()
        }
        var d = beginEpochTime();
        var t = Math.floor(d.getTime() / 1000) * 1000;
        return t + epochTime * 1000;
    },

    getSlotNumber: function(epochTime) {
        if (epochTime === undefined) {
            epochTime = this.getTime()
        }
        return Math.floor(epochTime / constants.interval);
    },

    getSlotTime: function(slot) {
        return slot * constants.interval;
    },

    getNextSlot: function() {
        var slot = this.getSlotNumber();

        return slot + 1;
    },

    getLastSlot: function(nextSlot) {
        return nextSlot + constants.delegates;
    },

    roundTime: function(date) {
        Math.floor(date.getTime() / 1000) * 1000
    }
}
