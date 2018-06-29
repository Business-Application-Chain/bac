var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var request = require('request');
var _ = require('underscore');
var zlib = require('zlib');
var crypto = require('crypto');
var bignum = require('../utils/bignum.js');
var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');

// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {};

privated.headers = {};
privated.loaded = false;
privated.messages = {};

// constructor
function Kernel(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;

    setImmediate(cb, null, self);
}

// public methods
Kernel.prototype.sandboxApi = function (call, jsonrpc, args, cb) {
    if (jsonrpc === '1.0') {
        sandboxHelper.callMethod(shared_1_0, call, args, cb);
    } else {
        sandboxHelper.callMethod(shared_1_0, call, args, cb);
    }
};

Kernel.prototype.broadcast = function (config, options, cb) {
    config.limit = config.limit || 1;
    library.modules.peer.list(config, function (err, peers) {
        if (!err) {
            async.eachLimit(peers, 3, function (peer, cb) {
                self.getFromPeer(peer, options);

                setImmediate(cb);
            }, function () {
                cb && cb(null, {body: null, peer: peers});
            })
        } else {
            cb && setImmediate(cb, err);
        }
    });
};

Kernel.prototype.callApi = function (call, rpcjson, args, cb) {
    var callArgs = [args, cb];
    // execute
    if (rpcjson === '1.0') {
        shared_1_0[call].apply(null, callArgs);
    } else {
        shared_1_0[call].apply(null, callArgs);
    }
};

Kernel.prototype.getFromRandomPeer = function (config, options, cb) {
    if (typeof options == 'function') {
        cb = options;
        options = config;
        config = {};
    }
    config.limit = 1;
    async.retry(20, function (cb) {
        library.modules.peer.list(config, function (err, peers) {
            if (!err && peers.length) {
                var peer = peers[0];
                self.getFromPeerNews(peer, options, cb);
            } else {
                return cb(err || "No peers in database");
            }
        });
    }, function (err, result) {
        cb(err, result);
    });
};

Kernel.prototype.getFromPeerNews = function (peer, options, cb) {
    var req = {
        url: 'http://' + ip.fromLong(peer.ip) + ':' + peer.port + '/rpc',
        method: options.method,
        json: true,
        body: {
            api: options.api,
            method: options.func,
            params: options.data,
            jsonrpc: options.jsonrpc,
            id: options.id
        },
        headers: _.extend({}, privated.headers, options.headers),
        timeout: library.config.peers.optional.timeout,
        pool: {maxSockets: 1000},
    };
    return request(req, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            library.log.Debug("Request", "Error", err);

            if (peer) {
                if (err && (err.code == 'ETIMEOUT' || err.code == 'ESOCKETTIMEOUT' || err.code == 'ECONNREFUSED')) {
                    library.modules.peer.remove(peer.ip, peer.port, function (err) {
                        if (!err) {
                            library.log.Info("Removing peer", "ip", peer.ip, "port", peer.port);
                        }
                    });
                } else {
                    if (!options.no_ban) {
                        library.modules.peer.state(peer.ip, peer.port, 0, 600, function (err) {
                            if (!err) {
                                library.log.Info("Ban peer for 10 minutes", "ip", peer.ip, "port", peer.port);
                            }
                        });
                    }
                }
            }

            cb && cb(err || ("Request status code " + response.statusCode));
            return;
        }

        response.headers.port = parseInt(response.headers.port);
        response.headers['share-port'] = parseInt(response.headers['share-port']);

        var report = library.schema.validate(response.headers, {
            type: 'object',
            properties: {
                'version': {
                    type: 'string',
                    maxLength: 11
                },
                'os': {
                    type: 'string',
                    maxLength: 64
                },
                'port': {
                    type: 'integer',
                    minimum: 1,
                    maximum: 65535
                },
                'share-port': {
                    type: 'integer',
                    minimum: 0,
                    maximum: 1
                }
            },
            required: ['port', 'share-port', 'version']
        });
        if (!report) {
            return cb && cb(null, {body: body, peer: peer});
        }

        var port = response.headers.port;
        if (port > 0 && port < 65535 && response.headers['version'] == library.config.version) {
            library.modules.peer.update({
                ip: peer.ip,
                port: port,
                state: 2,
                os: response.headers['os'],
                sharePort: Number(!!response.headers['share-port']),
                version: response.headers['version']
            });
        }
        if(body.code !== 200) {
            return cb(body.err, {error: body.error, code: body.code, peer: peer});
        }

        return cb && cb(null, {result: body.result, code: body.code, peer: peer});
    });

};

Kernel.prototype.getFromPeer = function (peer, options, cb) {
    var url = '';
    if (options.api) {
        url = '/peer' + options.api;
    } else {
        url = options.url;
    }
    var req = {
        url: 'http://' + ip.fromLong(peer.ip) + ':' + peer.port + url,
        method: options.method,
        json: true,
        headers: _.extend({}, privated.headers, options.headers),
        timeout: library.config.peers.optional.timeout,
        pool: {maxSockets: 1000},
    };
    if (Object.prototype.toString.call(options.data) === '[object Object]' || util.isArray(options.data)) {
        req.json = options.data;
    } else {
        req.body = options.data;
    }
    return request(req, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            library.log.Debug("Request", "Error", err);

            if (peer) {
                if (err && (err.code == 'ETIMEOUT' || err.code == 'ESOCKETTIMEOUT' || err.code == 'ECONNREFUSED')) {
                    library.modules.peer.remove(peer.ip, peer.port, function (err) {
                        if (!err) {
                            library.log.Info("Removing peer", "ip", peer.ip, "port", peer.port);
                        }
                    });
                } else {
                    if (!options.no_ban) {
                        library.modules.peer.state(peer.ip, peer.port, 0, 600, function (err) {
                            if (!err) {
                                library.log.Info("Ban peer for 10 minutes", "ip", peer.ip, "port", peer.port);
                            }
                        });
                    }
                }
            }

            cb && cb(err || ("Request status code " + response.statusCode));
            return;
        }

        response.headers.port = parseInt(response.headers.port);
        response.headers['share-port'] = parseInt(response.headers['share-port']);

        var report = library.schema.validate(response.headers, {
            type: 'object',
            properties: {
                'version': {
                    type: 'string',
                    maxLength: 11
                },
                'os': {
                    type: 'string',
                    maxLength: 64
                },
                'port': {
                    type: 'integer',
                    minimum: 1,
                    maximum: 65535
                },
                'share-port': {
                    type: 'integer',
                    minimum: 0,
                    maximum: 1
                }
            },
            required: ['port', 'share-port', 'version']
        });

        if (!report) {
            return cb && cb(null, {body: body, peer: peer});
        }

        var port = response.headers.port;
        if (port > 0 && port < 65535 && response.headers['version'] == library.config.version) {
            library.modules.peer.update({
                ip: peer.ip,
                port: port,
                state: 2,
                os: response.headers['os'],
                sharePort: Number(!!response.headers['share-port']),
                version: response.headers['version']
            });
        }

        return cb && cb(null, {body: body, peer: peer});
    });
};

// events
Kernel.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;

    privated.headers = {
        'version': scope.system.getVersion(),
        'os': scope.system.getOS(),
        'port': scope.system.getPort(),
        'share-port': scope.system.getSharePort()
    }
};

Kernel.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Kernel.prototype.onUnconfirmedTransaction = function (transaction, broadcast) {
    if (broadcast) {
        self.broadcast({limit: 100}, {api: '/transactions', data: {transaction: transaction}, method: "POST"});
    }
};

shared_1_0.test = function (params, cb) {
    let p = [];
    params = params.slice(1, params.length - 1);
    p = params.split(',');
    return cb(null, 200, '1.0 success params1 -> ' + p[0] + ';params2 -> ' + p[1]);
};


shared_1_0.list = function (req, cb) {
    library.modules.peer.list({limit: 100}, function (err, peers) {
        if(err) {
            return cb(err, 21000);
        } else {
           return cb(null, 200, peers);
        }

    });
};

shared_1_0.height = function (req, cb) {
    let blockHeight = library.modules.blocks.getLastBlock().height;
    cb(null, 200, blockHeight);
};

shared_1_0.blocks = function (params, cb) {
    let p = [];
    params = params.slice(1, params.length - 1);
    p = params.split(',');
    let lastBlockId = p[0] || 0;
    if (lastBlockId === 0) {
        return cb('lastBlockId is not 0', 21000);
    }
    let blocksLimit = 1440;
    library.modules.blocks.loadBlocksData({
        limit: blocksLimit, lastId: lastBlockId
    }, {
        plain: false
    }, function (err, data) {
        console.log('blocks blocks blocks');
        if (err) {
            return cb(err, 21000);
        }
        // return cb(null, 200, JSON.stringify({blocks: data}));
        return cb(null, 200, data);
    });
};

shared_1_0.blocks_common = function (params, cb) {
    let reqParams = JSON.parse(params);
    let max = reqParams.max || 0;
    let min = reqParams.min || 0;
    let ids = reqParams.ids || '';
    if (max === 0 || min === 0 || ids === '') {
        return cb('params is error');
    }
    ids = ids.split(',').filter(function (id) {
        return /^\d+$/.test(id);
    });
    let escapedIds = ids.map(function (id) {
        return "'" + id + "'";
    });
    library.dbClient.query(`SELECT height, id, previousBlock, timestamp from blocks where id in ( ${escapedIds.join(',')} ) and height >= ${min} and height <= ${max} ORDER BY height DESC LIMIT 1`, {
        type: Sequelize.QueryTypes.SELECT,
    }).then((rows) => {
        var commonBlock = rows.length ? rows[0] : null;
        // return cb(null, 200, JSON.stringify({commonBlock: commonBlock}));
        return cb(null, 200, commonBlock);
    }).catch((err) => {
        console.log(err);
        cb(err, 21000);
    });
};

shared_1_0.transactions = function (req, cb) {
    var report = library.schema.validate(req.headers, {
        type: "object",
        properties: {
            port: {
                type: "integer",
                minimum: 1,
                maximum: 65535
            }
        },
        required: ['port']
    });
    var transaction;
    try {
        transaction = library.base.transaction.objectNormalize(req.body.transaction);
    } catch (e) {
        var peerIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var peerStr = peerIp ? peerIp + ":" + (isNaN(req.headers.port) ? 'unknown' : req.headers.port) : 'unknown';
        library.log.Debug('Received transaction ' + (transaction ? transaction.id : 'null') + ' is not valid, ban 60 min', peerStr);

        if (peerIp && report) {
            library.modules.peer.state(ip.toLong(peerIp), req.headers.port, 0, 3600);
        }
        return cb("Invalid transaction body", 21000);
    }

    library.balancesWorkQueue.add(function (cb) {
        library.modules.transactions.receiveTransactions([transaction], cb);
    }, function (err) {
        if (err) {
            return cb(null, 500);

        } else {
            return cb(null, 200, "SUCCESS");
        }
    });
};

// export
module.exports = Kernel;