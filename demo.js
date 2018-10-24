let bacLib = require('bac-lib');
let mnemonic = "detect rabbit hospital control spice ride rain sibling fence service seven put";
let seed = bacLib.bacBip39.mnemonicToSeed(mnemonic);
let node = bacLib.bacHDNode.fromSeedHex(seed);
let keyPair = bacLib.bacECpair.fromWIF(node.keyPair.toWIF());
// let msg = "{\"version\":0,\"totalAmount\":0,\"totalFee\":0,\"reward\":0,\"timestamp\":1540348486602,\"numberOfTransactions\":0,\"previousBlock\":\"8593810399212843182\",\"generatorPublicKey\":\"021d830f0a86eb830d9154fd6c3ca89f5e8b319470f72fa08b6528bfb7f3f23b4e\",\"merkleRoot\":\"\",\"difficulty\":\"1766847064778384329583297500742918515827483896875618958121606201292619776\",\"basic\":16}";
let msg = "{\"decisionAddress\":\"BLX3EozVesMb9emWPW2qHGB7RMrcAESysQ\",\"blockSignature\":\"200737273d938f1784f66e9d14fd83671a8424031cea39a821421c76ae3361916a58e75fb3e77a5521f17a906fcf3b96e16a332f60b079474ffd2a9285af7cfe00\"}";
let signJson = {
    msg: "{\"decisionAddress\":\"BLX3EozVesMb9emWPW2qHGB7RMrcAESysQ\",\"blockSignature\":\"200737273d938f1784f66e9d14fd83671a8424031cea39a821421c76ae3361916a58e75fb3e77a5521f17a906fcf3b96e16a332f60b079474ffd2a9285af7cfe00\"}",
    address: "BLX3EozVesMb9emWPW2qHGB7RMrcAESysQ",
    sign: "20a2899be41241b4c3ce99f95c3a994c3cd17d61c6fc237af0a367df230d11575956d2e9ace0e637662e0f77f2841c3a9fe4b7c45ddf4670aed4fec4d8f5e473bd"
};
// return bacLib.bacSign.verify(JSON.stringify(decisionMsg), blockObj.decisionAddress, decisionSign);
// let signs = bacLib.bacSign.sign(msg, keyPair.d.toBuffer(32), 1).toString('hex');
// console.log(signs);
// let res = bacLib.bacSign.verify(signJson.msg, signJson.address, new Buffer.from(signJson.sign, 'hex'));
// console.log(res);
let blockObj = {"version":0,"totalAmount":0,"totalFee":0,"reward":0,"timestamp":1540349736025,"numberOfTransactions":0,"blockSignature":"200737273d938f1784f66e9d14fd83671a8424031cea39a821421c76ae3361916a58e75fb3e77a5521f17a906fcf3b96e16a332f60b079474ffd2a9285af7cfe00","transactions":[],"hash":"000026d26a6ff17b8e305f17fb3d871285374a319b8b0f05cd31654df250171f","previousBlock":"8593810399212843182","generatorPublicKey":"021d830f0a86eb830d9154fd6c3ca89f5e8b319470f72fa08b6528bfb7f3f23b4e","merkleRoot":"","difficulty":"1766847064778384329583297500742918515827483896875618958121606201292619776","basic":16,"decisionSignature":"1f21fd9a9b30623bb8b02f1dd7a58254f4263dc09052544d6a2b2ed8df9feb24fb5a44c66fb6d8576e454616fab40e20ee796aee00845a57559bce680a394a907d","decisionAddress":"BLX3EozVesMb9emWPW2qHGB7RMrcAESysQ"};
let decisionSign = new Buffer(blockObj.decisionSignature, 'hex');
let decisionMsg = {
    blockSignature: blockObj.blockSignature,
    decisionAddress: blockObj.decisionAddress
};
// let signs = bacLib.bacSign.sign(JSON.stringify(decisionMsg), keyPair.d.toBuffer(32), 1).toString('hex');
// console.log(signs);
let res = bacLib.bacSign.verify(JSON.stringify(decisionMsg), blockObj.decisionAddress, decisionSign);
console.log(res);