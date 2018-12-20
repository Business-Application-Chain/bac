<template>
    <div class="dapp-create-page">
        <div class="sec">
            <div class="sec-header">
                <div class="sec-header_hd">
                    {{$t('CreateDapp')}}
                </div>
                <div class="sec-header_ft">
                    
                </div>
            </div>
            
            <div class="page-main">
                <div class="modal-label">{{$t('DappCode')}}</div>
                <codemirror v-model="code" :options="{
                    lineNumbers: true
                }"></codemirror>

                <div class="create-modal-main">
                    <div class="modal-label">{{$t('DappClass')}} ({{$t('Pleasekeepthesameasthecodeclassname')}})</div>
                    <x-input 
                        v-model.trim="dappClass" 
                        type="text"
                        :placeholder="$t('Pleaseenterthedappclass')">
                    </x-input>

                    <div class="modal-label">{{$t('Gas')}}</div>
                    <x-input 
                        v-model="gasLimit" 
                        type="text"
                        :placeholder="$t('GasPlaceholder')">
                    </x-input>

                    <div class="fee">{{$t('Fee')}} ≈ {{fee}} BAC</div>

                    <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1"  class="modal-label">{{$t('PaymentPassword')}}</div> 
                    <x-input 
                        v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                        v-model.trim="password" 
                        type="password"
                        :placeholder="$t('Pleaseenterthepaymentpassword')">
                    </x-input>
                    
                </div>
            </div>

            <div class="actions-cell">
                <div class="actions-cell_hd"></div>
                <div class="actions-cell_ft">
                    <x-btn @click="submit" :loading="btnLoading" type="primary">{{$t('Submit')}}</x-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {codemirror} from 'vue-codemirror-lite'
    import XInput from '~/components/ui/XInput.vue'
    import XBtn from '~/components/ui/XBtn.vue'
    import api from '~/js/api'
    import {mapState} from 'vuex'
    import sha256 from 'crypto-js/sha256'
    import Toast from '~/components/ui/toast'
    import Message from '~/components/ui/message'

    export default {
        data () {
            return {
                password: '',
                createFee: '',
                code: 
`var from;
var balanceFrom;
var balanceObj = Balance();
var messageObj = Message();
var statusObj = Status();

class TestToken {
    init() {
        this.name = "Test Token";
        this.symbol = "TT";
        this.decimals = 8;
        this.totalAmount = 1000000000 * 10 * 8;
        this.statusObj = '{"lock": false,"lockTime": 0}';
        SetObject(this.name, this.symbol, this.decimals, this.totalAmount, this.statusObj);
    }

    send(to, value) {
        if (Get(this.statusObj, "lock") or Get(this.statusObj, "lockTime") > clock() ) {
            return false;
        }
        from = Get(messageObj, "from");
        balanceFrom = Get(balanceObj, from);
        if (balanceFrom - value > 0) {
            balanceObj = SetBalance(balanceObj, from, -value);
            balanceObj = SetBalance(balanceObj, to, value);
            return true;
        }
        return false;
    }

    lockAccount(to) {
        if (Get(messageObj, "admin") == Get(messageObj, "from")) {
            statusObj = SetStatus(statusObj, to, "lock", true);
            return true;
        }
        return false;
    }

    unLockAccount(to) {
        if (Get(messageObj, "admin") == Get(messageObj, "from")) {
            statusObj = SetStatus(statusObj, to, "lock", false);
            return true;
        }
        return false;
    }

    lockAccountTime(time, to) {
        if (Get(messageObj, "admin") == Get(messageObj, "from")) {
            statusObj = SetStatus(statusObj, to, lockTime, time);
        }
        return false;
    }
}`,
                dappClass: '',
                gasLimit: '3000',
                btnLoading: false
            }
        },
        computed: {
            ...mapState({
                account: state => state.account,
                key: state => state.key
            }),

            fee () {
                return this.gasLimit / Math.pow(10, 8)
            }
        },

        components: {
            codemirror,
            XInput,
            XBtn
        },
        
        methods: {
            async submit () {
                if (this.code == '') {
                    Toast.warn(this.$t('Pleaseenterthedappcode'))
                    return
                }

                if (this.dappClass == '') {
                    Toast.warn(this.$t('Pleaseenterthedappclass'))
                    return
                }

                if ( (this.account.secondsign == 1 || this.account.secondsign_unconfirmed == 1) && this.password == '') {
                    Toast.warn(this.$t('Pleaseenterthepaymentpassword'))
                    return
                }
                
                this.btnLoading = true
                
                const msg = this.$t('CreateDappModal', {fee: this.fee})
                const confirm = this.$t('Confirm')
                const cancel = this.$t('Cancel')
                
                Message.confirm(msg, confirm, {
                    okText: confirm,
                    cancelText: cancel
                }).then(async () => {
                    const res = await api.dapp.uploadDapp([this.key.mnemonic, this.dappClass, parseFloat(this.gasLimit), this.code, sha256(this.password).toString()])
                    this.btnLoading = false
                    if (res === null) return;
                    Toast.success(this.$t('Success'))
                }).catch(() => {
                    this.btnLoading = false
                    return;
                })
                
            },

            async getFee () {
                const res = await api.dapp.getCreateDappFee()

                if (res === null) return;;
                this.createFee = res
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dapp-create-page{

        .page-main{
            padding: 0px 30px 30px 30px;
        }

        .modal-label{
            font-size: 16px;
            color: #9B9B9B;
            margin-bottom: 15px;
            margin-top: 20px;
        }
        
        .modal-fee, .fee{
            color: #FF7E7E;
            font-size: 14px;
        }

        .actions-cell{
            display: flex;
            border-top: 1px solid #F2F2F2;
            padding: 20px 30px
        }

        .actions-cell_hd{
            flex: 1
        }
    

        
    }
</style>


