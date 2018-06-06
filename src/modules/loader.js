var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var bignum = require('../utils/bignum');
// private objects
var modules_loaded, library, self, privated = {}, shared = {};

privated.loaded = false;
privated.genesisBlock = null;
privated.loadingLastBlock = null;
// constructor
function Loader(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.genesisBlock = privated.loadingLastBlock = library.genesisblock;
    setImmediate(cb, null, self);
}

// private methods
privated.loadApp = function () {
    privated.loaded = true;
    library.notification_center.notify('blockchainReady');
};

privated.loadBlocks = function(lastBlock, cb) {
    library.modules.kernel.getFromRandomPeer({
        api: '/height',
        method: 'GET'
    }, function (err, data) {
        var peerStr = data && data.peer ? ip.fromLong(data.peer.ip) + ":" + data.peer.port : 'unknown';
        if (err || !data.body) {
            library.log.Info("Failed to get height from peer: " + peerStr);
            return cb();
        }
        library.log.Info("Check blockchain on " + peerStr);
        data.body.height = parseInt(data.body.height);

        if (data.body.height <= 0) {
            library.log.Info("Failed to parse blockchain height: " + peerStr + "\n" + library.scheme.getLastError());
            return cb();
        }

        if (bignum(library.modules.blocks.getLastBlock().height).lt(data.body.height)) { // Diff in chainbases
            privated.blocksToSync = data.body.height;

            if (lastBlock.id != privated.genesisBlock.block.id) { // Have to find common block
                console.log('findUpdate');
            } else { // Have to load full db
                privated.loadFullDb(data.peer, cb);
            }
        } else {
            cb();
        }

    });
};

privated.loadFullDb = function(peer, cb) {
    var peerStr = peer ? ip.fromLong(peer.ip) + ":" + peer.port : 'unknown';
    var commonBlockId = privated.genesisBlock.block.id;
    library.log.Debug("Loading blocks from genesis from " + peerStr);

    library.modules.blocks.loadBlocksFromPeer(peer, commonBlockId, cb);
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

};

Loader.prototype.onPeerReady = function() {
    setImmediate(function nextLoadBlock() {
        if(!privated.loaded) return;
        privated.isActive = true;
        library.sequence.add(function (cb) {
            let lastBlock = library.modules.blocks.getLastBlock();
            privated.loadBlocks(lastBlock, cb);
        });
        setTimeout(nextLoadBlock, 9*1000);
    });
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