// var request = require('request');
//
// var option = {
//     uri: 'http://127.0.0.1:8000/rpc',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({
//         method: "peer_get_peers",
//         params: {}
//     })
// };
//
// request(option, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(JSON.parse(body).result) // 打印google首页
//     }
// });
var ip = require('ip');
console.log(ip.fromLong(2130706433));
