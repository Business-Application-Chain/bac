<template>
    <div class="dapp-index-page">
        <div class="btn-sec">
            <div class="btn-sec_hd">
                <search-bar @submit="search" v-model.trim="searchTxt"></search-bar>
            </div>
            <div class="btn-sec_ft">
                <x-btn icon="&#xe613;" @click.native="$router.push({name: 'createDapp'})" icon-size="16px" height="50px" type="primary">创建合约</x-btn>
            </div>
        </div>
        <div class="tabs-nav">
            <tabs v-model="tabActive">
                <tabs-pane label="全部" name="all">
                    <x-table :list="allList">
                        <x-table-column width="40"></x-table-column>
                        <x-table-column min-width="1" label="名称">
                            <template slot-scope="scope">
                                <router-link :to="{name: 'dappDetail', params:{hash: scope.hash}}" class="link">{{scope.symbol}} ({{scope.name}})</router-link>
                            </template>
                        </x-table-column>
                        <x-table-column min-width="3" prop="hash" label="hash">
                            <template slot-scope="scope">
                                <router-link :to="{name: 'dappDetail', params:{hash: scope.hash}}" class="link">{{scope.hash}}</router-link>
                            </template>
                        </x-table-column>
                        
                        <x-table-column min-width="1" prop="decimals" label="小数位"></x-table-column>
                        <x-table-column min-width="1" prop="totalAmount" label="总量">
                            <template slot-scope="scope">
                                {{parseInt(scope.totalAmount)}}
                            </template>
                        </x-table-column>
                        <x-table-column min-width="3" prop="accountId" label="创建者"></x-table-column>
                    </x-table>
                </tabs-pane>
                <tabs-pane label="我的" name="my">
                    <x-table :list="myList">
                        <x-table-column width="40"></x-table-column>
                        <x-table-column min-width="1" label="名称">
                            <template slot-scope="scope">
                                {{scope.symbol}} ({{scope.name}})
                            </template>
                        </x-table-column>
                        <x-table-column min-width="2" prop="hash" label="hash"></x-table-column>
                        <x-table-column min-width="1" prop="decimals" label="小数位"></x-table-column>
                        <x-table-column min-width="1" prop="totalAmount" label="总量">
                            <template slot-scope="scope">
                                {{parseInt(scope.totalAmount)}}
                            </template>
                        </x-table-column>
                    </x-table>
                </tabs-pane>
            </tabs>
        </div>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import Tabs from '~/components/ui/Tabs.vue'
    import TabsPane from '~/components/ui/TabsPane.vue'
    import XTable from '~/components/ui/XTable.vue'
    import XTableColumn from '~/components/ui/XTableColumn.vue'
    import SearchBar from '~/components/ui/SearchBar.vue'
    import Toast from '~/components/ui/toast'
    import {mapState} from 'vuex'

    import api from '~/js/api'

    export default {
        data () {
            return {
                tabActive: 'all',
                allList: [],
                myList: [],
                isActive: false,
                searchTxt: '',
            }
        },

        created() {
            this.fetchAll()
            this.fetchMy()
        },

        computed :{
            ...mapState({
                account: state => state.account,
                key: state => state.key
            })
        },

        components: {
            XBtn,
            Tabs,
            TabsPane,
            XTable,
            XTableColumn,
            SearchBar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        },

        methods: {
            async fetchAll () {
                const list = await api.dapp.searchDappList()
                if (list === null) return;
                this.allList = list
            },

            async fetchMy () {
                const list = await api.dapp.searchMineList([this.key.mnemonic])
                if (list === null) return;
                this.myList = list
            },

            async search (txt) {
                const res = await api.dapp.searchDappHash([txt])
                if (res === null) return;
                if (res.length === 0) {
                    Toast.warn('没有搜到对应的结果')
                    return 
                }
                this.$router.push({name: 'dappDetail', params:{hash: res[0].hash}})
            },

            createSubmit () {
                console.log('submit')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dapp-index-page {
        .btn-sec{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .btn-sec_hd{
            flex: 1;
            margin-right: 20px;
        }

        .modal-label{
            font-size: 16px;
            color: #9B9B9B;
            margin-bottom: 15px;
        }
        
        .modal-fee{
            color: #FF7E7E;
            font-size: 14px;
        }

       
    }
</style>

