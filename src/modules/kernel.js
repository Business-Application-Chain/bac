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

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

privated.headers = {};
privated.loaded = false;
privated.messages = {};

// constructor
function Kernel(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.attachApi();

    setImmediate(cb, null, self);
}

// private methods
privated.attachApi = function () {
    library.network.app.use(function(req, res, next) {
        if (modules_loaded) return next();
        res.status(500).send({success: false, error: "Blockchain is loading"});
    });

    router.use(function (req, res, next) {
        var peerIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (peerIp == "127.0.0.1") {
            return next();
        }

        if (!peerIp) {
            return res.status(500).send({success: false, error: "Wrong header data"});
        }

        req.headers.port = parseInt(req.headers.port);
        req.headers['share-port'] = parseInt(req.headers['share-port']);

        req.sanitize(req.headers, {
            type: 'object',
            properties: {
                'port': {
                    type: 'integer',
                    minimum: 1,
                    maximum: 65535
                },
                'os': {
                    type: 'string',
                    maxLength: 64
                },
                'share-port': {
                    type: 'integer',
                    minimum: 0,
                    maximum: 1
                },
                'version': {
                    type: 'string',
                    maxLength: 11
                }
            },
            required: ['port', 'share-port', 'version']
        }, function (err, report, headers) {
            if (err) {
                console.log(err.toString());
                return next(err);
            }
            if (!report.isValid) {
                return res.status(500).send({status: false, error: report});
            }

            var peer = {
                ip: ip.toLong(peerIp),
                port: headers.port,
                state: 2,
                os: headers.os,
                sharePort: Number(headers['share-port']),
                version: headers.version
            };

            if (req.body && req.body.dappId) {
                peer.dappId = req.body.dappId;
            }

            if (peer.port > 0 && peer.port <= 65535 && peer.version == library.config.version) {
                library.modules.peer.update(peer);
            }

            next();
        });
    });


    library.network.app.use('/peer', router);

    /* GET home page. */
    router.get('/list', function(req, res, next) {
        res.set(privated.headers);
        library.modules.peer.list({limit: 100}, function (err, peers) {
            return res.status(200).json({peers: !err ? peers : []});
        });
    });

    router.use(function (req, res, next) {
        res.status(500).send({success: false, error: "API endpoint not found"});
    });

    library.network.app.use(function (err, req, res, next) {
        if (!err) return next();
        library.logger.error(req.url, err.toString());
        res.status(500).send({success: false, error: err.toString()});
    });
};

// public methods
Kernel.prototype.sandboxApi = function (call, args, cb) {
    sandboxHelper.callMethod(shared, call, args, cb);
};

Kernel.prototype.callApi = function (call, args, cb) {
    var callArgs = [args, cb];
    // execute
    shared[call].apply(null, callArgs);
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
                self.getFromPeer(peer, options, cb);
            } else {
                return cb(err || "No peers in database");
            }
        });
    }, function (err, result) {
        cb(err, result);
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
        timeout: library.config.peers.optional.timeout
    };
    if (Object.prototype.toString.call(options.data) === '[object Object]' || util.isArray(options.data)) {
        req.json = options.data;
    } else {
        req.body = options.data;
    }

    return request(req, function (err, response, body) {
        if (err || response.statusCode != 200) {
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

};

// export
module.exports = Kernel;