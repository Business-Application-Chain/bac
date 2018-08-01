<template>
    <div class="explorer-result-page">
        <div class="sec">
            <div class="sec-header">交易详情</div>

            <div class="page-desc">
                <div class="desc-item">
                    <div class="desc-item_hd">哈希</div>
                    <div class="desc-item_ft">{{result.payloadHash}}</div>
                </div>
                <div class="desc-item">
                    <div class="desc-item_hd">区块</div>
                    <div class="desc-item_ft">{{result.height}}</div>
                </div>
                
                <div class="desc-item">
                    <div class="desc-item_hd">确认数</div>
                    <div class="desc-item_ft">{{result.confirmations || 0}}</div>
                </div>
            </div>
        </div>
            

        <div class="table">
            <div class="table-header">
                <div class="table-5">交易HASH</div>
                <div class="table-1">发送地址</div>
                <div class="table-2"></div>
                <div class="table-3">接收地址</div>
                <div class="table-4">数量/手续费（BAC）</div>
            </div>
        
            <div v-for="item in result.transactions" :key="item.hash" class="table-cell">
                <div class="table-5">{{item.hash}}</div>
                <div class="table-1">
                    <router-link :to="{name: 'contactDetail', params:{id: item.senderId}}" class="link">{{item.senderId}}</router-link>
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
    import api from '../../js/api/index.js'
    
    export default {
        data () {
            return {
                result: {}
            }
        },
        watch :{
            '$route': 'search'
        },
        created () {
            this.search()
        },

        methods: {
            search () {
                api.blocks.block([this.$route.params.query]).then(res => {
                    if(res === null) return;
                    
                    this.result = res
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/css/utils.scss";

    .explorer-result-page{
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
