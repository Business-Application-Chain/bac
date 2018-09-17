<template>
    <div class="account-index-page">
        <tabs v-model="tabsVal">
            <tabs-pane label="账户信息" name="1">
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

                        <div class="main-cell_id">
                            <div class="main-title">锁仓状态</div>
                            <div class="main-primary">
                                <div v-if="lockDuration > 0">
                                    大约在 <span class="lock-primary">{{lockDuration | duration}}</span> 后解锁
                                </div>
                                <div v-if="lockDuration <= 0">
                                    未锁仓
                                </div>
                            </div>
                        </div>

                        <!-- <x-btn type="primary" icon="&#xe611;">新建地址</x-btn> -->
                    </div>

                    <div class="main-item">
                        <div class="main-item_hd">账户公钥</div>
                        <div class="main-item_ft">{{account.publicKey}}</div>
                    </div>
                </div>
            </tabs-pane>
            <tabs-pane label="锁仓" name="2">
                <div class="page-main">
                    <div class="lock-wrapper">
                        <div class="lock-title">设置锁仓信息</div>
                        <template v-if="lockDuration <= 0">
                            <div class="lock-input"><x-input v-model="lockHeight" placeholder="请输入锁仓的区块高度"></x-input></div>
                            <div class="lock-hint">大约在 <span class="lock-primary">{{(lockHeight - curHeight) * 10 * 1000 | duration}}</span> 后解锁</div>
                            <div class="lock-input" v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1"><x-input v-model="lockPassword" type="password" placeholder="请输入支付密码"></x-input></div>
                            <div class="lock-btn"><x-btn @click="lock" :disabled="lockBtnDisabled"  width="150px" type="primary"></x-btn></div>
                        </template>
                            
                       <template v-else>
                           <div class="locked-height">锁仓至 <span class="lock-primary">{{lockedHeight}}</span></div>
                           <div class="locked-hint">大约在 <span class="lock-primary">{{lockDuration | duration}}</span> 后解锁</div>
                       </template>
                        
                    </div>
                </div>
            </tabs-pane>
        </tabs>

       

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

        <modal 
            v-if="confirmVisible" 
            :visible.sync="confirmVisible" 
            title="锁仓提醒"
            @ok="lockSubmit">
            <div>设置后，在区块到达此高度前将 <b class="lock-primary"> 无法转账 </b>  ，确定要锁仓吗？</div>
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
    import Tabs from '~/components/ui/Tabs.vue'
    import TabsPane from '~/components/ui/TabsPane.vue'
    import {padStart} from 'lodash'

    export default {
        data () {
            return {
                setVisible: false,
                confirmVisible: false,
                username: '',
                password: '',
                fee: '',
                okLoading: false,
                tabsVal:'1',
                curHeight: '',
                lockHeight: '',
                lockPassword: '',
                lockDuration:'', 
                lockedHeight: '',
            
            }
        },
        created () {
            this.initLock()
            api.account.getFee().then(res => {
                if (res === null) return;
                this.fee = res.fee
            })

            api.blocks.height().then(res => {
                if (res === null) return;
                this.curHeight = res
            })
        },

        filters : {
            duration (time) {
                if(time > 0){
                    const dd = padStart(Math.floor(time / (1000 * 60 * 60 * 24)), 2, '0')
                    const hh = padStart(Math.floor(time / (1000 * 60 * 60)) % 24, 2, '0')
                    const mm = padStart(Math.floor(time / (1000 * 60)) % 60, 2, '0')
                    const ss = padStart(Math.floor(time / 1000) % 60, 2, '0')

                    return `${dd}天${hh}时${mm}分${ss}秒`
                }
            }
        },
        computed :{
            ...mapState({
                account: state => state.account,
                key: state =>  state.key
            }),
            lockBtnDisabled () {
                return !this.lockHeight ||  !this.lockPassword
            }
        },
        components: {
            XBtn,
            Modal,
            XInput,
            Tabs,
            TabsPane
        },

        methods: {
            submit () {
                api.account.addUsername([this.key.mnemonic, this.username, this.account.publicKey, sha256(this.password).toString()]).then(res => {
                    if (res === null) return;

                    this.$store.dispatch('setAccount', {username: this.username})
                    this.setVisible = false
                    Toast.success('设置成功')
                })
            },

            initLock () {
                let timer
                api.account.getLock([this.account.address[0]]).then(res => {
                    if (res === null) return;
                    this.lockDuration = res.d_value * 10 * 1000
                    this.lockedHeight = res.height

                    if (this.lockDuration > 0) {
                        timer = setInterval(() => {
                            this.lockDuration -= 1000
                            if (this.lockDuration <= 0) {
                                clearInterval(timer)
                                this.initLock()
                            }
                        }, 1000)
                    }
                })
            },

            lock () {
                this.confirmVisible = true
            },

            lockSubmit () {
                this.confirmVisible = false
                api.account.lockHeight([this.key.mnemonic, Number(this.lockHeight), sha256(this.lockPassword).toString()]).then(res => {
                    if (res === null) return
                    Toast.success('锁仓成功')
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
            min-height: 300px;
        }

        .main-cell{
            

            border-bottom: 1px solid #F2F2F2;
            margin-bottom: 20px;
            padding: 30px 0
        }

        .main-title{
            font-size: 14px;
            color: #9B9B9B;
            width: 70px;
            text-align: right
        }

        .main-primary{
            font-size: 16px;
            color: #4A4A4A;
            margin-left: 30px;
        }

        .main-cell_id{
            display: flex;
            align-items: center;
            &:not(:first-child){
                margin-top: 15px
            }
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
            width: 70px;
            text-align: right
        }

        .main-item_ft{
            font-size: 16px;
            color: #9B9B9B;
            flex: 1;
            margin-left: 30px;
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
        
        .lock-wrapper{
            width: 500px;
        }

        .lock-title{
            font-size: 18px;
            color: #4A4A4A;
            margin-top: 22px;
        }

        .lock-input{
            margin-top: 20px;
        }

        .lock-hint{
            font-size: 12px;
            color: #9B9B9B;
        }

        .lock-primary{
            color: #FF7E7E   
        }
        
        .lock-btn{
            margin-top: 30px;
            text-align: right
        }
        .locked-height{
            margin-top: 30px;
        }
        .locked-hint{
            margin-top: 10px;
        }
    }
</style>

