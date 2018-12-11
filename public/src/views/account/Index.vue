<template>
    <div class="account-index-page">
        <tabs v-model="tabsVal">
            <tabs-pane :label="$t('Account')" name="1">
                 <div class="page-main">
                    <div class="main-cell">
                        <div class="main-cell_id">
                            <div class="main-title">{{$t('Account')}} ID</div>
                            <div class="main-primary">{{account.address[0]}}</div>
                        </div>

                        <div class="main-cell_id">
                            <div class="main-title">{{$t('Nickname')}}</div>
                            <div class="main-primary">
                                <span v-if="account.username">{{account.username}}</span>
                                <span v-else @click="setVisible = true" class="link">{{$t('Set')}}</span>
                            </div>
                        </div>

                        <div class="main-cell_id">
                            <div class="main-title">{{$t('Balance')}}</div>
                            <div class="main-primary">{{account.balance | bac}}</div>
                        </div>

                        <div class="main-cell_id">
                            <div class="main-title">{{$t('LockStatus')}}</div>
                            <div class="main-primary">
                                <div v-if="lockDuration > 0">
                                    <template v-if="$i18n.locale == 'zh' ">
                                        {{$t('Unlockafterabout_1')}} <span class="lock-primary">{{lockDurationMsg}}</span> {{$t('Unlockafterabout_2')}} 
                                    </template>
                                    <template v-else>
                                         {{$t('Unlockafterabout')}} <span class="lock-primary">{{lockDurationMsg}}</span>
                                    </template>
                                </div>
                                <div v-if="lockDuration <= 0">
                                    {{$t('NotLock')}}
                                </div>
                            </div>
                        </div>

                        <!-- <x-btn type="primary" icon="&#xe611;">新建地址</x-btn> -->
                    </div>

                    <div class="main-item">
                        <div class="main-item_hd">{{$t('PublicKey')}}</div>
                        <div class="main-item_ft">{{account.publicKey}}</div>
                    </div>
                </div>
            </tabs-pane>
            <tabs-pane :label="$t('Lock')" name="2">
                <div class="page-main">
                    <div class="lock-wrapper">
                        <div class="lock-title">{{$t('Setthelock')}}</div>
                        <template v-if="lockDuration <= 0">
                            <div class="lock-input"><x-input v-model="lockHeight" :placeholder="$t('Pleaseentertheheight')"></x-input></div>
                            <div class="lock-hint">
                                <template v-if="$i18n.locale == 'zh' ">
                                    {{$t('Unlockafterabout_1')}} <span class="lock-primary">{{lockHeightMsg}}</span> {{$t('Unlockafterabout_2')}} 
                                </template>
                                <template v-else>
                                    {{$t('Unlockafterabout')}} <span class="lock-primary">{{lockHeightMsg}}</span>
                                </template>
                            </div>
                            <div class="lock-input" v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1"><x-input v-model="lockPassword" type="password" :placeholder="$t('Pleaseenterthepaymentpassword')"></x-input></div>
                            <div class="lock-btn"><x-btn @click="lock" :disabled="lockBtnDisabled"  width="150px" type="primary"></x-btn></div>
                        </template>
                            
                       <template v-else>
                           <div class="locked-height">{{$t('Lockto')}} <span class="lock-primary">{{lockedHeight}}</span></div>
                           <div class="locked-hint">
                               <template v-if="$i18n.locale == 'zh' ">
                                    {{$t('Unlockafterabout_1')}} <span class="lock-primary">{{lockDurationMsg}}</span> {{$t('Unlockafterabout_2')}} 
                                </template>
                                <template v-else>
                                    {{$t('Unlockafterabout')}} <span class="lock-primary">{{lockDurationMsg}}</span>
                                </template>
                            </div>
                       </template>
                        
                    </div>
                </div>
            </tabs-pane>
        </tabs>

        <modal 
            v-if="setVisible" 
            :visible.sync="setVisible"
            @ok="submit"
            :okLoading="okLoading"
            :title="$t('SetNickname')" 
            :hint="$t('Settinganicknamerequiresafeeandcannotbemodified')">
            <div class="set-title">
                <div class="set-title_hd"><b>{{$t('Nickname')}}</b></div>
                <div class="set-title_ft"></div>
            </div>
            <x-input v-model="username" :placeholder="$t('Pleaseenteryournickname')"></x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="set-title">
                <div class="set-title_hd"><b>{{$t('password')}}</b></div>
                <div class="set-title_ft"></div>
            </div>
            <x-input v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" v-model="password" type="password" :placeholder="$t('Pleaseenterthepaymentpassword')"></x-input>
            <div class="set-fee">
                {{$t('Fee')}}: {{fee | bac}} bac
            </div>
        </modal>

        <modal 
            v-if="confirmVisible" 
            :visible.sync="confirmVisible" 
            :title="$t('LockingReminder')"
            @ok="lockSubmit">
            <div v-html="$t('LockModal')"></div>
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
        computed :{
            ...mapState({
                account: state => state.account,
                key: state =>  state.key
            }),
            lockBtnDisabled () {
                if (!this.lockHeight) {
                    return true
                }
                if ((this.account.secondsign == 1 || this.account.secondsign_unconfirmed == 1) && !this.lockPassword) {
                    return true
                }
                return false
            },
            lockDurationMsg () {    
                const dd = padStart(Math.floor(this.lockDuration / (1000 * 60 * 60 * 24)), 2, '0')
                const hh = padStart(Math.floor(this.lockDuration / (1000 * 60 * 60)) % 24, 2, '0')
                const mm = padStart(Math.floor(this.lockDuration / (1000 * 60)) % 60, 2, '0')
                const ss = padStart(Math.floor(this.lockDuration / 1000) % 60, 2, '0')
                
                return `${dd} ${this.$t('Days')} ${hh} ${this.$t('Hours')} ${mm} ${this.$t('Minutes')} ${ss} ${this.$t('Seconds')}`
            },
            lockHeightMsg () {
                const time = (this.lockHeight - this.curHeight) * 10 * 1000
                if (time > 0) {
                    const dd = padStart(Math.floor(time / (1000 * 60 * 60 * 24)), 2, '0')
                    const hh = padStart(Math.floor(time / (1000 * 60 * 60)) % 24, 2, '0')
                    const mm = padStart(Math.floor(time / (1000 * 60)) % 60, 2, '0')
                    const ss = padStart(Math.floor(time / 1000) % 60, 2, '0')
                    
                    return `${dd} ${this.$t('Days')} ${hh} ${this.$t('Hours')} ${mm} ${this.$t('Minutes')} ${ss} ${this.$t('Seconds')}`
                }
                
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
                    Toast.success(this.$t('Success'))
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
                    Toast.success(this.$t('Success'))
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
            width: 80px;
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
            width: 80px;
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

