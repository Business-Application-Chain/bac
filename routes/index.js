var express = require('express');
var router = express.Router();
var config = require('../config.json');

module.exports = function (scope) {

    scope.network.app.use('/', router);

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Entu ' + config.version });
    });

    /* POST requests. */
    router.post('/rpc', function (req, res, next) {
        var body = req.body;
        if (body.hasOwnProperty('method') && body.hasOwnProperty('params')) {

            // distinguish router by name keywords
            if (body.method.substring(0, 4) == 'peer') {
                scope.modules.peer.callApi(body['method'], body['params'], function (err, data) {
                    if (err) {
                        return res.json({
                            'jsonrpc': body['jsonrpc'] || '1.0',
                            'id': body['id'] || 0,
                            'result': null,
                            'error': err.toString()
                        });
                    }

                    return res.json({
                        'jsonrpc': body['jsonrpc'] || '1.0',
                        'id': body['id'] || 0,
                        'result': data,
                        'error': null
                    });
                });

            } else {

            }
        }
    });
};
