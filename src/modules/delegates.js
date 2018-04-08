var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

function Delegate() {

    this.calculateFee = function (txObj, sender) {

    };

    this.create = function (data, txObj) {

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
function Delegates(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// public methods
Delegates.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Delegates.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// Events
Delegates.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Delegates;