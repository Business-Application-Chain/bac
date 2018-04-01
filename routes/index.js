var express = require('express');
var router = express.Router();
var config = require('../config.json');
var peer = require('../src/modules/peer.js');

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
            peer.attachApi(body['method'], body['params'], body['id'])
                .then((data) => {
                    res.json({
                        'jsonrpc': body['jsonrpc'] || '1.0',
                        'id': body['id'] || 0,
                        'result': data
                    });
                })
                .catch(function(err) {
                    res.json({
                        'jsonrpc': body['jsonrpc'] || '1.0',
                        'id': body['id'] || 0,
                        'error': err.toString()
                    });
                });

        }
    }
});

module.exports = router;
