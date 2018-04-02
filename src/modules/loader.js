var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

privated.loaded = false;

// constructor
function Loader(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// private methods
privated.attachApi = function () {

};

// public methods
Loader.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

// events
Loader.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Loader.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Loader.prototype.onEnd = function (cb) {
    privated.loaded = false;
    cb();
};

// export
module.exports = Loader;