import io from './io'

export default {
    //添加资产   params: [资产名称，描述，发行总量，小数位，助记词，支付密码]
    addAssets (params) {
        return io.post({
            api: 'assets',
            method: 'addAssets',
            params
        })
    },
    
    //获取用户的资产 params: [address]
    getAccountAssets (params) {
        return io.post({
            api: 'assets',
            method: 'getAccountAssets',
            params
        })
    },

    //获取用户发布的资产 params:[address]
    getAssets (params){
        return io.post({
            api: 'assets',
            method: 'getAssets',
            params
        })
    },

    //获取新增资产所需的费用\
    getFee () {
        return io.post({
            api: 'assets',
            method: 'getFee'
        })
    },
    
    //发送资产  params:[发送金额，接受者地址，助记词，资产hash，备注，支付密码]
    send (params) {
        return io.post({
            api: 'transfers',
            method: 'sendTransfers',
            params
        })
    },

    //获取发送资产所需的费用
    getSendFee () {
        return io.post({
            api: 'transfers',
            method: 'getFee'
        })
    },

    //燃烧代币 params: [销毁金额，助记词，资产hash，信息，密码]
    burnAssets (params) {
        return io.post({
            api: 'transfers',
            method: 'burnAssets',
            params
        })
    },

    //转账记录  params: [地址，资产hash，curPage，pageSize]
    getTransfers (params) {
        return io.post({
            api: 'transfers',
            method: 'transfers',
            params
        })
    },
    
}