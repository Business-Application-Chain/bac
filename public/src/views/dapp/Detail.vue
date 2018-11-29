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
                <div class="main-cell_id">
                    <div class="main-title">名称</div>
                    <div class="main-primary">{{info.name}} </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title">符号</div>
                    <div class="main-primary">{{info.symbol}} </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title">Hash</div>
                    <div class="main-primary">{{info.hash}} </div>
                </div>
                

                <div class="main-cell_id">
                    <div class="main-title">发行总量</div>
                    <div class="main-primary">{{info.totalAmount}} </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title">小数位</div>
                    <div class="main-primary">{{info.decimals}} </div>
                </div>

                <div class="main-cell_id">
                    <div class="main-title">持有人</div>
                    <div class="main-primary">{{info.accountId}} </div>
                </div>
                <div class="main-cell_id">
                    <div class="main-title">创建时间</div>
                    <div class="main-primary">{{info._createDate}} </div>
                </div>
            </div>
        </div>

        <tabs v-model="active">
            <tabs-pane label="操作记录" name="1">
                <x-table :list="transactionList">
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
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        data () {
            return {
                hash:this.$route.params.hash,
                info:{},
                active: '1',
                transactionList: []
            }
        },
        components: {
            Tabs,
            TabsPane,
            XTable,
            XTableColumn,
            VueJsonPretty
        },
        created () {
            this.fetchInfo()    
            this.fetchTrans()
        },

        methods: {
            async fetchTrans () {
                const res = await api.dapp.searchDappHandle([this.hash])
                if (res === null) return;
                res.forEach(item => {
                    item._createDate = new Date(item.timestamp).toLocaleString()
                })
                this.transactionList = res;
            },

            async fetchInfo () {
                const res = await api.dapp.getDappInfo([this.hash])
                if (res === null) return;
                
                res._createDate = new Date(res.createTime).toLocaleString()
                const arr = JSON.parse(res.abi)
                res._abiJson = []
                
                arr.forEach(item => {
                    if (item.type == 'method') {
                        res._abiJson.push({
                            method: `${item.name}(${item.inputs.join(',')})` 
                        })
                    }
                })
                
                this.info = res
                
                console.log(res.abi)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dapp-detail-page{
        .main-cell{
            border-bottom: 1px solid #F2F2F2;
            margin-bottom: 20px;
            padding: 30px 0
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

        .main-cell_id{
            display: flex;
            align-items: center;
            &:not(:first-child){
                margin-top: 15px
            }
        }
    }
</style>

