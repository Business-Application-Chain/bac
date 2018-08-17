<template>
    <div class="add-contact-comp">
        <modal 
            v-if="compVisible" 
            :visible.sync="compVisible"
            @ok="submit"
            :okLoading="okLoading"
            title="添加联系人" 
            hint="添加联系人需要手续费">
            <div class="add-title">联系人</div>    
            <x-input 
                v-model.trim="compAddress"
                :status="addressStatus"
                :errorMsg="addressError"
                placeholder="请输入别名或者地址">
            </x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="add-title">支付密码</div> 
            <x-input 
                v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                v-model.trim="password" 
                type="password"
                :status="passwordStatus"
                :errorMsg="passwordError"
                placeholder="请输入支付密码">
            </x-input>
            <div class="add-fee">费用： {{fee | bac}} BAC</div>
        </modal>
    </div>
    
</template>

<script>
    import Modal from '~/components/ui/Modal.vue'
    import XInput from '~/components/ui/XInput.vue'
    import api from '~/js/api/index'
    import {mapState} from 'vuex'
    import sha256 from 'crypto-js/sha256'

    export default {
        data () {
            return {
                fee: '',
                okLoading: false,
                compVisible: false,
                compAddress: '',
                addressStatus: '',
                addressError: '',
                password: '',
                passwordStatus: '',
                passwordError: '',
            }
        },
        props: {
            visible: {
                default: 'false'
            },
            address: {
                default: ''
            }
        },
        computed: {
             ...mapState({
                account: state => state.account,
                key: state => state.key
            })
        },
        watch: {
            compVisible (newVal) {
                if (!newVal) {
                    this.$emit('update:visible', false)
                }
            },
            compAddress () {
                this.addressStatus = ''
            },
            password () {
                this.passwordStatus = ''
            }
        },
        created () {
            this.compVisible = this.visible
            this.compAddress = this.address

            api.contacts.getFee().then(res => {
                if (res === null) return;
                this.fee = res.fee
            })
        },
        components: {
            Modal,
            XInput
        },
        methods:{
            submit () {
                if (this.compAddress == '') {
                    this.addressStatus = 'error'
                    this.addressError = '请输入别名或者地址'
                    return
                }

                if ( (this.account.secondsign == 1 || this.account.secondsign_unconfirmed == 1) &&  this.password == '') {
                    this.passwordStatus = 'error'
                    this.passwordError = '请输入支付密码'
                    return
                }

                this.okLoading = true
                api.contacts.add([this.key.mnemonic, this.account.publicKey, this.compAddress, sha256(this.password).toString()]).then(res => {
                    this.okLoading = false
                    if (res === null) return;
                    this.compVisible = false
                    this.$emit('success', res)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .add-contact-comp{
         .add-fee{
            color: #FF7E7E;
            font-size: 14px;
        }

        .add-title{
            font-size: 18px;
            color: #9B9B9B;
            margin-bottom: 15px;
        }
    }
</style>

