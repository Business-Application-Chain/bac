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
                    <pagination :current-page="allCurPage" :page-count="allPageCount" @currentPage="fetchAll"></pagination>
                </tabs-pane>
                <tabs-pane label="我的" name="my">
                    <x-table :list="myList">
                        <x-table-column width="40"></x-table-column>
                        <x-table-column min-width="1" label="名称">
                            <template slot-scope="scope">
                                <router-link :to="{name: 'dappDetail', params:{hash: scope.hash}}" class="link">{{scope.symbol}} ({{scope.name}})</router-link>
                            </template>
                        </x-table-column>
                        <x-table-column min-width="3" label="hash">
                            <template slot-scope="scope">
                                <router-link :to="{name: 'dappDetail', params:{hash: scope.hash}}" class="link">{{scope.dappHash}}</router-link>
                            </template>
                        </x-table-column>
                        
                        <x-table-column min-width="1" prop="decimals" label="小数位"></x-table-column>
                        <x-table-column min-width="1" prop="totalAmount" label="余额">
                            <template slot-scope="scope">
                                {{scope._balance}}
                            </template>
                        </x-table-column>
                        <x-table-column min-width="3" prop="accountId" label="创建者"></x-table-column>
                    </x-table>
                </tabs-pane>
                <tabs-pane label="我创建的" name="owner">
                    <x-table :list="ownerList">
                        <x-table-column width="40"></x-table-column>
                        <x-table-column min-width="1" label="名称">
                            <template slot-scope="scope">
                                <router-link :to="{name: 'dappDetail', params:{hash: scope.hash}}" class="link">{{scope.symbol}} ({{scope.name}})</router-link>
                            </template>
                        </x-table-column>
                        <x-table-column min-width="2" prop="hash" label="hash">
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
                        <x-table-column label="操作" min-width="1">
                            <template slot-scope="scope">
                                <x-btn height="35px" font-size="14px" @click="transferDapp(scope)">合约转让</x-btn>
                            </template>
                        </x-table-column>
                    </x-table>

                    <pagination :current-page="ownerCurPage" :page-count="ownerPageCount" @currentPage="fetchOwner"></pagination>
                </tabs-pane>
            </tabs>
        </div>

        <modal 
            v-if="transferVisible"
            :visible.sync="transferVisible"
            title="转让合约"
            hint="转让合约需要手续费且不可修改"
            @ok="transferSubmit"
            :okLoading="okLoading"
        >
            <div class="modal-label">接收方地址</div>
            <x-input v-model="transferAdress" placeholder="请输入接收方地址"></x-input>
            <div v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" class="add-title">支付密码</div> 
            <x-input 
                v-if="account.secondsign == 1 || account.secondsign_unconfirmed == 1" 
                v-model.trim="transferPassword" 
                type="password"
                placeholder="请输入支付密码">
            </x-input>
            <div class="modal-fee">费用： {{transferFee | bac}} BAC</div>

        </modal>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import XInput from '~/components/ui/XInput.vue'
    import Tabs from '~/components/ui/Tabs.vue'
    import TabsPane from '~/components/ui/TabsPane.vue'
    import XTable from '~/components/ui/XTable.vue'
    import XTableColumn from '~/components/ui/XTableColumn.vue'
    import Pagination from '~/components/ui/Pagination.vue'
    import SearchBar from '~/components/ui/SearchBar.vue'
    import Modal from '~/components/ui/Modal.vue'
    import Toast from '~/components/ui/toast'
    import {mapState} from 'vuex'
    import api from '~/js/api'
    import sha256 from 'crypto-js/sha256'
    

    export default {
        data () {
            return {
                tabActive: 'all',
                allList: [],
                allCurPage:1,
                allPageCount: 1,
                allPageSize: 10,
                ownerList: [],
                ownerCurPage: 1,
                ownerPageCount: 1,
                ownerPageSize:10,
                myList:[],
                

                isActive: false,
                searchTxt: '',
                transferVisible: false,
                transferFee: 0,
                transferAdress: '',
                transferPassword: '',
                transferHash: '',
                okLoading: false
            }
        },

        created() {
            this.fetchAll()
            this.fetchOwner()
            this.fetchMy()
        },

        computed :{
            ...mapState({
                account: state => state.account,
                key: state => state.key
            })
        },

        mounted () {
            
        },

        components: {
            XBtn,
            Tabs,
            TabsPane,
            XTable,
            XTableColumn,
            SearchBar,
            Modal,
            XInput,
            Pagination                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        },

        methods: {
            async fetchAll () {
                const res = await api.dapp.searchDappList([this.allCurPage, this.allPageSize])
                if (res === null) return;
                this.allList = res.data
                this.allPageCount = Math.ceil(res.totalCount / this.allPageSize)
            },

            async fetchOwner () {
                const res = await api.dapp.searchMineList([this.account.address[0], this.ownerCurPage, this.ownerPageSize])
                if (res === null) return;
                this.ownerList = res.data
                this.ownerPageCount = Math.ceil(res.totalCount / this.ownerPageSize)
            },

            async fetchMy () {
                const res = await api.dapp.searchDappBalance([this.account.address[0]])
                if (res === null) return;
                res.forEach(item => {
                    item._balance = item.balance / Math.pow(10, item.decimals)
                })
                this.myList = res
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

            async getTransferDappFee () {
                const res = await api.dapp.transferDappFee()
                if (res === null) return;;
                
                this.transferFee = res
            },

            transferDapp ({hash}) {

                this.transferVisible = true
                this.transferHash = hash
                if (this.transferFee == 0) {
                    this.getTransferDappFee()
                }
            },

            async transferSubmit () {
                this.okLoading = true
                const res = await api.dapp.transferDapp([this.key.mnemonic, this.transferHash, this.transferAdress, sha256(this.transferPassword).toString()])
                this.okLoading = false;
                if (res === null) return;
                
                this.transferVisible = false;
                Toast.success('合约转让成功')
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

