<template>
    <div class="dapp-detail-page">
        <div class="sec">
            <div class="sec-header">
                <div class="sec-header_hd">
                    合约详情
                </div>
                <div class="sec-header_ft">
                    
                </div>
            </div>

            <div class="main-cell">
                <div class="main-cell_body">
                    <div class="main-cell_id">
                        <div class="main-title">名称</div>
                        <div class="main-primary">{{info.name}} / {{info.symbol}} </div>
                    </div>
                    <div class="main-cell_id">
                        <div class="main-title">发行总量</div>
                        <div class="main-primary">{{info.totalAmount}} </div>
                    </div>
                    <div class="main-cell_id">
                        <div class="main-title">持有人</div>
                        <div class="main-primary">{{info.accountId}} </div>
                    </div>
                </div>

                <div class="main-cell_body">
                    <div class="main-cell_id">
                        <div class="main-title">Hash</div>
                        <div class="main-primary">{{info.hash}} </div>
                    </div>
                    <div class="main-cell_id">
                        <div class="main-title">小数位</div>
                        <div class="main-primary">{{info.decimals}} </div>
                    </div>
                    <div class="main-cell_id">
                        <div class="main-title">创建时间</div>
                        <div class="main-primary">{{info._createDate}} </div>
                    </div>
                </div>
            </div>

            <div class="action-cell">
                <div class="main-cell_id">
                    <div class="main-title">执行合约</div>
                    <div class="main-primary">
                        <x-select width="300px" v-model="dappFunc">
                            <x-option v-for="(item, index) in info._abi" :key="index" @change="selectedFunc = item" :label="item.method" :value="item.method"></x-option>
                        </x-select>
                    </div>
                </div>
                <div class="main-cell_id" v-if="selectedFunc.params && selectedFunc.params.length">
                    <div class="main-title">参数</div>
                    <div class="main-primary">
                        <div class="main-primary_item" v-for="(item, index) in selectedFunc.params" :key="index">
                            <x-input :placeholder="item" v-model="dappParams[index]"  type="text" :no-error="true"></x-input>
                        </div>
                    </div>
                </div>

                <div class="main-cell_id">
                    <div class="main-title" v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" >支付密码</div>
                    <div class="main-primary">
                        <div class="password-wrapper">
                            <x-input 
                                v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                                v-model.trim="password" 
                                type="password"
                                placeholder="请输入支付密码"
                            
                                :no-error="true">
                            </x-input>
                        </div>
                    </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title">所需费用</div>
                    <div class="main-primary">
                        {{fee | bac}} BAC
                    </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title"></div>
                    <div class="main-primary">
                        <x-btn @click="dappHandle" type="primary">提交</x-btn>
                    </div>
                </div>

                
            </div>
        </div>

        <tabs v-model="active">
            <tabs-pane label="操作记录" name="1">
                <x-table v-if="transactionList.length > 0" :list="transactionList">
                    <x-table-column width="40"></x-table-column>
                    <x-table-column prop="_createDate" label="日期" min-width="180"></x-table-column>
                    <x-table-column prop="transactionHash" label="Hash" min-width="510"></x-table-column>
                    <x-table-column prop="accountId" label="调用者" min-width="300"></x-table-column>
                    <x-table-column prop="fun" label="执行函数" min-width="180"></x-table-column>
                    <x-table-column label="结果" min-width="100">
                        <template slot-scope="scope">
                            {{scope.dealResult == 0 ? '成功' : '失败'}}
                        </template>
                    </x-table-column>
                </x-table>
                <Pagination  v-if="transactionList.length > 0" :current-page="transactionCurPage" :page-count="transactionPageCount" @currentChange="fetchTrans" />

                <div v-if="transactionList.length == 0" class="empty-sec">
                    
                    <div class="empty-sec_hint">暂无操作记录</div>
                </div>
            </tabs-pane>
            <tabs-pane label="abi" name="2">
                <vue-json-pretty
                    
                    :data="info._abiJson"
                    >
                </vue-json-pretty>

            </tabs-pane>
        </tabs>
    </div>
</template>

<script>
    import api from '~/js/api'
    import Tabs from '~/components/ui/Tabs.vue'
    import TabsPane from '~/components/ui/TabsPane.vue'
    import XTable from '~/components/ui/XTable.vue'
    import XTableColumn from '~/components/ui/XTableColumn.vue'
    import Pagination from '~/components/ui/Pagination.vue'
    import VueJsonPretty from 'vue-json-pretty'
    import XSelect from '~/components/ui/XSelect.vue'
    import XOption from '~/components/ui/XOption.vue'
    import XInput from '~/components/ui/XInput.vue'
    import XBtn from '~/components/ui/XBtn.vue'
    import {mapState} from 'vuex'
    import sha256 from 'crypto-js/sha256'
    import Toast from '~/components/ui/toast'

    export default {
        data () {
            return {
                hash:this.$route.params.hash,
                info:{},
                active: '1',
                transactionList: [],
                transactionCurPage: 1,
                transactionPageCount: 1,
                transactionPageSize:10,
                dappFunc: '',
                selectedFunc: {},
                handleFuncLoading: false,
                password: '',
                fee: 0
            }
        },

        computed:{
            ...mapState({
                account: state => state.account,
                key: state => state.key
            }),
            dappParams () {
                return this.selectedFunc.params.map(item => '')
            }
        },
        components: {
            Tabs,
            TabsPane,
            XTable,
            XTableColumn,
            VueJsonPretty,
            Pagination,
            XSelect,
            XOption,
            XInput,
            XBtn
        },
        created () {
            this.fetchInfo()    
            this.fetchTrans()
            this.getHandleDappFee()
        },

    

        methods: {
            async fetchTrans () {
                const res = await api.dapp.searchDappHandle([this.hash, '', '', this.transactionCurPage, this.transactionPageSize ])
                if (res === null) return;

                res.data.forEach(item => {
                    item._createDate = new Date(item.timestamp).toLocaleString()
                })

                this.transactionList = res.data;
                this.transactionPageCount = Math.ceil(res.totalCount / this.transactionPageSize)
            },

            async fetchInfo () {
                const res = await api.dapp.getDappInfo([this.hash])
                if (res === null) return;
                
                res._createDate = new Date(res.createTime).toLocaleString()
                const arr = JSON.parse(res.abi)
                res._abiJson = []
                res._abi = []
                
                arr.forEach(item => {
                    if (item.type == 'method') {
                        res._abiJson.push({
                            method: `${item.name}(${item.inputs.join(',')})` 
                        })

                        if (item.name != 'init'){
                            res._abi.push({
                                method: item.name,
                                params: item.inputs
                            })
                        }
                        
                    }
                })
                
                this.info = res
            },
            
            async dappHandle () {
                this.handleFuncLoading = true
                const res = await api.dapp.handleDapp([this.key.mnemonic, this.hash, this.dappFunc, this.dappParams, sha256(this.password).toString()])
                if (res === null) return;
                Toast.success('执行成功')
            },

            async getHandleDappFee () {
                const res = await api.dapp.getHandleDappFee()
                if (res === null) return;
                this.fee = res
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dapp-detail-page{
        .main-cell{
            border-bottom: 1px solid #F2F2F2;
            padding: 30px 0;
            display: flex;
            align-items: center
        }

        .main-cell_body{
            flex: 1
        }

        .main-title{
            font-size: 14px;
            color: #9B9B9B;
            width: 100px;
            text-align: right
        }

        .main-primary{
            font-size: 16px;
            color: #4A4A4A;
            margin-left: 30px;
        }

        .main-primary_item{
            display: inline-block;
            vertical-align: middle
        }

        .main-cell_id{
            display: flex;
            align-items: center;
            &:not(:first-child){
                margin-top: 15px
            }
        }

         .empty-sec{
            padding: 50px 0;
            text-align: center;
        }

        .empty-sec_img{
            width: 100px;
            height: 124px;
        }

        .empty-sec_hint{
            margin-top: 20px;
            font-size: 16px;
            color: #dedede;
        }
        .action-cell{
            margin-bottom: 40px;
            
            padding: 20px 0
        }

        .password-wrapper{
            width: 300px
        }

    }
</style>

