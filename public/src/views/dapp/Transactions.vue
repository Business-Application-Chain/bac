<template>
    <div class="dapp-transactions-page">

        <div class="sec">
            
            <div><orders :list="list"></orders></div>
        </div>
        <pagination :pageCount="pageCount" :currentPage.sync="curPage"></pagination>

        <div style="display:none" class="table">
            <div class="table-header">
                <div class="table-5">交易HASH</div>
                <div class="table-1">发送地址</div>
                <div class="table-2"></div>
                <div class="table-3">接收地址</div>
                <div class="table-4">数量/手续费（BAC）</div>
            </div>
        
            <div v-for="item in list" :key="item.transactionHash" class="table-cell">
                <div class="table-5">
                    <router-link :to="{name: 'explorerTransaction', params:{id: item.transactionHash}}" class="link">{{item.transactionHash}}</router-link>
                </div>
                <div class="table-1">
                    <router-link :to="{name: 'contactDetail', params:{id: item.accountId}}" class="link">{{item.accountId}}</router-link>
                </div>
                <div class="table-2">
                    <i class="iconfont arrow-icon">&#xe610;</i>
                </div>
                <div class="table-3">
                    
                    <router-link v-if="item.recipientId" :to="{name: 'contactDetail', params:{id: item.recipientId}}" class="link">{{item.recipientId}}</router-link>
                    <div v-else>-</div>
                    
                </div>
                <div class="table-4">
                    {{item.amount | bac}} / {{item.fee | bac}}
                </div>
            </div>
        </div>
        
        
    </div>
</template>

<script>
    import api from '~/js/api'
    import {mapState} from 'vuex'
    import XBtn from '~/components/ui/XBtn.vue'
    import Pagination from '~/components/ui/Pagination.vue'
    import Orders from '~/components/Orders.vue'

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
            Orders
        },
        created () {
            api.dapp.getTransfers([this.account.address[0], this.hash, this.curPage, this.pageSize]).then(res => {
                if (res === null) return;
                this.list = res.data
                this.count = res.count
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/css/utils.scss";
    .dapp-transactions-page{
         .table {
            background: #fff;
            border-radius: 4px;
            margin-top: 10px;
        }

        .table-header {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: 12px;
            color: #9B9B9B;
            border-bottom: 1px solid  #F2F2F2;
        }

        .table-cell{
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4A4A4A;
            border-bottom: 1px solid  #F2F2F2;
            &:hover{
                background: #F8FCFF;
            }
        }

        .arrow-icon{
            font-size: 10px;
            color: #d8d8d8
        }

        .table-5{
            margin-left: 30px;
            flex: 2;
            @include text-overflow();
        }

        .table-1{
            margin-left: 30px;
            flex: 1;
            @include text-overflow();
        }

        .table-2{
            margin-left: 30px;
            width: 10px;
        }

        .table-3{
            margin-left: 30px;
            flex: 1;
            @include text-overflow();
        }

        .table-4{
            margin-left: 30px;
            width: 230px;
        }

        .link{
            color: #55A8FD;
        }
    }
</style>

