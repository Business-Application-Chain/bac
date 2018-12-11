<template>
    <div class="add-contact-comp">
        <modal 
            v-if="compVisible" 
            :visible.sync="compVisible"
            @ok="submit"
            :okLoading="okLoading"
            :title="$t('AddContact')" 
            :hint="$t('Addingacontactrequiresafee')">
            <div class="add-title">{{$t('Contact')}}</div>    
            <x-input 
                v-model.trim="compAddress"
                :status="addressStatus"
                :errorMsg="addressError"
                :placeholder="$t('Pleaseenteranicknameoraddress')">
            </x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="add-title">{{$t('PaymentPassword')}}</div> 
            <x-input 
                v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                v-model.trim="password" 
                type="password"
                :status="passwordStatus"
                :errorMsg="passwordError"
                :placeholder="Pleaseenterthepaymentpassword">
            </x-input>
            <div class="add-fee">{{$t('Fee')}}： {{fee | bac}} BAC</div>
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
                    this.addressError = this.$t('Pleaseenteranicknameoraddress')
                    return
                }

                if ( (this.account.secondsign == 1 || this.account.secondsign_unconfirmed == 1) &&  this.password == '') {
                    this.passwordStatus = 'error'
                    this.passwordError = this.$t('Pleaseenterthepaymentpassword')
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
            font-size: 16px;
            color: #9B9B9B;
            margin-bottom: 15px;
        }
    }
</style>

