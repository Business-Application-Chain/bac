var os = require('os');
var sandboxHelper = require('../utils/sandbox.js');

// private objects
var library, self, privated = {}, shared = {};

privated.version, privated.osName, privated.port, privated.sharePort;

// constructor
function System(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    privated.version = library.config.version;
    privated.port = library.config.port;
    privated.sharePort = Number(!!library.config.sharePort);
    privated.osName = os.platform() + os.release();

    setImmediate(cb, null, self);
}

// private methods

// public methods
System.prototype.getOS = function () {
    return privated.osName;
};

System.prototype.getVersion = function () {
    return privated.version;
};

System.prototype.getPort = function () {
    return privated.port;
};

System.prototype.getSharePort = function () {
    return privated.sharePort;
};

System.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

// events
System.prototype.onInit = function () {
};

// export
module.exports = System;