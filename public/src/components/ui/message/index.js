import Message from './Index.vue'
import Vue from 'vue'

const VM = Vue.extend(Message)

export default {
    init (msg = '内容', title="提示", params = {}) {
        return new Promise((resolve, reject) => {
            const vm = new VM ({
                propsData:{
                    msg,
                    title,
                    ok: resolve,
                    cancel: reject,
                    ...params
                }
            })
    
            const component = vm.$mount()
            document.querySelector('body').appendChild(component.$el)
        })
    },

    alert (msg, title = '提示', params = {okText: '确认'}) {
        return this.init(msg, title, params)
    },

    confirm (msg, title = '确认', params = {okText: '确定', cancelText: '取消'}) {
        return this.init(msg, title, params)
    }
}