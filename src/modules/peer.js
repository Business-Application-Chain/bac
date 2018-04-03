var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var sequelize = require('sequelize');
var ip = require('ip');
var appConfig = require('../../config.json');
var request = require('request');

require('array.prototype.find'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

// constructor
function Peer(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.loadApp();
    setImmediate(cb, null, self);
}

// private methods
privated.loadApp = function () {
    // library.base.peer.findAll((res) => {
    //     console.log(res);
    // });

};

privated.updatePeerList = function (peers, cb) {
    peers.forEach(function (peer) {
        var option = {
            uri: `http://${ip.fromLong(peer.ip)}:${peer.port}/rpc`,
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                method: "peer_get_peers",
                params: {}
            })
        };
        request(option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var new_peers = JSON.parse(body).result;
                new_peers.forEach((item) => {
                    console.log(item);
                })
            }
        });
        // http.request(options, function (data_peers) {
        //     data_peers.result.forEach((item, index) => {
        //         library.base.peer.findOrCreate(item, (err, res) => {
        //             if(res) {
        //                 console.log('add peer success')
        //                 // console.log('updatePeerList', err)
        //             } else {
        //                 console.log('peers list is empty')
        //             }
        //         })
        //     });
        // });
    });
};

//Transport
Peer.prototype.getFromRandomPeer = function (peers, cb) {

    async.retry(20, (cb) => {
        //获取种子节点中的节点

    }, (err, results) => {
        cb(err, results);
    })
};


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
    // console.log(library.config.peers.default)
    async.eachSeries(library.config.peers.default, function (peer, cb) {
        peer.version = library.config.version;
        peer.ip = ip.toLong(peer.ip);
        library.base.peer.findOrCreate(peer, (err) => {
            if(err) {
                console.log('onBlockchainReady', err)
            }
            library.base.peer.getCount((err, res) => {
                console.log('err', err, ' res ', res);
                if(res) {
                    privated.updatePeerList(err)
                } else {
                    console.log('peers list is empty');
                }
            })
        });
    })
};

Peer.prototype.onEnd = function (cb) {

    cb();
};

// shared
shared.peer_test = function (req, cb) {
    cb(null, 'successed');
};

//获取 某节点下的peers
shared.peer_get_peers = function (req, cb) {
    // cb(null, 'successed1');
    // library.base.peer.create(10000000, 8000, 2, 'mac', 1, '0.0.1');
    library.base.peer.findAll((listData) => {
        console.log('data -> ', listData);
        var data = [];
        listData.forEach(function (item, index) {
            data.push(item.dataValues);
        });
        cb(null, data);
    });
};

// export
module.exports = Peer;