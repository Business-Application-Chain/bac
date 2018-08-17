<template>
    <div class="account-index-page">
        <div class="page-main">
            <div class="main-cell">
                <div class="main-cell_id">
                    <div class="main-title">账户ID</div>
                    <div class="main-primary">{{account.address[0]}}</div>
                </div>

                <div class="main-cell_id">
                    <div class="main-title">别名</div>
                    <div class="main-primary">
                        <span v-if="account.username">{{account.username}}</span>
                        <span v-else @click="setVisible = true" class="link">未设置</span>
                    </div>
                </div>

                <div class="main-cell_id">
                    <div class="main-title">总余额</div>
                    <div class="main-primary">{{account.balance | bac}}</div>
                </div>

                <!-- <x-btn type="primary" icon="&#xe611;">新建地址</x-btn> -->
            </div>

            <div class="main-item">
                <div class="main-item_hd">账户公钥</div>
                <div class="main-item_ft">{{account.publicKey}}</div>
            </div>
            
        </div>

        <div style="display:none" class="page-card">

            <div class="card-tag"></div>

            <div class="card-hd">
                <div class="card-title">地址1</div>
                <div class="card-primary">191hbwZX9UqfmHELpM3Yy6snyW9HaspcFZ</div>
            </div>
            <div class="card-bd">
                <div class="card-title">余额</div>
                <div class="card-primary">238.12345678 <span class="card-desc">BAC</span></div>
            </div>
            <x-btn icon="&#xe60b;">Send</x-btn>
        </div>
        
        <modal 
            v-if="setVisible" 
            :visible.sync="setVisible"
            @ok="submit"
            :okLoading="okLoading"
            title="设置别名" 
            hint="设置别名需要手续费且不可修改">
            <div class="set-title">
                <div class="set-title_hd"><b>别名</b></div>
                <div class="set-title_ft"></div>
            </div>
            <x-input v-model="username" placeholder="请填写别名"></x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="set-title">
                <div class="set-title_hd"><b>密码</b></div>
                <div class="set-title_ft"></div>
            </div>
            <x-input v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" v-model="password" type="password" placeholder="请输入支付密码"></x-input>
            <div class="set-fee">
                费用: {{fee | bac}} bac
            </div>
        </modal>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import Modal from '~/components/ui/Modal.vue'
    import XInput from '~/components/ui/XInput.vue'
    import api from '~/js/api/index'
    import {mapState} from 'vuex'
    import Toast from '~/components/ui/toast/index'
    import sha256 from 'crypto-js/sha256'

    export default {
        data () {
            return {
                setVisible: false,
                username: '',
                password: '',
                fee: '',
                okLoading: false
            }
        },
        created () {
            api.account.getFee().then(res => {
                if (res === null) return;
                this.fee = res.fee
            })
        },
        computed :{
            ...mapState({
                account: state => state.account,
                key: state =>  state.key
            })
        },
        components: {
            XBtn,
            Modal,
            XInput
        },

        methods: {
            submit () {
                api.account.addUsername([this.key.mnemonic, this.username, this.account.publicKey, sha256(this.password).toString()]).then(res => {
                    if (res === null) return;

                    this.$store.dispatch('setAccount', {username: this.username})
                    this.setVisible = false
                    Toast.success('设置成功')
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .account-index-page{
        .page-main{
            background: #fff;
            border-radius: 4px;
            padding: 8px 30px 14px;
            
        }

        .main-cell{
            display: flex;
            align-items: center;
            height: 88px;
            border-bottom: 1px solid #F2F2F2;
            margin-bottom: 20px;
        }

        .main-title{
            font-size: 14px;
            color: #9B9B9B;
        }

        .main-primary{
            font-size: 16px;
            color: #4A4A4A;
            margin-top: 12px;
        }

        .main-cell_id{
            flex: 1
        }

        .link{
            color: #3F80FA;
            cursor: pointer;
        }
        
        .main-item{
            display: flex;
            align-items: center;
            margin-bottom: 14px;
        }

        .main-item_hd{
            font-size: 16px;
            color: #4A4A4A;
            width: 92px;
        }

        .main-item_ft{
            font-size: 16px;
            color: #9B9B9B;
            flex: 1
        }

        .page-card{
            background: #FFFFFF;
            border-radius: 4px;
            height: 86px;
            display: flex;
            align-items: center;
            margin-top: 10px;
            padding: 0 30px;
            position: relative;
        }

        .card-tag{
            position: absolute;
            z-index: 9;
            background: #E2ECFF;
            border-radius: 0 4px 4px 0;
            width: 4px;
            height: 66px;
            left: 0px;
            top: 50%;
            transform: translate(0, -50%);
        }

        .card-title{
            font-size: 14px;
            color: #9B9B9B;
        }
        .card-primary{
            font-size: 16px;
            color: #4A4A4A;
            margin-top: 13px;
        }

        .card-desc{
            font-size: 12px;
            color: #000000;
        }

        .card-hd{
            flex:2
        }

        .card-bd{
            flex: 1
        }

        .set-title{
            text-align: left;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .set-title_hd{
            font-size: 18px;
            color: #9B9B9B;
            flex: 1
        }

        .set-title_ft{
            font-size: 14px;
            color: #24D17E;
        }
        
        .set-fee{
            font-size: 14px;
            color: #FF7E7E
        }
        
        
    }
</style>

