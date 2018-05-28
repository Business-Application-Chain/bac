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


// var buf1 = new Buffer(26);
// for (var i = 0 ; i < 26 ; i++) {
//     buf1[i] = i + 97; // 97 is ASCII a
// }
// console.log(buf1.toString());
//
// var buf2 = buf1.slice(0, 3);
// console.log(buf2.toString());
//
// var arr = [0,5,1,10,2,4];
// console.log(arr.reverse());
//
// var height = 96462;
// var delegates = 101;
// console.log(Math.floor(96462 / delegates) + (96462 % delegates > 0 ? 1 : 0));
// console.log(Math.floor(96463 / delegates) + (96463 % delegates > 0 ? 1 : 0));
// console.log(Math.floor(96464 / delegates) + (96464 % delegates > 0 ? 1 : 0));
// console.log(Math.floor(96465 / delegates) + (96465 % delegates > 0 ? 1 : 0));

var Sequelize = require('sequelize');

var dbClient = new Sequelize('db_entu', 'root', '123456', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 30000
    }
});

var sql = "INSERT INTO blocks (id, version, timestamp, height, previousBlock, numberOfTransactions, totalAmount, totalFee, reward, payloadLength, payloadHash, generatorPublicKey, blockSignature) VALUES ($id, $version, $timestamp, $height, $previousBlock, $numberOfTransactions, $totalAmount, $totalFee, $reward, $payloadLength, $payloadHash, $generatorPublicKey, $blockSignature)";

// dbClient.query("INSERT INTO blocks (id, version) VALUES ('8593810399212843182', 0)", {
//     type: Sequelize.QueryTypes.INSERT
// });

var txObj = {
    "type": 0,
    "amount": 10000000000000000,
    "fee": 0,
    "timestamp": 0,
    "recipientId": "14837479272589364523L",
    "senderId": "5231662701023218905L",
    "senderPublicKey": "b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75",
    "signature": "aa413208c32d00b89895049ff21797048fa41c1b2ffc866900ffd97570f8d87e852c87074ed77c6b914f47449ba3f9d6dca99874d9f235ee4c1c83d1d81b6e07",
    "id": "5534571359943011068"
};
txObj.blockId = '8593810399212843182';
//
//
dbClient.query("INSERT INTO transactions (id, blockId, type, timestamp, senderPublicKey, requesterPublicKey, senderId, recipientId, senderUsername, recipientUsername, amount, fee, signature, signSignature, signatures) VALUES ($id, $blockId, $type, $timestamp, $senderPublicKey, $requesterPublicKey, $senderId, $recipientId, $senderUsername, $recipientUsername, $amount, $fee, $signature, $signSignature, $signatures)", {
    type: Sequelize.QueryTypes.INSERT,
    bind: {
        id: txObj.id,
        blockId: txObj.blockId,
        type: txObj.type,
        timestamp: txObj.timestamp,
        senderPublicKey: txObj.senderPublicKey,
        requesterPublicKey: txObj.requesterPublicKey ? txObj.requesterPublicKey : null,
        senderId: txObj.senderId,
        recipientId: txObj.recipientId || null,
        senderUsername: txObj.senderUsername || null,
        recipientUsername: txObj.recipientUsername || null,
        amount: txObj.amount,
        fee: txObj.fee,
        signature: txObj.signature ? txObj.signature : null,
        signSignature: txObj.signSignature ? txObj.signSignature : null,
        signatures: txObj.signatures ? txObj.signatures.join(',') : null
    },
    transaction: null
}).then(function (rows) {
    console.log(rows);
}, function (err) {
    console.log(err.toString());
});


