const localKey = JSON.parse(localStorage.getItem('key'))
const localAccount = JSON.parse(localStorage.getItem('account'))

export default {
    account: localAccount ? localAccount : {
        address: [],
        balance: 0,
        publicKey: '',
        multisignatures: null,
        multisignatures_unconfirmed: null,
        second_pub: null,
        secondsign: 0,
        secondsign_unconfirmed: 0,
        username: ''
    },
    key: localKey ? localKey : {
        mnemonic: '',
        privateKey: '',
        password: ''
    }
}