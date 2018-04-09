var config = require('./tsconfig.json');
var expect = require('chai').expect;
var baseUrl =`http://${config.server.address}:${config.server.port}`;
var api = baseUrl + '/api';
var request = require('request');
var async = require('async');

function postHelper(url, params, cb) {
    var options = {
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: params
    };
    request(api + url, options, function (error, response, body) {
        cb(error, response, body);
    });
}

function postHeaderHelper(url, header, params, cb) {
    var options = {
        method: "POST",
        json: true,
        headers: header,
        body: params
    };
    request(api + url, options, function (error, response, body) {
        cb(error, response, body);
    });
}

function getHelper(url, params, headerParams, cb) {
    var options = {
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        qs: params
    };
    request(api + url, options, function (error, response, body) {
        cb(error, response, body);
    });
}

function putHelper(url, params, headerParams, cb) {
    var options = {
        method: "PUT",
        json: true,
        headers: headerParams,
        qs: params
    };
    request(api + url, options, function (error, response, body) {
        cb(error, response, body);
    });
}

function onNewBlock(cb) {
    getHeight(function (err, height) {
        console.log("Height: " + height);
        if (err) {
            return cb(err);
        } else {
            waitForNewBlock(height, cb);
        }
    });
}

// Function used to wait until a new block has been created
function waitForNewBlock(height, cb) {
    var actualHeight = height;
    async.doWhilst(
        function (cb) {
            request({
                type: "GET",
                url: baseUrl + "/api/blocks/getHeight",
                json: true
            }, function (err, resp, body) {
                if (err || resp.statusCode != 200) {
                    return cb(err || "Got incorrect status");
                }
                console.log('height1 -> ', height);
                if (height + 2 == body.height) {
                    console.log('body.height -> ', body.height);
                    height = body.height;
                }

                setTimeout(cb, 1000);
            });
        },
        function () {
            console.log('actualHeight -> ', actualHeight)
            return cb();
        },
        function (err) {
            if (err) {
                return setImmediate(cb, err);
            } else {
                return setImmediate(cb, null, height);
            }
        }
    )
}

function getHeight(cb) {
    request({
        type: "GET",
        url: baseUrl + "/api/blocks/getHeight",
        json: true
    }, function (err, resp, body) {
        if (err || resp.statusCode != 200) {
            return cb(err || "Status code is not 200 (getHeight)");
        } else {
            return cb(null, body.height);
        }
    })
}

function randomAccount() {
    var account = {
        'address': '',
        'publicKey': '',
        'password': '',
        'secondPassword': '',
        'delegateName' : '',
        'username':'',
        'balance': 0
    };

    account.password = randomPassword();
    account.secondPassword = randomPassword();
    account.delegateName = randomDelegateName();
    account.username =  randomUsername();

    return account;
}

function randomPassword(){
    return Math.random().toString(36).substring(7);
}

function randomDelegateName() {
    var size = randomNumber(1,20); // Min. delegate name size is 1, Max. delegate name is 20
    var delegateName = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&_.";

    for( var i=0; i < size; i++ )
        delegateName += possible.charAt(Math.floor(Math.random() * possible.length));

    return delegateName;
}

function randomUsername(){
    var size = randomNumber(1,16); // Min. username size is 1, Max. username size is 16
    var username = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$&_.";

    for( var i=0; i < size; i++ )
        username += possible.charAt(Math.floor(Math.random() * possible.length));

    return username;
}

// Returns a random number between min (inclusive) and max (exclusive)
function randomNumber(min, max) {
    return  Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
    postHelper: postHelper,
    postHeaderHelper: postHeaderHelper,
    getHelper: getHelper,
    putHelper: putHelper,
    expect: expect,
    randomAccount: randomAccount,
    config: config,
    peers_config: config.mocha.peers,
    onNewBlock: onNewBlock,
    ebook: require('./ebook')
};