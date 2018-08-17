var bacLib = require('bac-lib');
var crypto = require('crypto');

let mnemonic_string = "soul bounce omit zone believe true behave during uncle eye salmon awful";
let seed = bacLib.bacBip39.mnemonicToSeed(mnemonic_string);
let node = bacLib.bacHDNode.fromSeedHex(seed);
let keyPair = bacLib.bacECpair.fromWIF(node.keyPair.toWIF());

let address = keyPair.getAddress();
let privateKey = keyPair.d.toBuffer(32);
let sign = bacLib.bacSign.sign(Date.now().toString(), privateKey, 1);
let hash = crypto.createHash('sha256').update(sign).digest();
console.log(hash.toString('hex'));

// f11e87f783222ddb79f4a13777133493ac10c2f9f03a9afbbd73fb8ff7378741
// 205c124c35d4b2f8348bca63857a9e1178bc926c0346cae86b6f4bb02ff60e357a1542e6ef1371fe75ad9319b9f95d638e57fbf8786616e970d40a8d5f8551a246
// 201d6778ecf43af1a506f94f61062d3db62b646ced772b094bdf82db2224e481bf64ab21f8ea2902e60644f74f96d6694a47b3ca50af28cda24c76f85c970dba7e