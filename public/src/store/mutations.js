export default {
    setAccount (state, payload) {
        Object.assign(state.account, payload)
    },
    clearAccount (state) {
        state.account = {
            address: [],
            balance: 0,
            publicKey: '',
            multisignatures: null,
            multisignatures_unconfirmed: null,
            second_pub: null,
            secondsign: 0,
            secondsign_unconfirmed: 0,
            username: ''
        }
    },
    setKey (state, payload) {
        Object.assign(state.key, payload)
    },
    clearKey (state) {
        state.key = {
            mnemonic: '',
            privateKey: '',
            password: ''
        }
    }
}