const Mnemonic = require('bac-mnemonic')
let mnemonicObj = new Mnemonic()
const mnemonic = mnemonicObj.toString()
let a = mnemonicObj.toHDPrivateKey()
let privateKey = a.privateKey.toString('hex')

export{
    mnemonic,
    privateKey
}

// const Mnemonic = require('bitcore-mnemonic')
// const code = new Mnemonic()
// const mnemonic = code.toString()
// const privateKey = code.toHDPrivateKey().toString()

// export {
//     mnemonic,
//     privateKey
// }