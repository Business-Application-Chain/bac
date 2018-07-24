const bacLib = require("bac-lib")

const exportKey = mnemonic => {
    let seed = bacLib.bacBip39.mnemonicToSeed(mnemonic);
    let node = bacLib.bacHDNode.fromSeedHex(seed);
    let keyPair = bacLib.bacECpair.fromWIF(node.keyPair.toWIF());
    let privateKey = keyPair.d.toBuffer(32);
    return privateKey.toString('hex')
}

export default exportKey

// import bip39 from 'bip39'
// import bitcoinjs from 'bitcoinjs-lib'

// const exportKey = mnemonic => {
//     let seed = bip39.mnemonicToSeed(mnemonic);
//     let node = bitcoinjs.HDNode.fromSeedHex(seed);
//     let keyPair = bitcoinjs.ECPair.fromWIF(node.keyPair.toWIF())
//     let privateKey = keyPair.d.toBuffer(32)

//     return privateKey.toString('hex')
// }

// export default exportKey