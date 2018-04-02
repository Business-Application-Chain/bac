var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
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
Peer.prototype.callApi = function (method, params, id) {
    console.log('call api');
    return new Promise((resolve, reject) => {
        if (method == 'peer_test') {
            resolve('yes, correct');
        } else {
            reject('no, incorrect');
        }
    })
};

// export
module.exports = Peer;