<template>
    <div class="explorer-transaction-page">
        <div class="table">
            <div class="table-header">
                <div class="table-5">{{$t('Transactions')}} Hash</div>
                <div class="table-1">{{$t('Sender')}}</div>
                <div class="table-2"></div>
                <div class="table-3">{{$t('Recipient')}}</div>
                <div class="table-4">{{$t('Quantity')}}/{{$t('Fee')}}（BAC）</div>
            </div>
        
            <div class="table-cell">
                <div class="table-5">{{res.hash}}</div>
                <div class="table-1">
                    <router-link :to="{name: 'contactDetail', params:{id: res.senderId}}" class="link">{{res.senderId}}</router-link>
                </div>
                <div class="table-2">
                    <i class="iconfont arrow-icon">&#xe610;</i>
                </div>
                <div class="table-3">
                    
                    <router-link v-if="res.recipientId" :to="{name: 'contactDetail', params:{id: res.recipientId}}" class="link">{{res.recipientId}}</router-link>
                    <div v-else>-</div>
                    
                </div>
                <div class="table-4">
                    {{res.amount | bac}} / {{res.fee | bac}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '~/js/api'
    
    export default {
        data () {
            return {
                res: {}
            }
        },

        created () {
            this.search()
        },

        methods: {
            search () {
                api.transactions.transaction([this.$route.params.id]).then(res => {
                    if(res === null) return;
                    
                    this.res = res
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/css/utils.scss";

    .explorer-transaction-page{
        padding-bottom: 40px;
        .page-desc{
            margin-top: 31px;
            margin-bottom: 8px;
            overflow: hidden;
        }

        .desc-item{
            display: flex;
            align-items: center;
            line-height: 1;
            margin-bottom: 23px;
        }

        .desc-item_hd{
            font-size: 14px;
            color: #9B9B9B;
            width: 160px;
            margin-left: 30px;
        }
        .desc-item_ft{
            font-size: 14px;
            color: #4A4A4A;
            flex: 1
        }

        .page-result {
            margin: 0 30px;
            border-top:1px solid #F2F2F2;
            display: flex;

            font-size: 14px;
            color: #4A4A4A;
            padding-top: 30px;
        }

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
            flex: 1;
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
