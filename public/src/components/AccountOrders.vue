<template>
    <div class="account-orders-comp">
        <template v-if="count > 0">
            <orders :list="list"></orders>
            <div v-if="pageCount < 2" class="single-page">{{$t('Nomore')}}</div>
            <pagination v-else :currentPage.sync="curPage" :page-count="pageCount" @currentChange="orderChage"></pagination>
        </template>
        <div v-else class="empty-sec">
            <img class="empty-sec_img" src="../assets/images/none_order.png" />
            <div class="empty-sec_hint">{{$t('Notransaction')}}</div>
        </div>
    </div>
</template>

<script>
    import Pagination from './ui/Pagination.vue'
    import Orders from './Orders.vue'
    import api from '../js/api/index'
    
    export default {
        data () {
            return {
                curPage: 1,
                count: 10,
                list: [],
            }
        },
        props: {
            address: {
                default: ''
            }
        },
        computed: {
            pageCount () {
                return Math.ceil(this.count / 10 )
            },
        },
        components: {
            Pagination,
            Orders
        },
        created () {
            this.getOrders()
        },
        methods: {
            getOrders () {
                api.transactions.transactions([this.address, this.curPage, 10]).then(res => {
                    if (res === null) return;

                    this.list = res.data
                    this.count = res.count
                })
            },
            orderChage (newPage) {
                this.getOrders()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .account-orders-comp{
        .empty-sec{
            margin-top: 96px;
            text-align: center;
        }

        .empty-sec_img{
            width: 100px;
            height: 124px;
        }

        .empty-sec_hint{
            margin-top: 20px;
            font-size: 16px;
            color: #4A4A4A;
        }

        .single-page{
            font-size: 12px;
            color: #9B9B9B;
            margin-top: 20px;
            margin-bottom: 18px;
            text-align: center;
        }
    }
</style>

