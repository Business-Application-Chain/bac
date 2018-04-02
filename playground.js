let bitcoinjs = require('bitcoinjs-lib');
let bitcoinMessage = require('bitcoinjs-message');
let bip39 = require('bip39');

let mnemonic = bip39.generateMnemonic();
mnemonic_string = mnemonic.toString('hex');
let seed = bip39.mnemonicToSeed(mnemonic);
var node = bitcoinjs.HDNode.fromSeedHex(seed);
var keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF());
var privateKey = keyPair.d.toBuffer(32);
var address = bitcoinjs.HDNode.fromSeedBuffer(seed).getAddress();

console.log(address.length);

let uuid = require('uuid');
let uid = uuid.v4();

console.log(uid);
