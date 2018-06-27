var express = require('express');
var router = express.Router();
var config = require('../config.json');

var ip = require('ip');

function selectModule(apiType, scope) {
    switch (apiType) {
        case 'peer':
            return scope.modules.peer;

        case 'accounts':
            return scope.modules.accounts;

        case 'kernel':
            return scope.modules.kernel;

        case 'signatures':
            return scope.modules.signatures;

        default:
            return null;
    }
}

function checkHeaders(req, scope, cb) {
    if(req.body.api !== 'kernel') {
        return cb();
    }
    var peerIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (peerIp === "127.0.0.1" ) {
        return cb();
    }
    if (!peerIp) {
        return cb({success: false, error: "Wrong header data"});
    }
    req.sanitize(req.headers, {
        type: "object",
        properties: {
            port: {
                type: "string",
                minimum: 1,
                maximum: 65535
            },
            os: {
                type: "string",
                maxLength: 64
            },
            'share-port': {
                type: 'string',
                minimum: 0,
                maximum: 1
            },
            'version': {
                type: 'string',
                maxLength: 11
            }
        },
        required: ["port", 'share-port', 'version']
    }, function (err, report, headers) {
        if(err)
           return cb(err);
        if (!report.isValid)
            return cb({status: false, error: report.issues});
        let peer = {
            ip: ip.toLong(peerIp),
            port: headers.port,
            state: 2,
            os: headers.os,
            sharePort: Number(headers['share-port']),
            version: headers.version
        };
        if (peer.port > 0 && peer.port <= 65535 && peer.version === scope.config.version) {
            scope.modules.peer.update(peer);
        }
        cb();
    });
}

module.exports = function (scope) {

    scope.network.app.use('/', router);

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Entu ' + config.version });
    });

    /* POST requests. */
    router.post('/rpc', function (req, res, next) {
        let resHeaders = {
            os: scope.modules.system.getOS(),
            version: scope.modules.system.getVersion(),
            port: scope.modules.system.getPort(),
            'share-port': scope.modules.system.getSharePort()
        };
        var body = req.body;
        var jsonrpc = body.jsonrpc || '';
        let id = body.id || 0;
        if(id === 0 || jsonrpc === '') {
            return res.json({
                'error': 'missing id or jsonrpc',
                'code': 21000,
                'id': id,
                'jsonrpc': jsonrpc
            });
        }
        res.set(resHeaders);
        checkHeaders(req, scope, function (err) {
            if(err) {
                return res.json({
                    'error': err,
                    'code': 21000,
                    'id': id,
                    'jsonrpc': jsonrpc
                });
            }
            if (body.hasOwnProperty('api') && body.hasOwnProperty('method')) {
                let apiModules = selectModule(body['api'], scope);
                if(!apiModules) {
                    return res.json({
                        'result': null,
                        'code': 21000,
                        'id': id,
                        'jsonrpc': jsonrpc
                    });
                }
                apiModules.callApi(body['method'], jsonrpc, body['params'], function (message, code, data) {
                    return res.json({
                        'result': data,
                        'code': code,
                        'id': id,
                        'jsonrpc': jsonrpc
                    });
                });
            } else {
                return res.json({
                    'error': 'missing necessary params',
                    'code': 21000,
                    'id': id,
                    'jsonrpc': jsonrpc
                });
            }
        });
    });
};
