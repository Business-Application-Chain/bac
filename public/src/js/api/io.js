import axios from 'axios'
import config from '../config.js'
import Toast from '~/components/ui/toast/index'
import error from '~/js/error.js'

const url = config.url
const ioUrl = `${url}rpc`

const getLang = () => {
    let lang = localStorage.getItem('lang')
    if (lang != 'zh' && lang != 'en') {
        lang = 'en'
    }
    return lang
}

export default {
    post ({jsonrpc = '1.0', api = '', method = '', params = []}) {
        const id = Math.ceil(Math.random() * 100 + 1)

        return axios({
            method: 'post',
            url: ioUrl,
            headers: {
                version: config.version,
                os: config.os,
                port: config.port,
                'share-port': config["share-port"]
            },
            data: { jsonrpc, api, method, params, id  }
        }).then(res => {
            if(res.data.code == 200) {
                return res.data.result
            } else {
                Toast.error(error[res.data.code][getLang()])
                return null
            }
        }).catch(err => {
            return null
        })
    }
}