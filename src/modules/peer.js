var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var sequelize = require('sequelize');
var ip = require('ip');

require('array.prototype.find'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

// constructor
function Peer(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// private methods

// public methods
Peer.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Peer.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

// events
Peer.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Peer.prototype.onBlockchainReady = function () {

};

Peer.prototype.onEnd = function (cb) {

    cb();
};

// shared
shared.peer_test = function (req, cb) {
    cb(null, 'successed');
};

// export
module.exports = Peer;