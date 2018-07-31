<template>
    <div class="login-genwords-page">
        <login-step></login-step>
        <div class="page-title">{{$t('yourBackupWords')}}</div>
        <div class="page-desc">
            {{$t('writeDownBackWords')}}
        </div>
        
        <div class="page-sec">
            <div class="sec-title">{{$t('yourBackupWords')}}</div>
            <div class="words-cont">{{mnemonic}}</div>
        </div>

        <div class="page-sec">
            <div class="btn-cont">
                <div class="btn-cont_hd">
                    <x-btn @click="goBack"><b>{{$t('back')}}</b></x-btn>
                </div>
                <div class="btn-cont_ft">
                    <x-btn @click="goNext" width="180px" type="primary"><b>{{$t('continueNext')}}</b></x-btn>
                </div>
            </div>
        </div>

        <modal 
            v-if="confirmVisible" 
            @ok="next" 
            :visible.sync="confirmVisible"
            title="确认" 
            size="small">
            {{$t('confirmWrittenDownBackupWords')}}
        </modal>
    </div>
</template>

<script>
    import XBtn from '../../components/ui/XBtn.vue'
    import Modal from '../../components/ui/Modal.vue'
    import api from '../../js/api/index'
    import LoginStep from '../../components/LoginStep.vue'


    console.log()

    export default {
        data () {
            return {
                mnemonic: '',
                privateKey: '',
                confirmVisible: false,
                nextLoading: false
            }
        },
        components: {
            XBtn,
            Modal,
            LoginStep
        },
        created () {
            api.account.getMnemonic().then(res => { 
                if (res === null) return;
                
                this.mnemonic = res.mnemonic
                this.privateKey = res.privateKey
            })
        },
        mounted () {
            
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            goNext () {
                this.confirmVisible = true
            },

            next () {
                this.confirmVisible = false
                this.$store.dispatch('setKey', {
                    mnemonic: this.mnemonic,
                    privateKey: this.privateKey
                })
                this.$router.push({ path: 'set' })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-genwords-page{
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

        .pointer-sec{
            cursor: pointer;
        }

        .sec-title{
            font-size: 18px;
            color: #4A4A4A;
            line-height: 18px;
            margin-top: 30px;
        }
        .words-cont{
            padding: 16px 30px;
            border: 1px solid #E6E6E6;
            border-radius: 1px;
            margin-top: 14px;
            margin-bottom: 40px;
            line-height: 34px;
            font-size: 20px;
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
