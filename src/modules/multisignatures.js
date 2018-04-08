var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');
var ByteBuffer = require('bytebuffer');
var slots = require('../utils/slots.js');
var TransactionTypes = require('../utils/transaction-types.js');
var Diff = require('../utils/diff.js');

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, genesisblock = null;

privated.unconfirmedSignatures = {};

function Multisignature() {

    this.calculateFee = function (txObj, sender) {
        return ((txObj.asset.multisignature.keysgroup.length + 1) * 5) * constants.fixedPoint;
    };

    this.create = function (data, txObj) {
        txObj.recipientId = null;
        txObj.amount = 0;
        txObj.asset.multisignature = {
            min: data.min,
            lifetime: data.lifetime,
            keysgroup: data.keysgroup
        };

        return txObj;
    };

    this.objectNormalize = function (txObj) {

    };

    this.getBytes = function (txObj) {

    };

    this.ready = function (txObj, sender) {

    };

    this.process = function (txObj, sender, cb) {

    };

    this.verify = function (txObj, sender, cb) {

    };

    this.apply = function (txObj, blockObj, sender, cb) {

    };

    this.undo = function (txObj, blockObj, sender, cb) {

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
function Multisignatures(cb, scope) {
    library = scope;
    genesisblock = library.genesisblock;
    self = this;
    self.__private = privated;

    library.base.transaction.attachAssetType(TransactionTypes.MULTI, new Multisignature());

    setImmediate(cb, null, self);
}

// public methods
Multisignatures.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Multisignatures.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Multisignatures.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Multisignatures;