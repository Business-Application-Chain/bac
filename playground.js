// let bitcoinjs = require('bitcoinjs-lib');
// let bitcoinMessage = require('bitcoinjs-message');
// let bip39 = require('bip39');
// let crypto = require('crypto');
// var ed = require('ed25519');
// // let bignum = require('./src/utils/bignum.js');
// //
// let mnemonic = bip39.generateMnemonic();
// mnemonic_string = mnemonic.toString('hex');
//
// let seed = bip39.mnemonicToSeed(mnemonic);
// var node = bitcoinjs.HDNode.fromSeedHex(seed);
// var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
// var privateKey = keyPair.d.toBuffer(32);
// var hash = crypto.createHash('sha256').update(privateKey.toString('hex'), 'utf8').digest();
// var keypair = ed.MakeKeypair(hash);
// var pubKey = keyPair.getPublicKeyBuffer();
// var redeemScript = bitcoinjs.script.witnessPubKeyHash.output.encode(bitcoinjs.crypto.hash160(pubKey));
// var scriptPubKey = bitcoinjs.script.scriptHash.output.encode(bitcoinjs.crypto.hash160(redeemScript));
// console.log(scriptPubKey.toString('hex'));
// var address111 = bitcoinjs.HDNode.fromSeedBuffer(seed).getAddress();
// var address222 = bitcoinjs.address.fromOutputScript(scriptPubKey);
//
// let uuid = require('uuid');
// let uid = uuid.v4();
//
// var hash = crypto.createHash('sha256').update(address111, 'hex').digest();
// var temp = new Buffer(8);
// for (var i = 0; i < 8; i++) {
//     temp[i] = hash[7 - i];
// }
//
// var address = bignum.fromBuffer(temp).toString() + 'L';
//
// console.log(address111);
// console.log(address222);
//
// function rng () { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }
//
// var litecoin = bitcoinjs.networks.litecoin;
// var keyPair1 = bitcoinjs.ECPair.makeRandom({ network: litecoin, rng: rng });
// var pubKey1 = keyPair.getPublicKeyBuffer();
// console.log(pubKey1.toString('hex').length);
// var wif = keyPair1.toWIF();
// var address = keyPair1.getAddress();
//
// var crypto = require('crypto');
// var ed = require('ed25519');
// var bignum = require('./src/utils/bignum.js');
// var hash = crypto.createHash('sha256').update('wKyoJM1vS4ucHmWvxDSdcpC23mJwqfg3G6MKZoXaFfcnWHTqo7', 'utf8').digest();
// var keypair = ed.MakeKeypair(hash);
// var publicKey = keypair.publicKey.toString('hex');
// var publicKeyHash = crypto.createHash('sha256').update(publicKey, 'hex').digest();
// var temp = new Buffer(8);
// for (var i = 0; i < 8; i++) {
//     temp[i] = publicKeyHash[7 - i];
// }
// var address = bignum.fromBuffer(temp).toString() + 'L';
// if (!address) {
//     throw Error("wrong publicKey " + publicKey);
// }
//
// console.log(keypair.publicKey.toString('hex'));
// console.log(address);
//
// var jsonSql = require('./src/json-sql')({dialect: 'mysql'});
//
// var update = {};
// update.$inc = update.$inc || {};
// update.$inc["balance"] = 10000;
// var sql = jsonSql.build({
//     type: 'create',
//     table: 'accounts',
//     tableFields: [
//         {
//             name: 'master_pub',
//             type: 'String',
//             length: 66,
//             not_null: true
//         }
//     ]
// });
// console.log(sql);
//
// var publicKey = new Buffer('b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75', 'hex');
//
// console.log(publicKey.length);


var buf1 = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
    buf1[i] = i + 97; // 97 is ASCII a
}
console.log(buf1.toString());

var buf2 = buf1.slice(0, 3);
console.log(buf2.toString());

var arr = [0,5,1,10,2,4];
console.log(arr.reverse());
