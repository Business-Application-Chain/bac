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

    // library.base.account.createTables(function (err) {
    //     if (err) {
    //         throw new Error(err.toString());
    //     } else {
    //         library.base.account.removeTables(function (err) {
    //             if (err) {
    //                 throw new Error(err.toString());
    //             } else {
    //                 library.base.account.createTables(function (err) {
    //                     if (err) {
    //                         throw new Error(err.toString());
    //                     }
    //                 });
    //             }
    //         });
    //         library.notification_center.notify('blockchainReady');
    //     }
    // });

    // library.base.account.createTables(function (err) {
    //     if (err) {
    //         throw new Error(err.toString());
    //     } else {
    //         library.base.account.findAll({master_address: '6202245275956910442L'}, function (err, data) {
    //             console.log(JSON.stringify(data));
    //         });
    //     }
    // });

    // library.base.account.createTables(function (err) {
    //     if (err) {
    //         throw new Error(err.toString());
    //     } else {
    //         library.base.account.insertOrUpdate('6202245275956910442L', {
    //             username: 'alex444'
    //         }, function (err, data) {
    //             console.log(">>>>> output: ");
    //         });
    //     }
    // });

    library.base.account.createTables(function (err) {
        if (err) {
            throw new Error(err.toString());
        } else {
            library.base.account.remove('6202245275956910443L', function (err, data) {
                console.log(">>>>> output: ");
            });
        }
    });

    // library.base.account.createTables(function (err) {
    //     if (err) {
    //         throw new Error(err.toString());
    //     } else {
    //         library.base.account.merge('6202245275956910442L', {
    //             master_pub: '3319e5bb7b26eda2f3ba91d55536e8260b58bb37b968233823c2ba588200459f',
    //             balance: 10000,
    //             blockId: '8593810399212843182',
    //
    //         }, function (err, data) {
    //
    //         });
    //     }
    // });
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