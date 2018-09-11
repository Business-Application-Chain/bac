import io from './io'

export default {
    //开启用户,一般登录后调用  params:助记词
    open (params) {
        return io.post({
            api: 'accounts',
            method: 'open',
            params
        })
    },

    //设置用户的别名  params: [助记词，用户名，公钥，密码（可选）]
    addUsername (params) {
        return io.post({
            api: 'accounts',
            method: 'addUsername',
            params
        })
    },

    //获取设置别名的费用
    getFee () {
        return io.post({
            api: 'accounts',
            method: 'getUsernameFee'
        })
    },

    //获取单个用户的信息  params: [address, yourAddress]
    getAccount (params) {
        return io.post({
            api: 'accounts',
            method: 'getAccount',
            params
        })
    },

    //获取设置密码的费用
    getPasswordFee () {
        return io.post({
            api: 'signatures',
            method: 'getFee'
        })
    },

    //设置支付密码  [secret,secondSecret,publicKey,multisigAccountPublicKey]
    addSignature (params) {
        return io.post({
            api: 'signatures',
            method: 'addSignature',
            params
        })
    },

    //通过助记词生成私钥  params: [mnemonic]
    getPrivateKey (params) {
        return io.post({
            api: 'accounts',
            method: 'getPrivateKey',
            params
        })
    },

    //生成助记词和私钥
    getMnemonic () {
        return io.post({
            api: 'accounts',
            method: 'getMnemonic'
        })
    },

    //锁仓  params: [mnemonic,lockHeight,secondSecret]
    lockHeight (params) {
        return io.post({
            api: 'accounts',
            method: 'lockHeight',
            params
        })
    }
}