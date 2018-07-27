var bip39 = require('bip39');
var mnemonic = bip39.generateMnemonic();
// return mnemonic.toString('hex');
console.log(mnemonic.toString('hex'));