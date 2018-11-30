<template>
    <div class="dapp-create-page">
        <div class="sec">
            <div class="sec-header">
                <div class="sec-header_hd">
                    创建合约
                </div>
                <div class="sec-header_ft">
                    
                </div>
            </div>
            
            <div class="page-main">
                <div class="modal-label">合约代码</div>
                <codemirror v-model="code" :options="{
                    lineNumbers: true
                }"></codemirror>

                <div class="create-modal-main">
                    <div class="modal-label">合约类名</div>
                    <x-input 
                        v-model.trim="dappClass" 
                        type="test"
                        placeholder="请输入合约类名">
                    </x-input>

                    <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1"  class="modal-label">支付密码</div> 
                    <x-input 
                        v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                        v-model.trim="password" 
                        type="password"
                        placeholder="请输入支付密码">
                    </x-input>
                    
                </div>
            </div>

            <div class="actions-cell">
                <div class="actions-cell_hd"></div>
                <div class="actions-cell_ft">
                    <x-btn @click="submit" :loading="btnLoading" type="primary">提交</x-btn>
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

    export default {
        data () {
            return {
                password: '',
                createFee: '',
                code: '',
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
                    Toast.warn('请输入合约代码')
                    return
                }

                if (this.dappClass == '') {
                    Toast.warn('请输入合约类名')
                    return
                }

                if ( (this.account.secondsign == 1 || this.account.secondsign_unconfirmed == 1) && this.password == '') {
                    Toast.warn('请输入密码')
                    return
                }
                
                this.btnLoading = true

                const fee = await api.dapp.getCreateDappFee()
                if (fee === null) {
                    this.btnLoading = false
                    return;
                }

                if(!confirm(`创建dapp所需费用${fee / Math.pow(10, 8)} BAC, 确定要继续吗？`)){
                    this.btnLoading = false
                    return;
                }

                const res = await api.dapp.uploadDapp([this.key.mnemonic, this.dappClass, this.code, sha256(this.password).toString()])
                this.btnLoading = false
                if (res === null) return;
                Toast.success('创建合约成功,等待区块打包后查看')
                
                
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


