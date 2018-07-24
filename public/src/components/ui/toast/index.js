import Toast from './Index.vue'
import Vue from 'vue'

const VM = Vue.extend(Toast)

export default {
    init ({ msg = '', type = 'success', duration = 2000, onClose = null}) {
        const vm = new VM ({
            propsData:{
                msg,
                type,
                duration,
                onClose
            }
        })

        const component = vm.$mount()
        document.querySelector('body').appendChild(component.$el)
    },

    success (msg, onClose, duration) {
        this.init({msg, onClose, duration})
    },

    error (msg, onClose, duration) {
        this.init({msg, type: 'error', onClose, duration})
    },

    warn (msg, onClose, duration) {
        this.init({msg, type: 'warn', onClose, duration})
    }
}