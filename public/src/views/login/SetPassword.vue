<template>
    <div class="login-setpassword-page">
        <login-step step="2"></login-step>
        <div class="page-title">
            {{$t('yourPassword')}}
        </div>
        <div class="page-desc">
            {{$t('weAdviseYouToUseStrongPasswordForYourOwnSecurity')}}
        </div>
        <div class="page-sec">
            <div class="password-sec">
                <div class="sec-title first-title">
                    {{$t('password')}}
                </div>
                <x-input type="password" v-model="password" :status="pwStatus"></x-input>

                <div class="sec-title second-title">
                    {{$t('confirmPassword')}}
                </div>
                <x-input type="password" v-model="confirmPw" :status="pwStatus"></x-input>
            </div>
        </div>

        <div class="page-sec">
            <div class="btn-cont">
                <div class="btn-cont_hd">
                    <x-btn @click="goBack">{{$t('back')}}</x-btn>
                </div>
                <div class="btn-cont_ft">
                    <x-btn @click="goNext" :disabled="pwStatus != 'success'" type="primary">{{$t('continueNext')}}</x-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import XCircle from '../../components/ui/XCircle.vue'
    import XBtn from '../../components/ui/XBtn.vue'
    import XInput from '../../components/ui/XInput.vue'
    import LoginStep from '../../components/LoginStep.vue'
    import sha256 from 'crypto-js/sha256'

    export default {
        data () {
            return {
                password: '',
                confirmPw: ''
            }
        },
        components:{
            XCircle,
            XBtn,
            XInput,
            LoginStep
        },

        computed:{
            pwStatus () {
                if (this.password != '' &&  (this.password == this.confirmPw)) {
                    return 'success'
                } else {
                    return ''
                }
            }
        },

        methods: {
            goBack () {
                this.$router.go(-1)
            },

            goNext () {
                if (this.password != this.confirmPw) {
                    alert('两次密码不一致')
                    return
                }

                this.$store.dispatch('setKey', {password: sha256(this.password).toString()})
                
                this.$router.push({
                    path: 'export'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-setpassword-page{
        .page-title{
            font-size: 36px;
            color: #4A4A4A;
            line-height: 36px;
            text-align: center;
            margin-top: 60px;
        }
        .page-desc{
            font-size: 18px;
            color: #9B9B9B;
            line-height: 30px;
            width: 500px;
            margin: 28px auto;
        }

        .page-sec{
            background: #FFFFFF;
            box-shadow: 0 0 14px 0 rgba(0,0,0,0.02);
            border-radius: 4px;
            margin:0 auto 8px;
            width: 500px;
            box-sizing: border-box;
            padding: 0 30px;
            overflow: hidden;
        }

        .password-sec{
            padding-bottom: 40px;
        }

        .sec-input{
            position: relative;
        }

        .sec-title{
            font-size: 18px;
            color: #9B9B9B;
            line-height: 18px;
  
            margin-bottom: 14px;
        }

        .first-title{
            margin-top: 30px;
        }

        .sec-input_input{
            background: #F8F9FC;
            border: 1px solid #EDEFF5;
            border-radius: 1px;
            height: 43px;
            line-height: 43px;
            width: 100%;
            text-indent: 20px;
        }

        .sec-input_success{
            position: absolute;
            z-index: 9;
            top: 50%;
            right:20px;
            transform: translate(0, -50%);
        }
        .btn-cont{
            display:flex;
            align-items: center;
            height: 100px;
        }

        .btn-cont_hd{
            flex: 1;
        }
    }
</style>
