// let ip = require('ip');
// // console.log(ip.fromLong(2892235221));



let a = '陈';
let b = new Buffer(a).toString('hex');
let c = new Buffer(b, 'hex');

console.log(c.toString());