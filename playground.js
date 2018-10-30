// bac-testnet-1    172.31.13.173    13.251.35.155
// bac-testnet-2    172.31.15.91    3.0.49.147
// bac-testnet-3    172.31.15.56    13.229.142.176
// bac-testnet-4    172.31.6.143    13.251.130.204
// bac-testnet-5    172.31.3.81    13.229.147.236
// bac-testnet-6    172.31.10.46    13.229.137.253


let ip = require("ip");
console.log(ip.toLong("172.31.13.173"));
console.log(ip.toLong("172.31.15.91"));
console.log(ip.toLong("172.31.15.56"));
console.log(ip.toLong("172.31.6.143"));
console.log(ip.toLong("172.31.3.81"));