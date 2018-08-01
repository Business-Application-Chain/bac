import io from './io'

export default {
    //获取区块高度
    height () {
        return io.post({
            api: 'blocks',
            method: 'height'
        })
    },

    //获取最新区块  params: [height, size]
    blocks (params = [0, 10]) {
        return io.post({
            api: 'blocks',
            method: 'blocks',
            params
        })
    },

    //获取单个区块  params: [hash]  hash可以是区块hash  也可以是交易hash
    block (params) {
        return io.post({
            api: 'blocks',
            method: 'block',
            params
        })
    }
}