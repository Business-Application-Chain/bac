<template>
    <div class="explorer-list-page">
        <div class="tabs-nav">
            <div class="tabs-nav_item" @click="active = 1 " :class="{active: active == 1}">{{$t('LatestTransaction')}}</div>
            <div class="tabs-nav_item" @click="active = 2 " :class="{active: active == 2}">{{$t('LastestBlock')}}</div>
        </div>

        <div v-if="active == 1" class="tabs-content">
            <div class="table-header">
                <div class="tb-1">{{$t('TransactionHash')}}</div>
                <div class="tb-2">{{$t('Block')}}</div>
                <div class="tb-3">{{$t('Date')}}</div>
            </div>

            <div class="tab-list" id="tabList" :style="{maxHeight: listCssHeight}">
                <transition-group name="explorer-list" tag="div" >
                    <div v-for="item in transactionsList" :key="item.hash" class="table-cell">
                        <div class="tb-1">
                            <router-link :to="{name: 'explorerTransaction', params:{id: item.hash}}" class="link">{{item.hash}}</router-link>
                        </div>
                        <div class="tb-2">
                            <router-link :to="{name: 'explorerResult', params: {query: item.b_height}}" class="link">{{item.b_height}}</router-link>
                        </div>
                        <div class="tb-3">{{item._timeString}}</div>
                    </div>
                </transition-group>
                

                <infinite-loading v-if="transactionsHasNext" @infinite="loadTransactionsMore" spinner="waveDots"></infinite-loading>
            </div>
            
        </div>
        <div v-if="active == 2" class="tabs-content">
            <div class="table-header">
                <div class="tb-2-1">{{$t('BlockHeight')}}</div>
                <div class="tb-2-2">Hash</div>
                <div class="tb-2-3">{{$t('Transactions')}}</div>
                <div class="tb-2-4">{{$t('Date')}}</div>
            </div>

            <div class="tab-list" :style="{maxHeight: listCssHeight}">
                <transition-group name="explorer-list" tag="div">
                    <div v-for="item in blocksList" :key="item.hash" class="table-cell">
                        <div class="tb-2-1">
                            <router-link :to="{name: 'explorerResult', params: {query: item.hash}}" class="link">{{item.height}}</router-link>
                        </div>
                        <div class="tb-2-2">
                            <router-link :to="{name: 'explorerResult', params: {query: item.hash}}" class="link">{{item.hash}}</router-link>
                        </div>
                        <div class="tb-2-3">{{item.numberOfTransactions}}</div>
                        <div class="tb-2-4">{{item._timeString}}</div>
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
    import {padStart} from 'lodash'

    export default {
        data () {
            return {
                active: 1,
                blocksList: [],
                transactionsList: [],
                listCssHeight: 'auto',
                blocksHasNext: false,
                transactionsHasNext: false,
                now: Date.now()
            }
        },
        mounted () {
            const $list = document.querySelector('#tabList')
            const top = $list.getBoundingClientRect().y
            const height = document.body.clientHeight
            
            this.listCssHeight = height - top - 30 + 'px'  //30是右边主体的边距

            const trans = api.transactions.allTransactions([0, 50]).then(res => {
                if (res === null) return;

                if (res.length == 50) {
                    this.transactionsHasNext = true
                } else {
                    this.transactionsHasNext = false
                }
                
                this.transactionsList = res
            })

            const blocks = api.blocks.blocks([0, 50]).then(res => {
                if (res === null) return;
                if (res.length == 50) {
                    this.blocksHasNext = true
                } else {
                    this.blocksHasNext = false
                }
                this.blocksList = res
            })

            Promise.all([trans, blocks]).then(res => {
                ws.add(({mod, name, data}) => {
                    if (mod == 'blocks' && name == 'block') {
                        //去重
                        if (this.blocksList[0].hash != data.hash) {
                            this.blocksList.unshift(data)
                        }
                    }
                })
            })

           setInterval(()=>{
               this.now = Date.now()
           }, 1000)
        },

        components: {
            InfiniteLoading
        },

        watch: {
            now (newVal) {
                this.transactionsList.forEach(item => {
                    this.$set(item, '_timeString', this.timeFormat(item.timestamp, newVal))
                })
                
                this.blocksList.forEach(item => {
                    this.$set(item, '_timeString', this.timeFormat(item.timestamp, newVal))
                })
            }
        },

        methods: {
            timeFormat (timestamp, now) {
                const t = now - timestamp

                if (t < 0) {
                    return `0${this.$t('Seconds')}${this.$t('ago')}`
                }else if (t < 10 * 60 * 1000) {  //如果小于10分钟
                    let m = Math.floor(t / 60 / 1000)
                    let s = padStart(Math.floor((t - m * 60 * 1000) / 1000), 2, '0')
                    if (m > 0) {
                        m = padStart(m, 2, '0')
                        return `${m} ${this.$t('Minutes')} ${s} ${this.$t('Seconds')} ${this.$t('ago')}`
                    }else {
                        return `${s} ${this.$t('Seconds')} ${this.$t('ago')}`
                    }
                    
                } else {
                    const date = new Date(timestamp)
                    const YYYY = date.getFullYear()
                    const MM = padStart(date.getMonth() + 1, 2, '0')
                    const DD = padStart(date.getDate(), 2, '0')
                    const hh = padStart(date.getHours(), 2, '0')
                    const mm = padStart(date.getMinutes(), 2, '0')
                    const ss = padStart(date.getSeconds(), 2, '0')

                    return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`
                }

            },
            loadBlocksMore ($state) {
                api.blocks.blocks([this.blocksList[this.blocksList.length - 1].b_height, 50]).then(res => {
                    if (res === null) return;
                    if (res.length == 50) {
                        $state.loaded()
                    } else {
                        $state.complete()
                        this.blocksHasNext = false
                    }
                    this.blocksList = [...this.blocksList, ...res]
                    
                })
            },

            loadTransactionsMore ($state) {
                api.transactions.allTransactions([this.transactionsList[this.transactionsList.length - 1].height, 50]).then(res => {
                    if (res === null) return;
                    if (res.length == 50) {
                        $state.loaded()
                    } else {
                        $state.complete()
                        this.transactionsHasNext = false
                    }
                    this.transactionsList = [...this.transactionsList, ...res]
                    
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/css/utils.scss";

    .explorer-list-page{
        .tabs-nav{
            display: flex;
            align-items: center;
            
        }

        .tabs-nav_item{
            min-width: 130px;
            padding: 0 20px;
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
            
            @include text-overflow();
        }

        .tb-2{
            flex:1;
            margin-left: 40px;
        }

        .tb-3{
            flex: 1;
            margin-left: 40px;
        }

        .tb-2-1{
            flex: 1;
            margin-left: 40px;
        }

        .tb-2-2{
            flex: 2;
            margin-left: 40px;
            @include text-overflow();
        }

        .tb-2-3{
            flex: 1;
            margin-left: 40px;
        }
        .tb-2-4{
            flex:1 
        }

        .tab-list{
            overflow: auto
        }
    }
</style>

