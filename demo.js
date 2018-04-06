// var request = require('request');
// //
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
// var ip = require('ip');
// console.log(ip.fromLong(2130706433));

// var jsonSql = require('./src/json-sql')({dialect: 'mysql'});
// "CREATE TABLE IF NOT EXISTS peers (id INTEGER NOT NULL PRIMARY KEY, ip INTEGER NOT NULL, port TINYINT NOT NULL, state TINYINT NOT NULL, os VARCHAR(64), sharePort TINYINT NOT NULL, version VARCHAR(11), clock INT)",
// create table if not exists `peers`(`id` int NOT NULL PRIMARY KEY,`ip` bigint NOT NULL,`port` int NOT NULL,`state` tinyint(1),`os` varchar(21) NOT NULL,`version` varchar(21) NOT NULL,`clock` int);
// this.model = [{
//     name: 'id',
//     type: 'Number',
//     primary_key: true,
//     filter: {
//         type: 'integer'
//     },
//     not_null: true
// }, {
//     name: 'ip',
//     type: 'BigInt',
//     filter: {
//         type: 'integer'
//     },
//     not_null: true
// }, {
//     name: 'port',
//     type: 'Number',
//     filter: {
//         type: 'integer'
//     },
//     not_null: true
// },{
//     name: 'state',
//     type: 'Boolean',
//     default_value: 0,
//     filter: {
//         type: 'boolean'
//     },
//     cnot_null: true
// },{
//     name: 'os',
//     type: 'String',
//     length: 21,
//     filter: {
//         type: 'string',
//         maxLength: 21,
//         minLength: 1
//     },
//     not_null: true
// },{
//     name: 'version',
//     type: 'String',
//     length: 21,
//     filter: {
//         type: 'string',
//         maxLength: 21,
//         minLength: 1
//     },
//     not_null: true
// },{
//     name: 'clock',
//     type: 'Number',
//     default_value: 0,
//     filter: {
//         type: 'integer'
//     },
// }];
//
// var sql = jsonSql.build({
//     type: 'create',
//     table: 'peers123',
//     tableFields: this.model
// });
//
//
//
// console.log(sql);
var ip = require('ip');
var a = ip.toLong('192.168.18.101');
console.log(a);
