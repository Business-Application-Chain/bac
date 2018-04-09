request = require('request');
var config = require('./tsconfig.json');
var baseUrl =`http://${config.server.address}:${config.server.port}`;
var api = baseUrl + '/api';

var params = {'address': '6202245275956910442L'};


var options = {
    method: "GET",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    qs: params
};
// console.log(options);
request(api + '/accounts/getBalance', options, function (error, response, body) {
    // cb(error, response, body);
    console.log(body);
});