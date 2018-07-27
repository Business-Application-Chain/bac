<template>
    <div class="explorer-list-page">
        <div class="tabs-nav">
            <div class="tabs-nav_item" @click="active = 1 " :class="{active: active == 1}">最新交易</div>
            <div class="tabs-nav_item" @click="active = 2 " :class="{active: active == 2}">最新区块</div>
        </div>

        <div v-if="active == 1" class="tabs-content">
            <div class="table-header">
                <div class="tb-1">交易ID</div>
                <div class="tb-2">区块</div>
                <div class="tb-3">时间</div>
            </div>

            <div class="tab-list" id="tabList" :style="{maxHeight: listCssHeight}">
                <transition-group name="explorer-list" tag="div" mode="out-in">
                    <div v-for="item in transactionsList" :key="item.t_id" class="table-cell">
                        <div class="tb-1">
                            <div>{{item.t_id}}</div>
                        </div>
                        <div class="tb-2">
                            <router-link :to="{name: 'explorerResult', params: {query: item.b_height}}" class="link">{{item.b_height}}</router-link>
                        </div>
                        <div class="tb-3">{{item.t_timestamp}}</div>
                    </div>
                </transition-group>
                

                <infinite-loading v-if="transactionsHasNext" @infinite="loadTransactionsMore" spinner="waveDots"></infinite-loading>
            </div>
            
        </div>
        <div v-if="active == 2" class="tabs-content">
            <div class="table-header">
                <div class="tb-2-1">区块高度</div>
                <div class="tb-2-2">区块ID</div>
                <div class="tb-2-3">交易数量</div>
                <div class="tb-2-4">时间</div>
            </div>

            <div class="tab-list" :style="{maxHeight: listCssHeight}">
                <transition-group name="explorer-list" tag="div" mode="out-in">
                    <div v-for="item in blocksList" :key="item.id" class="table-cell">
                        <div class="tb-2-1">
                            <router-link :to="{name: 'explorerResult', params: {query: item.height}}" class="link">{{item.height}}</router-link>
                        </div>
                        <div class="tb-2-2">
                            <router-link :to="{name: 'explorerResult', params: {query: item.height}}" class="link">{{item.id}}</router-link>
                        </div>
                        <div class="tb-2-3">{{item.numberOfTransactions}}</div>
                        <div class="tb-2-4">{{item.timestamp}}</div>
                    </div>
                </transition-group>

                <infinite-loading v-if="blocksHasNext" @infinite="loadBlocksMore" spinner="waveDots"></infinite-loading>
            </div>
                
        </div>
    </div>
</template>

<script>
    import api from '~/js/api/index.js'
    import InfiniteLoading from 'vue-infinite-loading'
    import ws from '~/js/plugins/ws'

    export default {
        data () {
            return {
                active: 1,
                blocksList: [],
                transactionsList: [],
                listCssHeight: 'auto',
                blocksHasNext: false,
                transactionsHasNext: false
            }
        },
        mounted () {
            const $list = document.querySelector('#tabList')
            const top = $list.getBoundingClientRect().y
            const height = document.body.clientHeight
            
            this.listCssHeight = height - top - 30 + 'px'  //30是右边主体的边距
            

            const trans = api.transactions.allTransactions([0, 50]).then(res => {
                if (res === null) return;
                
                this.transactionsList = res
            })

            const blocks = api.blocks.blocks([0, 50]).then(res => {
                if (res === null) return;
                if (res.length == 50) {
                    this.blocksHasNext = true
                }
                this.blocksList = res
            })

            Promise.all([trans, blocks]).then(res => {
                ws.add(({mod, name, data}) => {
                    if (mod == 'blocks' && name == 'block') {
                        //去重
                        if (this.blocksList[0].id != data.id) {
                            this.blocksList.unshift(data)
                        }
                    }
                })
            })
        },

        components: {
            InfiniteLoading
        },

        methods: {
            loadBlocksMore ($state) {
                api.blocks.blocks([this.blocksList[this.blocksList.length - 1].height, 50]).then(res => {
                    if (res === null) return;
                    if (res.length == 50) {
                        $state.loaded()
                    } else {
                        $state.complete()
                    }
                    this.blocksList = [...this.blocksList, ...res]
                    
                })
            },

            loadTransactionsMore ($state) {
                api.blocks.blocks([this.transactionsList[this.transactionsList.length - 1].height, 50]).then(res => {
                    if (res === null) return;
                    if (res.length == 50) {
                        $state.loaded()
                    } else {
                        $state.complete()
                    }
                    this.transactionsList = [...this.transactionsList, ...res]
                    
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .explorer-list-page{
        .tabs-nav{
            display: flex;
            align-items: center;
            
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

        .tabs-content{
            background: #fff;
            border-radius: 0 4px 4px 4px;
        }

        .table-header{
            height: 40px;
            line-height: 40px;
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #9B9B9B;
            border-bottom: 1px solid #F2F2F2
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

        .tb-1{
            flex: 2;
            margin-left: 40px;
        }

        .tb-2{
            flex:2
        }

        .tb-3{
            flex: 1
        }

        .tb-2-1{
            flex: 1;
            margin-left: 40px;
        }

        .tb-2-2{
            flex: 1
        }

        .tb-2-3{
            flex: 1
        }
        .tb-2-4{
            width: 125px;
        }

        .tab-list{
            overflow: auto
        }
    }
</style>

