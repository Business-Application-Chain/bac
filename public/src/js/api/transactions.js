import io from './io'

export default {
    //获取全部交易   params: [区块高度，   数量]
    allTransactions (params = [0, 10]) {
        return io.post({
            api: 'transactions',
            method: 'getAllTransactions',
            params
        })
    },

    //获取用户的全部交易  params: [address, page, size]  
    transactions (params) {
        return io.post({
            api: 'transactions',
            method: 'transactions',
            params
        })
    },

    //发起交易  params: [交易金额，公钥，对方地址，助记词，交易密码（可以为空），多重签名]
    add (params) {
        return io.post({
            api: 'transactions',
            method: 'addTransaction',
            params
        })
    }
}