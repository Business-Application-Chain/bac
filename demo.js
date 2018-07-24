let bacLib = require('bac-lib');
mnemonic_string = "sweet travel cannon cloth shield funny need mobile antenna buffalo host wire";
let seed = bacLib.bacBip39.mnemonicToSeed(mnemonic_string);
let node = bacLib.bacHDNode.fromSeedHex(seed);
let keyPair = bacLib.bacECpair.fromWIF(node.keyPair.toWIF());
let privateKey = keyPair.d.toBuffer(32);
let pub = keyPair.getPublicKeyBuffer();
let a = {"wid": "219c2234-be57-4058-8b2e-35b12a633308",};
var signature = bacLib.bacSign(JSON.stringify(a), privateKey, 1);
// 助记词
console.log("助记词 -> ", mnemonic_string); // //
//
let address = bacLib.bacHDNode.fromSeedBuffer(seed).getAddress();
console.log("address -> ", address); // // // 私钥
// console.log('privateKey -> ', privateKey.toString('hex')); // // 签名
// console.log("publickKey ->",pub.toString('hex'));
// console.log('signature -> ', signature.toString("hex")); // //
// console.log('data -> ', JSON.stringify(a));
// let buf = new Buffer(address);
// console.log(buf);


// let publicKey = '021e6267017874ac4b59e0b064f046d5a4f178cb5088afb333e5968002ab3b20f4';
// let publicBuffer = Buffer.from(publicKey, 'hex');
// let address = bacLib.bacECpair.fromPublicKeyBuffer(publicBuffer).getAddress();
// console.log(address);

// console.log('021e6267017874ac4b59e0b064f046d5a4f178cb5088afb333e5968002ab3b20f4'.length);
// console.log('b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75'.length);
