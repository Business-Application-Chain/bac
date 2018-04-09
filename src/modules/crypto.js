var async = require('async');
var constants = require('../utils/constants.js');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var crypto = require('crypto');
var ed = require('ed25519');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

privated.loaded = false;

// constructor
function Crypto(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// public methods
Crypto.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

// events
Crypto.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Crypto.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

// export
module.exports = Crypto;