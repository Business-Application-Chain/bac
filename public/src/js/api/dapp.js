import io from './io'

export default {
    //上传合约  params: [助记词，合约类名，合约代码，密码]
    uploadDapp (params) {
        return io.post({
            api: 'dapp',
            method: 'upLoadDapp',
            params
        }) 
    },

    //获取上传合约所需费用  params: [合约代码]
    getCreateDappFee (params) {
        return io.post({
            api: 'dapp',
            method: 'getCreateDappFee',
            params
        }) 
    },

    //执行合约 params: [mnemonic, dappHash, func, param, secondSecret]
    handleDapp (params) {
        return io.post({
            api: 'dapp',
            method: 'handleDapp',
            params
        })
    },

    //获取合约详情 params: [dappHash]
    getDappInfo (params) {
        return io.post({
            api: 'dapp',
            method: 'getDappInfo',
            params
        })
    },

    //转移合约所有人  params: [mnemonic,dappHash,transferAddress,secondSecret]
    transferDapp (params) {
        return io.post({
            api: 'dapp',
            method: 'transferDapp',
            params
        })
    },

    //查询dapp余额  params: [address, dappHash]
    searchDappBalance (params) {
        return io.post({
            api: 'dapp',
            method: 'searchDappBalance',
            params
        })
    },

    //查询dapp列表 params: [页码，页面大小]
    searchDappList (params) {
        return io.post({
            api: 'dapp',
            method: 'searchDappList',
            params
        })
    },

    //根据hash搜索dapp params: [dappHash]
    searchDappHash (params) {
        return io.post({
            api: 'dapp',
            method: 'searchDappHash',
            params
        })
    },

     //查询自己发布的合约  params: [address]
    searchMineList (params) {
        return io.post({
            api: 'dapp',
            method: 'searchMineList',
            params
        })
    },

    //查询合约操作记录  params: [dappHash, transactionHash, address]
    searchDappHandle (params) {
        return io.post({
            api: 'dapp',
            method: 'searchDappHandle',
            params
        })
    },

}