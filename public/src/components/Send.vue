<template>
    <modal 
        v-if="compVisible" 
        :visible.sync="compVisible" 
        :ok-loading="okLoading"
        @ok="submit" 
        title="发送" 
        
        hint="请确认您正发送BAC给正确的接收人，因为该过程是无法撤消的.">
        <div class="send-comp">
            <div class="comp-title">
                <div class="comp-title_hd"><b>我的地址</b></div>
                <div class="comp-title_ft">{{account.balance | bac}} <span>BAC</span></div>
            </div>
            
            <x-input :disabeld="true" v-model="account.address[0]"></x-input>
            
            <div class="comp-title">
                <div class="comp-title_hd"><b>对方账户</b></div>
                <div class="comp-title_ft"></div>
            </div>
            <x-input v-model="recipientAddress" :disabeld="recipient ? true : false" placeholder="请填写对方地址"></x-input>
            <div class="comp-title">
                <div class="comp-title_hd"><b>数量</b></div>
                <div class="comp-title_ft"></div>
            </div>
            <x-input v-model="amount" placeholder="请填写数量"></x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="comp-title">
                <div class="comp-title_hd"><b>密码</b></div>
                <div class="comp-title_ft"></div>
            </div>
            <x-input v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" v-model="password" type="password" placeholder="请输入支付密码"></x-input>
        </div>
    </modal>
</template>

<script>
    import Modal from './ui/Modal.vue'
    import XInput from './ui/XInput.vue'
    import XOption from './ui/XOption.vue'
    import XSelect from './ui/XSelect.vue'
    import {mapState} from 'vuex'
    import api from '../js/api/index'
    import Toast from '~/components/ui/toast/index'
    import sha256 from 'crypto-js/sha256'
    import Message from '~/components/ui/message'
    
    export default {
        data () {
            return {
                address: '',
                recipientAddress: '',
                amount: '',
                compVisible: false,
                password: '',
                okLoading: false
            }
        },
        props: {
            visible: {
                default: false
            },
            recipient: {
                default: ''
            }
        },

        computed:{
            ...mapState({
                account: state =>  state.account,
                key: state => state.key
            })
        },


        watch: {
            compVisible (newVal) {
                if (!newVal) {
                    this.$emit('update:visible', false)
                }
            }
        },

        mounted() {
            this.compVisible = this.visible
            this.recipientAddress = this.recipient

            console.log(this)
        },

        components: {
            Modal,
            XInput,
            XOption,
            XSelect
        },
        
        methods: {
            submit () {
                this.okLoading = true
                api.transactions.add([this.amount * Math.pow(10, 8), this.account.publicKey, this.recipientAddress, this.key.mnemonic, sha256(this.password).toString()]).then(res => {
                    this.okLoading = false
                    if (res === null) return;

                    api.account.getAccount([this.account.address[0]]).then(newRes => {
                        if (newRes === null) return;
                        
                        this.$store.dispatch('setAccount', {
                            balance: newRes.account.balance
                        })
                    })

                    this.compVisible = false
                    Message.alert(`转账成功，has值为${res.transactionHash}`)

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .send-comp{
        text-align: left;
        .comp-title{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .comp-title_hd{
            font-size: 16px;
            color: #9B9B9B;
            flex: 1
        }

        .comp-title_ft{
            font-size: 14px;
            color: #24D17E;
        }
    }
</style>

