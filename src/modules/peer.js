var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var Sequelize = require('sequelize');
var request = require('request');

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
privated.updatePeerList = function (cb) {
    library.modules.kernel.getFromRandomPeer({
        api: '/list',
        method: 'GET'
    }, function (err, data) {
        if (err) {
            return cb();
        }

        library.schema.validate(data.body, {
            type: 'object',
            properties: {
                peers: {
                    type: 'array',
                    uniqueItems: true
                }
            },
            required: ['peers']
        }, function (err) {
            if (err) {
                return cb();
            }

            var peers = data.body.peers;

            async.eachLimit(peers, 2, function (peer, cb) {
                library.schema.validate(peer, {
                    type: 'object',
                    properties: {
                        ip: {
                            type: 'string'
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
    });
};

privated.count = function (cb) {
    library.dbClient.query('SELECT COUNT(*) AS count FROM peers', {
        type: Sequelize.QueryTypes.SELECT
    }).then(function (rows) {
        var res = rows.length && rows[0];
        cb(null, res.count);
    }, function (err) {
        cb(err, undefined);
    });
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

// public methods
Peer.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Peer.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
};

Peer.prototype.list = function (options, cb) {
    options.limit = options.limit || 100;

    var sql = "SELECT p.ip, p.port, p.state, p.os, p.sharePort, p.version FROM peers p " + (options.dappId ? " INNER JOIN peers_dapp pd on p.id = pd.peerId and pd.dappId = $dappId" : "") + " WHERE p.state > 0 AND p.sharePort = 1 ORDER BY RAND() LIMIT $limit";

    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        bind: options
    }).then(function (rows) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            row.ip = String(row.ip);
            row.port = Number(row.port);
            row.state = Number(row.state);
            row.os = String(row.os);
            row.sharePort = Number(row.sharePort);
            row.version = String(row.version);
        }
        cb(null, rows);
    }, function (err) {
        cb(err, undefined);
    });
};

Peer.prototype.state = function (pip, port, state, timeout, cb) {
    var exist = library.config.peers.list.find(function (peer) {
        return peer.ip == ip.fromLong(pip) && peer.port == port;
    });
    if (exist != undefined) return cb && cb("Peer in config peer list");
    if (state == 0) {
        var clock = (timeout || 1) * 1000;
        clock = Date.now() + clock;
    } else {
        clock = null;
    }
    library.dbClient.query("UPDATE peers SET state = $state, clock = $clock WHERE ip = $ip AND port = $port", {
        type: Sequelize.QueryTypes.UPDATE,
        bind: {
            state: state,
            clock: clock,
            ip: pip,
            port: port
        }
    }).then(function (data) {
        cb(null, "update successed");
    }, function (err) {
        cb(err, undefined);
    });
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
            type: Sequelize.QueryTypes.DELETE,
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
                type: Sequelize.QueryTypes.DELETE,
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
            }
        }).then((data) => {
            cb();
        }, (err) => {
            library.log.Error("Peer onBlockchainReady", "Error", err.toString());
            cb();
        });
    }, (err) => {
        if(err) {
            library.log.Error("Peer onBlockchainReady", "Error", err.toString());
        }

        privated.count((err, count) => {
            if (count) {
                privated.updatePeerList((err) => {
                    err && library.log.Error("updatePeerList", "Error", err.toString());
                    library.notification_center.notify('peerReady');
                });
                library.log.Info("Peer onBlockchainReady", "stored", count);
            } else {
                library.log.Info("Peer onBlockchainReady list is empty");
            }
        });
    });
};

Peer.prototype.onPeerReady = function() {
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
shared.peer_getPeers = function (req, cb) {

};

shared.peer_getPeer = function (req, cb) {

};

shared.peer_getVersion = function (req, cb) {

};

shared.peer_list = function (req, cb) {
    console.log(req);
};

// export
module.exports = Peer;