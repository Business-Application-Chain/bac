<template>
    <div class="settings-index-page sec">
        <div class="sec-header">
            {{$t('PaymentPassword')}}<span class="warn" v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1">[{{$t('Hasbeenset')}}]</span>
        </div>

        <div class="settings-pw">
            <div class="pw-hd">
                <div class="pw-hd_title">{{$t('Password')}}</div>
                <x-input type="password" v-model.trim="password" :status="status" :disabeld="(account.secondsign == 1 || account.secondsign_unconfirmed == 1) ? true : false"></x-input>
                <div class="pw-hd_title second-title">{{$t('ConfirmPassword')}}</div>
                <x-input type="password" v-model.trim="secondPassword" :status="status"  :disabeld="(account.secondsign == 1 || account.secondsign_unconfirmed == 1) ? true : false"></x-input>
                <div class="hd-btn">
                    <x-btn type="primary" @click="submit" :disabled="disabled" :loading="loading" width="126px">{{$t('Submit')}}</x-btn>
                </div>
            </div>

            <div class="pw-ft">
                <div class="pw-ft_warn">
                    <span class="warn-circle"></span>{{$t('Warning')}}：{{$t('Thepaymentpasswordcannotbemodifiedafteritisset')}}
                </div>
                
                <div class="pw-ft_desc">{{$t('PaymentPasswordsethint')}}</div>

                <div class="pw-ft_primary">{{$t('Fee')}}：<b>{{fee | bac}} BAC</b> </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    import XInput from '~/components/ui/XInput.vue'
    import XBtn from '~/components/ui/XBtn.vue'
    import api from '~/js/api/index'
    import sha256 from 'crypto-js/sha256'
    import {mapState} from 'vuex'
    import Toast from '~/components/ui/toast/index'
    
    export default {
        data () {
            return {
                password: '',
                secondPassword: '',
                fee: '',
                loading: false
            }
        },
        components: {
            XInput,
            XBtn
        },
        computed :{
            disabled () {
                if (this.password != '' && this.password == this.secondPassword) {
                    return false
                }
                return true
            },
            status () {
                if (this.password != '' && this.password == this.secondPassword) {
                    return 'success'
                }
                return ''
            },
            ...mapState(['account', 'key'])
        },
        created () {
            api.account.getPasswordFee().then(res => {
                if (res === null) return;
                this.fee = res.fee
            })
        },

        methods: {
            submit () {
                this.loading = true
                const secret = sha256(this.password).toString()


                api.account.addSignature([this.key.mnemonic, secret, this.account.publicKey]).then(res => {
                    this.loading = false
                    if (res === null) return;

                    Toast.success(this.$t('Success'))
                    location.reload()
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .settings-index-page{
        padding-bottom: 44px;
        .settings-pw{
            display: flex;
            padding: 0 30px;
            margin-top: 30px;
            
        }
        
        .pw-hd{
            flex: 1;
            padding-right: 50px;
            border-right: 1px solid #f2f2f2;
        }

        .pw-hd_title{
            font-size: 16px;
            color: #9B9B9B;
            margin-bottom: 14px;
        }

        .hd-btn{
            text-align: right;
            margin-top: 30px;
        }

        .second-title{
            margin-top: 24px;
        }


        .pw-ft{
            flex: 1;
            margin-left: 50px;
            padding: 0 50px 0 0;
            margin-top: 10px;
        }

        .pw-ft_warn{
            font-size: 14px;
            color: #FF7E7E;
        }

        .warn-circle{
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #FF7E7E;
            margin-right: 10px
        }

        .pw-ft_desc{
            font-size: 14px;
            color: #9B9B9B;
            line-height: 25px;
            margin-top: 12px;
        }

        .pw-ft_primary{
            font-size: 14px;
            color: #000;
            line-height: 25px;
            margin-top: 39px;
        }

        .warn{
            color: #FF7E7E
        }
        
    }
</style>
