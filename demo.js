let bacLib = require('bac-lib');
let mnemonic_string = "credit video joy hero draft leisure coin arrest floor vague punch ozone";
let seed = bacLib.bacBip39.mnemonicToSeed(mnemonic_string);
let node = bacLib.bacHDNode.fromSeedHex(seed);
let keyPair = bacLib.bacECpair.fromWIF(node.keyPair.toWIF());
let privateKey = keyPair.d.toBuffer(32);
// let pub = keyPair.getPublicKeyBuffer();
// let a = {"type":4,"amount":0,"senderId":"BBGiXeKL6tLQwe5Hqg6eXBBHn8ErUtNM1Z","recipientId":null,"senderPublicKey":"021d830f0a86eb830d9154fd6c3ca89f5e8b319470f72fa08b6528bfb7f3f23b4e","timestamp":1532489480507,"asset":{"username":{"alias":"chenxinyou","publicKey":"021d830f0a86eb830d9154fd6c3ca89f5e8b319470f72fa08b6528bfb7f3f23b4e"}}};
// var signature = bacLib.bacSign.sign(JSON.stringify(a), privateKey, 1);
// // 助记词
// console.log("助记词 -> ", mnemonic_string); // //
// //
// let address = bacLib.bacHDNode.fromSeedBuffer(seed).getAddress();
// console.log("address -> ", address); // // // 私钥
// console.log('privateKey -> ', privateKey.toString('hex')); // // 签名
// console.log("publickKey ->",pub.toString('hex'));
// console.log('signature -> ', signature.toString("hex"));
// console.log('data -> ', JSON.stringify(a));
// let buf = new Buffer(address);
// console.log(buf);


// let publicKey = '021e6267017874ac4b59e0b064f046d5a4f178cb5088afb333e5968002ab3b20f4';
// let publicBuffer = Buffer.from(publicKey, 'hex');
// let address = bacLib.bacECpair.fromPublicKeyBuffer(publicBuffer).getAddress();
// console.log(address);

// console.log('021e6267017874ac4b59e0b064f046d5a4f178cb5088afb333e5968002ab3b20f4'.length);
// console.log('b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75'.length);


// console.log('BBGiXeKL6tLQwe5Hqg6eXBBHn8ErUtNM1Z'.length);
// let a = /^[B]+[A-Za-z|0-9]{33}$/;
// let b = 'BBGiXeKL6tLQwe5Hqg6eXBBHn8ErUtNM1Z';
// console.log(b.match(a));

// let publicKey = 'BBGiXeKL6tLQwe5Hqg6eXBBHn8ErUtNM1Z';
// let publicBuffer = Buffer.from(publicKey, 'hex');

