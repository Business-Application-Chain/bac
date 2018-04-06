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
    // library.base.peeer.createTables((err, data) => {
    //     if(err) {
    //         console.log('is err', err);
    //     } else {
    //         console.log('is success', data);
    //     }
    // });
    var peer = {
        ip:2130706413,
        port: 8000
    }
    library.base.peeer.findAll(peer);

    // var peer = {
    //     ip: 2130706413,
    //     port: 8000,
    //     state: 2,
    //     os: 'mac',
    //     sharePort: 1,
    //     version: '0.0.1'
    // };
    // library.base.peeer.findOrCreate(peer);
};

privated.updatePeerList = function (err) {
    if(err){
    }
    library.base.peer.findAll((peers) => {
        async.eachLimit(peers, 1, function (item, cb) {
            var option = {
                uri: `http://${ip.fromLong(item.ip)}:${item.port}/rpc`,
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
                    JSON.parse(body).result.forEach((item) => {
                        if(item.state === 3) {
                            console.log('this peer state is 3');
                        } else {
                            library.base.peer.findOrCreate(item, (newPeer, created) => {
                                if(created) {
                                    console.log(`add new peer ip:${newPeer.ip} port:${newPeer.port} state:${newPeer.state}`);
                                } else {
                                    console.log('not add new peer')
                                }
                            });
                        }
                    });
                }
            }, cb());
        });
    });
};

// public methods
Peer.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

// Peer.prototype.removePeer = function (p_ip, p_port, cb) {
privated.removePeer = function (p_ip, p_port, cb) {
    debugger;
    var isWhiteList = library.config.peers.default.find(function (peer) {
        return peer.address == ip.fromLong(p_ip) && peer.port == p_port;
    });
    if(isWhiteList) {
        cb("Peer in white list");
    } else {
        library.base.peer.removePeer(p_ip, p_port, (count) => {
            cb(`remove count -> ${count}`);
        })
    }
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
    async.eachSeries(library.config.peers.default, (peer, cb) => {
        peer.version = library.config.version;
        peer.ip = ip.toLong(peer.address);
        library.base.peer.findOrCreate(peer, (newPeer, created) => {
            // if(err) {
            //     console.log('onBlockchainReady', err);
            // }
            if(created) {
                console.log(`add new peer ip:${newPeer.ip} port:${newPeer.port} state:${newPeer.state}`);
            } else {
                console.log('peer is not add new peer');
            }
        }, cb());
    }, (err) => {
        if(err) {
            console.log(err);
        }
        library.base.peer.getCount((err, res) => {
            if(res) {
                privated.updatePeerList(err);
            } else {
                console.log('peers list is empty');
            }
        });
    });
};

Peer.prototype.onPeerReady = function() {
    setImmediate(function updateNextPeerList() {
        privated.updatePeerList()
    })
};

Peer.prototype.onEnd = function (cb) {

    cb();
};

// shared
shared.peer_test = function (req, cb) {
    // cb(null, `aaa:${req.aaa}, bbb:${req.bbb}`);
    privated.removePeer(2130706433, 8000, (msg) => {
        cb(msg);
    })
};

//获取 某节点下的peers
shared.peer_get_peers = function (req, cb) {
    library.base.peer.findAll((listData) => {
        var data = [];
        listData.forEach(function (item) {
            data.push(item.dataValues);
        });
        cb(null, data);
    });
};

shared.peer_get_peer = function (req, cb) {
    var peer_ip = ip.toLong(req.address);
    var peer_port = parseInt(req.port);
    library.base.peer.findPeers(peer_ip, peer_port, (peer) => {
        // cb(peer);
        // console.log(peer);
        cb(null, peer || {});
    })
};

// export
module.exports = Peer;