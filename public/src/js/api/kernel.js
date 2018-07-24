import io from './io'

export default {
    //获取版本号
    version () {
        return io.post({
            api: 'kernel',
            method: 'version'
        })
    }
}