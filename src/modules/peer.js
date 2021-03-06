var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var Sequelize = require('sequelize');
var request = require('request');
var errorCode = require('../utils/error-code');

require('array.prototype.find'); // Old node fix

// private objects
var modules_loaded, library, self, privated = {}, shared = {}, shared_1_0 = {}, peerCount;

// constructor
function Peer(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// private methods
privated.updatePeerList = function (cb) {
    library.modules.kernel.getFromRandomPeerNews({
        api:'kernel',
        method:'POST',
        func:'list',
        data:'[]',
        jsonrpc: '1.0',
        id: Math.random()
    }, function (err, data) {
        if (err) {
            return cb();
        }
        let peers = data.result || [];
        if(!peers) {
            return cb();
        }
        async.eachLimit(peers, 2, function (peer, cb) {
            library.schema.validate(peer, {
                type: 'object',
                properties: {
                    ip: {
                        type: 'integer'
                    },
                    port: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 65535
                    },
                    state: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 3
                    },
                    os: {
                        type: 'string'
                    },
                    sharePort: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 1
                    },
                    version: {
                        type: 'string'
                    }
                },
                required: ['ip', 'port', 'state']
            }, function (err) {
                if (err) {
                    return setImmediate(cb, "Invalid peer: " + err.toString());
                }
                peer.ip = parseInt(peer.ip);
                if (isNaN(peer.ip)) {
                    return setImmediate(cb);
                }
                if (ip.toLong("127.0.0.1") === peer.ip || peer.port === 0 || peer.port > 65535) {
                    return setImmediate(cb);
                }
                self.update(peer, cb);
            });
        }, cb);
    });
};

privated.count = function (cb) {
    library.dbClient.query('SELECT COUNT(*) AS count FROM peers', {
        type: Sequelize.QueryTypes.SELECT
    }).then(function (rows) {
        var res = rows.length && rows[0];
        privated.peerCount = res.count;
        cb(null, res.count);
    }, function (err) {
        cb(err, undefined);
    });
};


privated.list = function(options, cb) {
    let limit = options.limit || 100;
    library.dbClient.query(`SELECT * FROM peers WHERE state > 0 and sharePort = 1 ORDER BY rand() LIMIT ${limit}`, {
        type: Sequelize.QueryTypes.SELECT
    }).then((rows) => {
        cb(null, rows);
    }).catch((err) => {
        cb(err);
    })
};

privated.banManager = function (cb) {
    library.dbClient.query("UPDATE peers SET state = 1, clock = null WHERE (state = 0 and clock - $now < 0)", {
        type: Sequelize.QueryTypes.UPDATE,
        bind: {
            now: Date.now()
        }
    }).then(function (data) {
        cb(null, "update successed");
    }, function (err) {
        cb(err, undefined);
    });
};

privated.getByFilter = function (filter, cb) {
};

Peer.prototype.getCount = function() {
    return privated.peerCount;
};

// public methods
Peer.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Peer.prototype.callApi = function (call, rpcjson, args, peerIp, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};


Peer.prototype.state = function (pip, port, state, timeout) {
    var exist = library.config.peers.list.find(function (peer) {
        return peer.ip == ip.fromLong(pip) && peer.port == port;
    });
    if (exist != undefined)
        return;
    if (state == 0) {
        var clock = (timeout || 1) * 1000;
        clock = Date.now() + clock;
    } else {
        clock = null;
    }
    library.dbClient.query(`UPDATE peers SET state = $state, clock = $clock WHERE ip = $pip AND port = $port`, {
        type: Sequelize.QueryTypes.UPDATE,
        bind: {
            state: state,
            clock: clock,
            pip: pip,
            port: port
        }
    }).then(function () {
        // console.log("update success");
        library.log.Debug("update peers success");
    }).catch(err => {
        // console.log("update ip status error");
        library.log.Error("update ip status error");
    })
};

Peer.prototype.remove = function (pip, port, cb) {
    var exist = library.config.peers.list.find(function (peer) {
        return peer.ip == ip.fromLong(pip) && peer.port == port;
    });
    if (exist != undefined) return cb && cb("Peer in config peer list");
    library.dbClient.query("DELETE peers WHERE ip = $ip AND port = $port", {
        type: Sequelize.QueryTypes.DELETE,
        bind: {
            ip: pip,
            port: port
        }
    }).then(function (data) {
        cb(null, "delete successed");
    }, function (err) {
        cb(err, undefined);
    });
};

Peer.prototype.addDapp = function (config, cb) {
    library.dbClient.query("SELECT id FROM peers WHERE ip = $ip AND port = $port", {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            ip: ip,
            port: port
        }
    }).then(function (rows) {
        if (!rows.length) {
            cb(null);
        }
        var peerId = rows[0].id;
        library.dbClient.query("INSERT IGNORE INTO peers_dapp (peerId, dappId) VALUES ($peerId, $dappId)", {
            type: Sequelize.QueryTypes.INSERT,
            bind: {
                peerId: peerId,
                $dappId: config.dappId
            }
        }).then(function (data) {
            cb(null, "add dapp successed");
        }, function (err) {
            cb(err, undefined);
        });
    }, function (err) {
        cb(err, undefined);
    });
};

Peer.prototype.list = function (options, cb) {
    options.limit = options.limit || 100;

    library.dbClient.query("select p.ip, p.port, p.state, p.os, p.sharePort, p.version from peers p  where p.state > 0 and p.sharePort = 1 ORDER BY rand()" , {
        type: Sequelize.QueryTypes.SELECT
    }).then(function (data) {
        cb(null, data);
    });
    // cb(null, []);
};

Peer.prototype.update = function (peer, cb) {
    var dappId = peer.dappId;
    var options = {
        ip: peer.ip,
        port: peer.port,
        os: peer.os || null,
        sharePort: peer.sharePort,
        version: peer.version || null
    };
    async.series([
        function (cb) {
            library.dbClient.query("INSERT IGNORE INTO peers (ip, port, state, os, sharePort, version) VALUES ($ip, $port, $state, $os, $sharePort, $version)", {
                type: Sequelize.QueryTypes.INSERT,
                bind: {
                    ip: options.ip,
                    port: options.port,
                    state: 1,
                    os: options.os,
                    sharePort: options.sharePort,
                    version: options.version
                }
            }).then(function (data) {
                cb();
            }, function (err) {
                library.log.Error("Peer#update", "Error", err.toString());
                cb();
            });
        },
        function (cb) {
            if (peer.state !== undefined) {
                options.state = peer.state;
            }
            library.dbClient.query("UPDATE peers SET os = $os, sharePort = $sharePort, version = $version" + (peer.state !== undefined ? ", state = CASE WHEN state = 0 THEN state ELSE $state END " : "") + " WHERE ip = $ip AND port = $port", {
                type: Sequelize.QueryTypes.UPDATE,
                bind: options
            }).then(function (data) {
                cb();
            }, function (err) {
                library.log.Error("Peer#update", "Error", err.toString());
                cb();
            });
        },
        function (cb) {
            if (dappId) {
                self.addDapp({dappId: dappId, ip: peer.ip, port: peer.port}, cb);
            } else {
                setImmediate(cb);
            }
        }
    ], function (err) {
        err && library.log.Error("Peer#update", "Error", err.toString());

        cb && cb();
    })
};

// events
Peer.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

Peer.prototype.onBlockchainReady = function () {
    async.eachSeries(library.config.peers.list, (peer, cb) => {
        library.dbClient.query("INSERT IGNORE INTO peers (ip, port, state, sharePort) VALUES ($ip, $port, $state, $sharePort)", {
            bind: {
                ip: ip.toLong(peer.ip),
                port: peer.port,
                state: 2, // default is 2, means health peer
                sharePort: Number(true)
            },
            type:Sequelize.QueryTypes.INSERT
        }).then((data) => {
            cb();
        }).catch((err) => {
            library.log.Error("Peer onBlockchainReady", "Error", err.toString());
            cb();
        });
    }, (err) => {
        if (err) {
            library.log.Error("Peer onBlockchainReady", "Error", err.toString());
        }

        privated.count((err, count) => {
            if (count) {
                privated.updatePeerList(function (err) {
                    err && library.log.Error("updatePeerList", "Error", err.toString());
                    library.notification_center.notify('peerReady');
                });
                library.log.Info("Peer onBlockchainReady", "stored", count);

                let status = {
                    status: "blockchainReady"
                };
                let msg = '201|loader|start|' + JSON.stringify(status);

                library.socket.webSocket.send(msg);
            } else {
                library.log.Info("Peer onBlockchainReady list is empty");
            }
        });
    });
};

Peer.prototype.onPeerReady = function () {
    setImmediate(function nextUpdatePeerList() {
        privated.updatePeerList(function (err) {
            err && library.log.Error("updatePeerList timer", "Error", err.toString());
            setTimeout(nextUpdatePeerList, 60 * 1000);
        });
    });

    setImmediate(function nextBanManager() {
        privated.banManager(function (err) {
            err && library.log.Error("banManager timer", "Error", err.toString());
            setTimeout(nextBanManager, 65 * 1000);
        });
    });
};

Peer.prototype.onEnd = function (cb) {
    cb();
};

// shared
shared_1_0.list = function(req, cb) {
    privated.list({limit: 100}, function (err, list) {
        if(err) {
            return cb(err, errorCode.peer.GET_PEER_FAILURE);
        }
        console.log(list);
        return cb(null, errorCode.server.SUCCESS, list);
    });
};

shared_1_0.count = function(req, cb) {
    privated.count(function (err, count) {
        if(err) {
          return cb(err, errorCode.peer.GET_COUNT_ERR);
        }
        return cb(null, errorCode.server.SUCCESS, count);
    });
};

shared_1_0.version = function(req, cb) {
    return cb(null, errorCode.server.SUCCESS, library.config.version);
};

// export
module.exports = Peer;