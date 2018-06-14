// let ip = require('ip');



let a = '陈';
let b = new Buffer(a).toString('hex');
let c = new Buffer(b, 'hex');

console.log(c.toString());