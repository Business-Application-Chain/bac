export default {
    setAccount({commit}, payload) {
        commit('setAccount', payload)
    },
    clearAccount ({commit}) {
        commit('clearAccount')
    },
    setKey({commit}, payload) {
        commit('setKey', payload)
    },
    clearKey ({commit}) {
        commit('clearKey')
    }
}