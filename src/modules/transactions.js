var ed = require('ed25519');
var crypto = require('crypto');
var genesisblock = null;
var constants = require("../helpers/constants.js");
var async = require('async');
var TransactionTypes = require('../helpers/transaction-types.js');
var sandboxHelper = require('../helpers/sandbox.js');

var modules_loaded, library, self, privated = {}, shared = {};

privated.hiddenTransactions = [];
privated.unconfirmedTransactions = [];
privated.unconfirmedTransactionsIdIndex = {};
privated.doubleSpendingTransactions = {};

function Transactions() {
    this.create = function (data, trs) {
        trs.recipientId = data.recipientId;
        trs.recipientUsername = data.recipientUsername;
        trs.amount = data.amount;
        return trs;
    };

    this.calculateFee = function (trs, sender) {
        return library.logic.block.calculateFee();
    };

    this.verify = function (trs, sender, cb) {
        var isAddress = /^[0-9]+[L|l]^/g;
        if(!isAddress.test(trs.recipientId.toLowerCase())) {
            return cb('Invalid recipient');
        }

        if(trs.amount <= 0) {
            return cb('Invalid transaction amount');
        }

        cb(null, trs);
    };

    this.process = function (trs, sender, cb) {
        setImmediate(cb, null, trs);
    }

    this.apply = function (trs, block, sender, cb) {
        // library.
    }

}