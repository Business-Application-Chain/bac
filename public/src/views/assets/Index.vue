<template>
    <div class="assets-index-page">
        <div class="tabs-nav">
            <div class="tabs-nav_item" @click="active = 1 " :class="{active: active == 1}">我的资产</div>
            <div class="tabs-nav_item" @click="active = 2 " :class="{active: active == 2}">发布的资产</div>
            <div class="tabs-nav_primary"></div>
            <div class="btn-list">
                <div class="btn-item">
                    <x-btn @click="addVisible = true" type="primary" width="90px" height="36px" icon="&#xe613;" iconSize="14px">创建</x-btn>
                </div>
                <div class="btn-item">
                    <x-btn width="120px" height="36px" icon="&#xe684;" iconSize="14px" @click="goTransactions('')">全部交易</x-btn>
                </div>
            </div>
            
            
        </div>

        <div v-if="active == 1" class="assets-table">

            <x-table :list="assets">
                <x-table-column width="40"></x-table-column>
                <x-table-column label="名称" min-width="1" prop="assets_name"></x-table-column>
                <x-table-column label="余额" min-width="1">
                    <template slot-scope="row">
                        {{row.balance / Math.pow(10, row.decimal)}}
                    </template>
                </x-table-column>
                <x-table-column label="小数位" min-width="1" prop="decimal"></x-table-column>
                <x-table-column label="操作" width="270">
                    <template slot-scope="row">
                        <div class="btn-list">
                            <div class="btn-item">
                                <x-btn height="30px" width="60px" @click="send(row)" font-size="14px">转账</x-btn>
                            </div>
                            <div class="btn-item">
                                <x-btn height="30px" width="60px" @click="burn(row)" font-size="14px">燃烧</x-btn>
                            </div>
                            <div class="btn-item">
                                <x-btn height="30px" width="90px" @click="goTransactions(row.assetsHash)" font-size="14px">交易记录</x-btn>
                            </div>
                        </div>
                    </template>
                </x-table-column>
            </x-table>
        </div>

        <div v-if="active == 2"  class="assets-table">
            <x-table :list="publishedAssets">
                <x-table-column width="40"></x-table-column>
                <x-table-column min-width="1" label="名称" prop="name"></x-table-column>
                <x-table-column min-width="1" label="描述" prop="description"></x-table-column>
                <x-table-column min-width="1" label="发行量">
                    <template slot-scope="row">
                        {{row.total / Math.pow(10, row.decimal)}}
                    </template>
                </x-table-column>
                <x-table-column min-width="1" label="小数位" prop="decimal"></x-table-column>
                <x-table-column min-width="1" label="已燃烧">
                    <template slot-scope="row">
                        {{row.burn  / Math.pow(10, row.decimal)}}
                    </template>
                </x-table-column>
            </x-table>
        </div>

        <modal v-if="addVisible" :visible.sync="addVisible" title="创建资产" @ok="addSubmit">
            <div class="add-name"><b>名称</b></div>
            <x-input placeholder="请输入资产名称"  v-model.trim="addForm.name"></x-input>
            <div class="add-name"><b>描述</b></div>
            <x-input placeholder="请输入资产名称"  v-model.trim="addForm.desc"></x-input>
            <div class="add-name"><b>发行总量</b></div>
            <x-input placeholder="请输入发行总量"  v-model.trim="addForm.total"></x-input>
            <div class="add-name"><b>小数位</b></div>
            <x-input placeholder="请输入8以内的小数位" v-model.trim.number="addForm.decimal"></x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="add-name">支付密码</div> 
            <x-input 
                v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                v-model.trim="addForm.password" 
                type="password"
                placeholder="请输入支付密码">
            </x-input>
            <div class="add-fee">费用： {{addFee | bac}} BAC</div>
        </modal>

        <modal 
            v-if="sendVisible" 
            :visible.sync="sendVisible" 
            @ok="sendSubmit" 
            title="发送" 
            hint="请确认您发送给给正确的接收人，因为该过程是无法撤消的.">
            <div class="send-comp">
                <div class="comp-title">
                    <div class="comp-title_hd"><b>我的地址</b></div>
                    <div class="comp-title_ft">{{editAssets.balance / Math.pow(10, editAssets.decimal)}} <span>{{editAssets.assets_name}}</span></div>
                </div>
                
                <x-input :disabeld="true" v-model="account.address[0]"></x-input>
                
                <div class="comp-title">
                    <div class="comp-title_hd"><b>对方账户</b></div>
                    <div class="comp-title_ft"></div>
                </div>
                <x-input v-model="sendForm.recipientAddress" placeholder="请填写对方地址"></x-input>
                <div class="comp-title">
                    <div class="comp-title_hd"><b>数量</b></div>
                    <div class="comp-title_ft"></div>
                </div>
                <x-input v-model="sendForm.amount" placeholder="请填写数量"></x-input>
                <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="comp-title">
                    <div class="comp-title_hd"><b>密码</b></div>
                    <div class="comp-title_ft"></div>
                </div>
                <x-input v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" v-model="sendForm.password" type="password" placeholder="请输入支付密码"></x-input>
                <div class="add-fee">费用： {{sendFee | bac}} BAC</div>
            </div>
        </modal>

         <modal 
            v-if="burnVisible" 
            :visible.sync="burnVisible" 
            @ok="burnSubmit" 
            title="燃烧" 
            hint="该过程是无法撤消！">
            <div class="send-comp">
                <div class="comp-title">
                    <div class="comp-title_hd"><b>我的地址</b></div>
                    <div class="comp-title_ft">{{editAssets.balance / Math.pow(10, editAssets.decimal)}} <span>{{editAssets.assets_name}}</span></div>
                </div>
                
                <x-input :disabeld="true" v-model="account.address[0]"></x-input>
                
                <div class="comp-title">
                    <div class="comp-title_hd"><b>燃烧数量</b></div>
                    <div class="comp-title_ft"></div>
                </div>
                <x-input v-model="burnForm.amount" placeholder="请填写数量"></x-input>
                <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="comp-title">
                    <div class="comp-title_hd"><b>密码</b></div>
                    <div class="comp-title_ft"></div>
                </div>
                <x-input v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" v-model="burnForm.password" type="password" placeholder="请输入支付密码"></x-input>
                <div class="add-fee">费用： {{sendFee | bac}} BAC</div>
            </div>
        </modal>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import api from '~/js/api/index'
    import {mapState} from 'vuex'
    import Modal from '~/components/ui/Modal.vue'
    import XInput from '~/components/ui/XInput.vue'
    import sha256 from 'crypto-js/sha256'
    import Toast from '~/components/ui/toast'
    import XTable from '~/components/ui/XTable.vue'
    import XTableColumn from '~/components/ui/XTableColumn.vue'



    export default {
        data () {
            return {
                active: 1,
                assets: [],  //用户的资产
                publishedAssets:[],  //用户发布的资产
                editAssets: {},  
                sendVisible: false,
                sendFee: '',
                sendForm: {
                    recipientAddress:'',
                    amount: '',
                    password: ''
                },
                burnVisible: false,
                burnForm: {
                    amount: '',
                    password: ''
                },
                
                addVisible: false,
                addFee: 0,
                addForm: {
                    name: '',
                    desc: '',
                    total: '',
                    decimal: '',
                    password:''
                }
            }
        },
        components: {
            XBtn,
            Modal,
            XInput,
            XTable,
            XTableColumn
        },
        computed:{
            ...mapState({
                account: state => state.account,
                key: state => state.key
            }),
        },
        created () {
            api.assets.getAccountAssets([this.account.address[0]]).then(res => {
                if (res === null) return

                this.assets = res
            })

            api.assets.getAssets([this.account.address[0]]).then(res => {
                if (res === null) return
                
                this.publishedAssets = res
            })

            api.assets.getFee().then(res => {
                if (res === null) return;
                this.addFee = res
            })

            api.assets.getSendFee().then(res => {
                if (res === null) return;
                this.sendFee = res
            })
        },

        methods: {
            addSubmit () {
                const form = this.addForm

                api.assets.addAssets([form.name, form.desc, form.total * Math.pow(10, form.decimal) , form.decimal, this.key.mnemonic, form.password ? sha256(form.password).toString() : '']).then(res => {
                    if (res === null) return;
                    Toast.success('创建成功，上链后可查看')
                    this.addVisible = false
                    // this.publishedAssets.unshift(res.asset.assets)
                })
            },
            send (item) {
                this.editAssets = item
                this.sendVisible = true
            },
            burn (item) {
                this.editAssets = item
                this.burnVisible = true
            },
            sendSubmit () {
                const sendForm = this.sendForm
                api.assets.send([sendForm.amount * Math.pow(10, this.editAssets.decimal), sendForm.recipientAddress, this.key.mnemonic, this.editAssets.assetsHash, '' , sendForm.password ? sha256(sendForm.password).toString() : '']).then(res => {
                    if (res === null) return;
                    
                    Toast.success('转账成功')
                    this.sendVisible = false
                })
            },

            burnSubmit () {
                const burnForm = this.burnForm
                api.assets.burnAssets([burnForm.amount * Math.pow(10, this.editAssets.decimal), this.key.mnemonic, this.editAssets.assetsHash, '', burnForm.password ? sha256(burnForm.password).toString() : '']).then(res => {
                    if (res === null) return;

                    Toast.success('资产燃烧成功')
                    this.burnVisible = false
                })
            },

            goTransactions (hash) {
                this.$router.push({
                    name: 'assetsTransactions',
                    query:{
                        hash: hash
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .assets-index-page{
        .assets-sec{
            
        }

        .tabs-nav{
            display: flex;
            align-items: center;
            
        }

        .tabs-nav_primary{
            flex:1
        }

        .tabs-nav_item{
            width: 130px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: #9B9B9B;
            background: #F4F4F4;
            cursor: pointer;
            &.active{
                background: #fff;
                border-radius: 4px 4px 0 0;
            }
        }

        .assets-table{
            background: #fff
        }

        .table-header{
            font-size: 12px;
            color: #9B9B9B;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid  #F2F2F2;
            display: flex;
            align-items: center;
        }

        .table-cell{
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            
            color: #4A4A4A;

            &:not(:last-child){
                 border-bottom: 1px solid #F2F2F2
            }

            &:hover{
                background: #F8FCFF;
            }

            .link{
                color: #55A8FD;
            }
        }

        .table-t1{
            margin-left: 40px;
            flex: 1;
        }
        .table-t2{flex: 1}
        .table-t3{flex: 1}
        .table-t4{flex: 1}
        .table-t2-1{
            flex:1;
            margin-left: 40px;
        }
        .table-t2-2{
            flex:1
        }
        .table-t2-3{
            flex:1
        }
        .table-t2-4{
            flex:1
        }
        .table-t2-5{
            flex:1
        }
        .table-t2-6{
            flex:1;
        }

        .table-btn{
            margin-left: 10px;
            display: inline-block
        }

        .btn-list{
            display: flex;
            align-items: center
        }

        .btn-item:not(:first-child){
            margin-left: 10px;
        }

        .add-name{
            font-size: 16px;
            color: #9B9B9B;
            margin-bottom: 10px;
        }

        .add-fee{
            color: #FF7E7E;
            font-size: 14px;
        }

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
    }
</style>


