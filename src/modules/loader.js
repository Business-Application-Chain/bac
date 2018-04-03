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
privated.loadApp = function () {
    library.notification_center.notify('blockchainReady');
    // console.log('loadApp');
    // library.base.account.createTables(function (err) {
    //     if (err) {
    //         console.log('blockchainReady err');
    //         throw new Error(err.toString());
    //     } else {
    //         console.log('blockchainReady');
    //         library.notification_center.notify('blockchainReady');
    //     }
    // })
};

// public methods
Loader.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Loader.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Loader.prototype.callApi = function (args) {

};

// events
Loader.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;

    privated.loadApp();
};

Loader.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Loader.prototype.onEnd = function (cb) {
    privated.loaded = false;
    cb();
};

// shared
shared.status = function (req, cb) {

};

shared.status_sync = function (req, cb) {

};

// export
module.exports = Loader;