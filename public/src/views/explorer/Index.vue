<template>
    <div class="explorer-index-page">
        <div class="page-search">
            <input v-model.trim="searchTxt" @keyup.enter="search" placeholder="区块高度 / 交易ID " type="text" class="search-input">
            <div v-if="searchTxt" @click="clear" class="search-close"><i class="iconfont">&#xe60f;</i></div>
            <div @click="search" class="search-btn">搜索</div>
        </div>

        <router-view />
        
    </div>
</template>

<script>
    import api from '../../js/api/index.js'
    import Toast from '~/components/ui/toast/index'
    
    export default {
        data () {
            return {
                searchTxt: ''
            }
        },

        created() {
            if (this.$route.params.query) {
                this.searchTxt = this.$route.params.query
            }
        },

        beforeRouteUpdate (to, from, next) {
            if (to.params.query) {
                this.searchTxt = to.params.query
            }
            next()
        },
        
        methods: {
            clear () {
                this.searchTxt = ''
                this.$router.push({
                    name: 'explorer'
                })
            },

            search () {

                if (this.searchTxt == '' || !this.searchTxt){
                    Toast.warn('请输入要搜索的内容')
                    return;
                }

                this.$router.push({
                    name: 'explorerResult',
                    params: {query: this.searchTxt}
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .explorer-index-page{
        .page-search{
            height: 50px;
            line-height: 50px;
            border: 1px solid rgba(63,128,250,0.50);
            border-radius: 4px;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            position: relative;
        }

        .search-input{
            flex: 1;
            border: none;
            height: 100%;
            border-radius: 4px 0 0 4px;
            text-indent: 30px;
            &::-webkit-input-placeholder{
                color: #CBCBCB;
            }
        }

        .search-btn{
            background: #E2ECFF;
            border-radius: 0 4px 4px 0;
            font-size: 16px;
            color: #3F80FA;
            width: 110px;
            text-align: center;
            height: 100%;
            cursor: pointer;
        }

        .search-close{
            position: absolute;
            z-index: 9;
            right: 140px;
            line-height: 1;
            top: 50%;
            transform: translate(0, -50%);
            cursor: pointer;

            .iconfont{
                font-size: 22px;
                color: #dbdbdb
            }
        }
        
    }
</style>

