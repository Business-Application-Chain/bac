import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import VueI18n from 'vue-i18n'
import zh from './js/lang/zh'
import en from './js/lang/en'
import {padStart} from 'lodash'

Vue.config.productionTip = false

Vue.use(VueI18n)
console.log(Vue.version)

//decimal: 要保留的小数位数
Vue.filter('bac',  (value, decimal ) => {
    var num = value / Math.pow(10, 8)
    if (decimal) {
        const n = Math.pow(10, decimal)
        num = Math.floor(num * n) / n
    }
    return num
})

Vue.filter('coin', (val, decimal) => {
    var num = val / Math.pow(10, decimal)
    
    return num
})


Vue.filter('date', value => {
    const date = new Date(value)
    const YYYY = padStart(date.getFullYear(), 2, '0')
    const MM = padStart(date.getMonth() + 1, 2, '0')
    const DD = padStart(date.getDate(), 2, '0')
    
    return `${YYYY}/${MM}/${DD}`
})

const i18n = new VueI18n({
    locale: 'zh',
    messages:{
        zh,
        en,
    }
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if(!store.state.account.publicKey) {  //如果用户未登录
            next({
                path: '/'
            })
        } else {
            next()
        }
        
    } else {
        if(store.state.account.publicKey) {  //如果用户登录
            next({
                path: '/main/dashboard'
            })
        }else {
            next()
        }
        
    }
})

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
