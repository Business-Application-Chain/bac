import io from './io'

export default {
    //获取联系人的总量, params: [publicKey]
    count (params) {
        return io.post({
            api: 'contacts',
            method: 'count',
            params
        })
    },

    //获取用户的联系人列表 params:[publicKey]
    getList (params) {
        return io.post({
            api: 'contacts',
            method: 'contacts',
            params
        }) 
    },

    //获取添加联系人所需费用
    getFee () {
        return io.post({
            api: 'contacts',
            method: 'getFee'
        })
    },

    //添加联系人  params: [助记词，公钥，好友地址，支付密码，多重签名（前三个参数必填）]
    add (params) {
        return io.post({
            api: 'contacts',
            method: 'addContact',
            params
        })
    }
}