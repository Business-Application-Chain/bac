// let i = "5";
// i = parseInt(i);
// console.log(typeof i);
var merkle = require('merkle');
let a = ["752b6cc3b8eb5dcf38563c2d8d3edfc7ef012088fb67d336de6bbad963f286b5","652b6cc3b8eb5dcf38663c2d8d3edfc7ef012088fb67d336de6bbad963f286b5"];
var sha256tree = merkle('sha256').sync(a.sort());
console.log(sha256tree.root());