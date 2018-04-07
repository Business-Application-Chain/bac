var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');

var modules_loaded, library, self, privated = {}, shared = {};

privated.hiddenTransactions = [];
privated.unconfirmedTransactions = [];
privated.unconfirmedTransactionsIdIndex = {};
privated.doubleSpendingTransactions = {};

function Transaction_0() {

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
        if (sender.multisignatures.length) {
            if (!txObj.signatures) {
                return false;
            }

            return txObj.signatures.length >= sender.multimin - 1;
        } else {
            return true;
        }
    };

    this.process = function (txObj, sender, cb) {
        setImmediate(cb, null, txObj);
    };

    this.verify = function (txObj, sender, cb) {
        if ('/^[0-9]+[L|l]$/g'.test(txObj.recipientId.toLowerCase()) <= 0) {
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

    };

    this.undoUnconfirmed = function (txObj, sender, cb) {

    };

    this.load = function (raw) {

    };

    this.save = function (txObj, cb) {

    };
}

// constructor
function Transactions(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// public methods
Transactions.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Transactions.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Transactions.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Transactions;