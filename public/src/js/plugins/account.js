import api from '../api/index'

const update = $store => {
    if ($store.state.key.mnemonic) {
        api.account.open([$store.state.key.mnemonic]).then(res => {
            if (res === null) return;
            
            localStorage.setItem('account', JSON.stringify(res.account))
            $store.dispatch('setAccount', res.account)
        })
    }
}

const clear = $store => {
    localStorage.removeItem('account')
    localStorage.removeItem('key')
    
    $store.dispatch('clearAccount')
    $store.dispatch('clearKey')
}

export {
    update,
    clear
}