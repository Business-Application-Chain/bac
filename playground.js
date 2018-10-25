let merkle = require('merkle');

let a = ["1","2","3","4", "5"];
var sha256tree = merkle('sha256').sync(a);
// let result = sha256tree.root() === blockObj.merkleRoot;
console.log(sha256tree.root());