var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var ip = require('ip');
var request = require('request');
var _ = require('underscore');
var Sequelize = require('sequelize');
var bacLib = require('bac-lib');
// private objects
var modules_loaded, library, self, privated = {}, shared_1_0 = {}, peerIp = "";
const errorCode = require('../utils/error-code');

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
                self.getFromPeerNews(peer, options);
                setImmediate(cb);
            }, function () {
                cb && cb(null, {body: null, peer: peers});
            });
        } else {
            cb && setImmediate(cb, err);
        }
    });
};

Kernel.prototype.broadcastNew = function (config, options, cb) {
    config.limit = config.limit || 1;
    library.modules.peer.list(config, function (err, peers) {
        if (!err) {
            async.eachLimit(peers, 3, function (peer, cb) {
                self.getFromPeerNews(peer, options);
                setImmediate(cb);
            }, function () {
                cb && cb(null, {body: null, peer: peers});
            })
        } else {
            cb && setImmediate(cb, err);
        }
    });
};

Kernel.prototype.callApi = function (call, rpcjson, args, peerIp, cb) {
    var callArgs = [args, cb];
    // execute
    privated.peerIp = peerIp;
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
                self.getFromPeer(peer, options, cb);
            } else {
                return cb(err || "No peers in database");
            }
        });
    }, function (err, result) {
        cb(err, result);
    });
};

Kernel.prototype.getFromRandomPeerNews = function (config, options, cb) {
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
        return cb(err, result);
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
            id: 10
        },
        timeout: 10000,
        headers: _.extend({}, privated.headers, options.headers),
        pool: {maxSockets: 1000},
    };
    request(req, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            // library.log.Debug("Request", "Error", err);
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
            return cb && cb(err || ("Request status code " + response.statusCode));
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
        if (body.code !== 200) {
            return cb && cb(body.err, {error: body.error, code: body.code, peer: peer});
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
    request(req, function (err, response, body) {
        if (err || response.statusCode !== 200) {
            // library.log.Debug("Request", "Error", err);
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

Kernel.prototype.onNewBlock = function (block, broadcast) {
    if (broadcast) {
        self.broadcast({limit: 100}, {api: '/blocks', data: {block: block}, method: "POST"});
        library.socket.webSocket.send('201|blocks|block|' + JSON.stringify(block), null);
        let peerCount = library.modules.peer.getCount();
        library.socket.webSocket.send('201|kernel|status|' + JSON.stringify({
            height: block.height,
            peerHeight: block.height,
            peerCount: peerCount
        }), null);
    }
};

Kernel.prototype.onGetPeerInfo = function () {
    let block = library.modules.blocks.getLastBlock();
    let peerCount = library.modules.peer.getCount();
    library.socket.webSocket.send('201|kernel|status|' + JSON.stringify({
        height: block.height,
        peerHeight: block.height,
        peerCount: peerCount
    }), null);
};

Kernel.prototype.onBlockchainReady = function () {
    privated.loaded = true;
};

Kernel.prototype.onUnconfirmedTransaction = function (transaction, broadcast) {
    if (broadcast) {
        // self.broadcast({limit: 100}, {api: '/transactions', data: {transaction: transaction}, method: "POST"});
        transaction.asset = JSON.stringify(transaction.asset);
        self.broadcastNew({limit: 100}, {
            api: 'kernel',
            method: 'POST',
            func: 'addTransactions',
            data: {transaction: transaction},
            id: Math.random(),
            jsonrpc: '1.0'
        });
        library.socket.webSocket.send('201|transactions|transaction|' + JSON.stringify(transaction));
        // 通知前端，产生新的交易
    }
};

Kernel.prototype.onShouldSign = function (msg) {
    try {
        let accountPath = path.join(__dirname, '../../accountKey.json');
        fs.readFile(accountPath, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                let mnemonic = JSON.parse(data.toString()).mnemonic;
                let keyPair = library.base.account.getKeypair(mnemonic);
                let signs = bacLib.bacSign.sign(msg, keyPair.d.toBuffer(32), 1).toString('hex');
                let signMsg = {
                    msg: signs
                };
                library.socket.webSocket.send('201|kernel|shouldSign|' + JSON.stringify(signMsg));
            }
        });
    } catch (e) {
        let signMsg = {
            msg: "sign message error"
        };
        library.socket.webSocket.send('201|kernel|shouldSign|' + JSON.stringify(signMsg));
    }
};

Kernel.prototype.onShouldVerify = function (signMsg) {
    let signJson = JSON.parse(signMsg);
    let res = bacLib.bacSign.verify(signJson.msg, signJson.address, new Buffer.from(signJson.sign, 'hex'));
    let verifyRes = {
        res: res
    };
    library.socket.webSocket.send('201|kernel|shouldVerify|' + JSON.stringify(verifyRes));
};


shared_1_0.list = function (req, cb) {
    library.modules.peer.list({limit: 100}, function (err, peers) {
        if (err) {
            return cb(err, errorCode.kernel.GET_PEER_LIST_FAILURE);
        } else {
            return cb(null, 200, peers);
        }
    });
};

shared_1_0.height = function (req, cb) {
    let blockHeight = library.modules.blocks.getLastBlock().height;
    cb(null, 200, blockHeight);
};

shared_1_0.getBlockHeight = function (req, cb) {
    library.dbClient.query('SELECT * FROM blocks WHERE hash = $hash', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            hash: req[0]
        }
    }).then((rows) => {
        if(rows && rows[0]) {
            return cb(null, 200, rows[0].height);
        }
        else {
            return cb("not find blocks", errorCode.blocks.NOT_FIND_BLOCK);
        }
    }).catch(err => {
        console.log(err);
        return cb(err, errorCode.server.SERVER_ERROR);
    });
};

shared_1_0.addBlocks = function(params, cb) {
    library.dbClient.query('SELECT * FROM miner_ip WHERE ip=$ip', {
        type: Sequelize.QueryTypes.SELECT,
        bind: {
            ip: ip.toLong(peerIp)
        }
    }).then(rows => {
        return rows[0];
    }).then(row => {
        if(!row) {
            return cb(null, 200);
        } else {
            let newBlock = JSON.parse(params);
            let lastBlock = library.modules.blocks.getLastBlock();
            if(lastBlock.height < newBlock) {
                library.notification_center.notify('hasNewBlock', newBlock);
            }
            setImmediate(cb, null, 200);
        }
    });
};

shared_1_0.blocks = function (params, cb) {
    let lastBlockHash = params[0] || undefined;
    if (!lastBlockHash) {
        return cb('missing params', errorCode.server.MISSING_PARAMS);
    }
    let blocksLimit = 300;
    library.modules.blocks.loadBlocksData({
        limit: blocksLimit,
        lastBlockHash: lastBlockHash
    }, {
        plain: false
    }, function (err, data) {
        if (err) {
            return cb(err, errorCode.kernel.GET_BLOCKS_FAILURE);
        }
        return cb(null, 200, data);
    });
};

shared_1_0.lastBlockHash = function (req, cb) {
    return cb(null, 200, library.modules.blocks.getLastBlock().hash);
};


shared_1_0.blocks_common = function (params, cb) {
    let reqParams = JSON.parse(params);
    let max = reqParams.max || 0;
    let min = reqParams.min || 0;
    let ids = reqParams.ids || '';
    if (max === 0 || min === 0 || ids === '') {
        return cb('params is error', errorCode.server.MISSING_PARAMS);
    }
    ids = ids.split(',');
    let escapedIds = ids.map(function (id) {
        return "'" + id + "'";
    });
    let sql = `SELECT height, hash, previousBlock, timestamp from blocks where hash in ( ${escapedIds.join(",")} ) and height >= ${min} and height <= ${max} ORDER BY height DESC LIMIT 1`;
    library.dbClient.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
    }).then((rows) => {
        var commonBlock = rows.length ? rows[0] : null;
        // return cb(null, 200, JSON.stringify({commonBlock: commonBlock}));
        return cb(null, 200, commonBlock);
    }).catch((err) => {
        console.log(err);
        cb(err, errorCode.server.SERVER_ERROR);
    });
};

shared_1_0.getTransactions = function (req, cb) {
    return cb(null, 200, {transactions: library.modules.transactions.getUnconfirmedTransactionList()});
};

shared_1_0.addTransactions = function (params, cb) {
    if(typeof params.transaction.asset === "string")
        params.transaction.asset = JSON.parse(params.transaction.asset);
    try {
        var transaction = library.base.transaction.objectNormalize(params.transaction);
    } catch (e) {
        console.log("addTransactions is catch")
        console.log(e);
        return cb("Invalid transaction body", errorCode.kernel.INVALID_TRANSACTION_BODY);
    }
    library.balancesSequence.add(function (cb) {
        library.modules.transactions.receiveTransactions([transaction], cb);
    }, function (err) {
        if (err) {
            // console.log(err);
            return cb(err, errorCode.kernel.ADD_TRANSACTION_FAILURE);
        } else {
            return cb(null, 200, "success");
        }
    });

};

shared_1_0.version = function (params, cb) {
    let version = library.modules.system.getVersion();
    cb(null, 200, version);
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
        library.log.Debug('Received transaction ' + (transaction ? transaction.hash : 'null') + ' is not valid, ban 60 min', peerStr);

        if (peerIp && report) {
            library.modules.peer.state(ip.toLong(peerIp), req.headers.port, 0, 3600);
        }
        return cb("Invalid transaction body", errorCode.kernel.INVALID_TRANSACTION_BODY);
    }

    library.balancesWorkQueue.add(function (cb) {
        library.modules.transactions.receiveTransactions([transaction], cb);
    }, function (err) {
        if (err) {
            return cb(null, errorCode.kernel.GET_TRANSACTION_LIST_FAILURE);

        } else {
            return cb(null, 200, "SUCCESS");
        }
    });
};

shared_1_0.getUnconfirmedTransactions = function (req, cb) {
    let unTransactions = library.modules.transactions.getUnconfirmedTransactionList();
    let data = {
        unconfirmedTransactions: unTransactions
    };
    return cb(null, 200, data);
};

// export
module.exports = Kernel;