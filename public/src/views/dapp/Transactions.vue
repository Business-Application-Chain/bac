<template>
    <div class="dapp-transactions-page">

        <div class="sec">
            <x-table :list="list">
                <x-table-column width="40"></x-table-column>
                <x-table-column label="交易HASH" prop="hash" min-width="3">
                    <template slot-scope="row">
                        <div class="text-overflow">
                            <router-link :to="{name: 'explorerTransaction', params:{id: row.hash}}" class="comp-link" >{{row.hash}}</router-link>
                        </div>
                    </template>
                </x-table-column>
                <x-table-column label="发送者" prop="senderId" min-width="2">
                    <template slot-scope="row">
                        <div class="text-overflow">
                            <router-link :to="{name: 'contactDetail', params:{id: row.senderId}}" class="comp-link" replace>{{row.senderId}}</router-link>
                        </div>
                    </template>
                </x-table-column>
                <x-table-column label="接受者" prop="recipientId" min-width="2">
                    <template slot-scope="row">
                        <div class="text-overflow">
                            <router-link v-if="row.recipientId" :to="{name: 'contactDetail', params:{id: row.recipientId}}" class="comp-link" replace>{{row.recipientId}}</router-link>
                            <div v-else>-</div>
                        </div>
                    </template>
                </x-table-column>
                <x-table-column label="日期"  width="100">
                    <template slot-scope="row">
                        {{row.timestamp | date}}
                    </template>
                </x-table-column>
                <x-table-column label="金额/手续费" min-width="2">
                    <template slot-scope="row">
                        <status-tag :type="row.senderType"></status-tag>
                        {{row.amount | coin(row.decimal)}} / {{row.fee | bac}}
                    </template>
                </x-table-column>
            </x-table>
        </div>

        <pagination :pageCount="pageCount" :currentPage.sync="curPage"></pagination> 
    </div>
</template>

<script>
    import api from '~/js/api'
    import {mapState} from 'vuex'
    import XBtn from '~/components/ui/XBtn.vue'
    import XTable from '~/components/ui/XTable.vue'
    import XTableColumn from '~/components/ui/XTableColumn.vue'
    import Pagination from '~/components/ui/Pagination.vue'
    import Orders from '~/components/Orders.vue'
    import StatusTag from '~/components/StatusTag.vue'
    

    export default {
        data () {
            return {
                hash: this.$route.query.hash,
                curPage: 1,
                pageSize: 10,
                count: 0,
                list: []
            }
        },
        
        computed: {
            ...mapState(['account', 'key']),
            pageCount () {
                return Math.ceil(this.count / this.pageSize)
            }
        },
        components: {
            XBtn,
            Pagination,
            Orders,
            XTable,
            XTableColumn,
            StatusTag
        },
        created () {
            api.dapp.getTransfers([this.account.address[0], this.hash, this.curPage, this.pageSize]).then(res => {
                if (res === null) return;
                res.data.forEach(item => {
                    
                })
                this.list = res.data
                this.count = res.count
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/css/utils.scss";
    .dapp-transactions-page{
        
        .arrow-icon{
            font-size: 10px;
            color: #d8d8d8
        }

        .comp-link{
            color: #4A90E2;
            cursor: pointer;
        }

        .comp-primary{
            color: #F5A623;
        }

        .link{
            color: #55A8FD;
        }

        .text-overflow{
            @include text-overflow()
        }
    }
</style>

