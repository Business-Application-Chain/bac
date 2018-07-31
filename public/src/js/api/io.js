import axios from 'axios'
import config from '../config.js'
import Toast from '~/components/ui/toast/index'

const url = config.url
const ioUrl = `${url}rpc`
console.log(ioUrl)
export default {
    post ({jsonrpc = '1.0', api = '', method = '', params = []}) {
        const id = Math.ceil(Math.random() * 100 + 1)

        return axios({
            method: 'post',
            url: ioUrl,
            data: { jsonrpc, api, method, params, id }
        }).then(res => {
            if(res.data.code == 200) {
                return res.data.result
            } else {
                Toast.error(res.data.error)
                return null
            }
        }).catch(err => {
            return null
        })
    }
}