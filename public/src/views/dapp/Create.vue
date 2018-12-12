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
                    <div class="modal-label">{{$t('DappClass')}}</div>
                    <x-input 
                        v-model.trim="dappClass" 
                        type="text"
                        :placeholder="$t('Pleaseenterthedappclass')">
                    </x-input>

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
                code: `
                    var from;
                    var balanceFrom;
                    var balance = Balance();
                    var message = Message();
                    var status = Status();

                    class TestToken {
                        init() {
                            this.name = "Test Token";
                            this.symbol = "TT";
                            this.decimals = 8;
                            this.totalAmount = 1000000000 * 10 * 8;
                            this.status = '{"lock": false,"lockTime": 0}';
                            SetObject(this.name, this.symbol, this.decimals, this.totalAmount, this.status);
                        }

                        send(to, value) {
                            if (Get(this.status, "lock") or Get(this.status, "lockTime") > clock() ) {
                                return false;
                            }
                            from = Get(message, "from");
                            balanceFrom = Get(balance, from);
                            if (balanceFrom - value > 0) {
                                balance = SetBalance(balance, from, -value);
                                balance = SetBalance(balance, to, value);
                                return true;
                            }
                            return false;
                        }

                        lockAccount(to) {
                            if (Get(message, "admin") == Get(message, "from")) {
                                status = SetStatus(status, to, "lock", true);
                                return true;
                            }
                            return false;
                        }

                        unLockAccount(to) {
                            if (Get(message, "admin") == Get(message, "from")) {
                                status = SetStatus(status, to, "lock", false);
                                return true;
                            }
                            return false;
                        }

                        lockAccountTime(time, to) {
                            if (Get(message, "admin") == Get(message, "from")) {
                                status = SetStatus(status, to, lockTime, time);
                            }
                            return false;
                        }
                    }`,
                dappClass: '',
                btnLoading: false
            }
        },
        computed: {
            ...mapState({
                account: state => state.account,
                key: state => state.key
            })
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

                const fee = await api.dapp.getCreateDappFee()
                if (fee === null) {
                    this.btnLoading = false
                    return;
                }
                
                const msg = this.$t('CreateDappModal', {fee: fee / Math.pow(10, 8)})
                const confirm = this.$t('Confirm')
                const cancel = this.$t('Cancel')
                
                Message.confirm(msg, confirm, {
                    okText: confirm,
                    cancelText: cancel
                }).then(async () => {
                    const res = await api.dapp.uploadDapp([this.key.mnemonic, this.dappClass, this.code, sha256(this.password).toString()])
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
        
        .modal-fee{
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


