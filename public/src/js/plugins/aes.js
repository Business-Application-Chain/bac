const CryptoJS = require("crypto-js")
const key = 'yjnhgxabhtforever'

const encrypt = text => {
    return CryptoJS.AES.encrypt(text, key).toString()
}

const decrypt = text => {
    let bytes = CryptoJS.AES.decrypt(text, key)
    return bytes.toString(CryptoJS.enc.Utf8)
}

export default {
    encrypt,
    decrypt
}