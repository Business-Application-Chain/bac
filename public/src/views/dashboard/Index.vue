<template>
    <div class="dashboard-index-page">
        <div class="card-list">
            <router-link :to="{name: 'account'}" class="card-item">
                <div class="card-item_title">{{$t('Balance')}}</div>
                <div class="card-item_primary">{{account.balance | bac}}</div>
            </router-link>
            <router-link :to="{name: 'contact'}" class="card-item">
                <div class="card-item_title">{{$t('Contact')}}</div>
                <div class="card-item_primary">{{contactsCount}}</div>
            </router-link>
            <div class="card-item">
                <div class="card-item_title">{{$t('CurrentVersion')}}</div>
                <div class="card-item_primary">V{{version}}</div>
            </div>
        </div>

        <div class="sec order-sec">
            <div class="sec-header">{{$t('LatestTransaction')}}</div>
            <account-orders :address="account.address[0]"></account-orders>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import api from '~/js/api/index'
    import AccountOrders from '~/components/AccountOrders.vue'
    

    export default {
        data () {
            return {
                contactsCount:0,
                version: ''
            }
        },
        computed: {
            ...mapState(['account'])
        },
        created () {
            api.contacts.count([this.account.publicKey]).then(res => {
                if (res === null) return;
                this.contactsCount = res
            })

            api.kernel.version().then(res => {
                if (res === null) return;
                this.version = res
            })
        },

        components:{
            AccountOrders
        },

        methods: {
           
        }
    }
</script>

<style lang="scss" scoped>
    .dashboard-index-page{
        
        .card-list{
            display: flex;
            align-items: center;
        }

        .card-item{
            height: 136px;
            background-image: linear-gradient(-180deg, #6CBBFF 0%, #516CEA 100%);
            border-radius: 4px;
            flex: 1;
            color: #fff;
            padding: 20px;
            box-sizing:border-box;
            position: relative;
            cursor: pointer;
            &:not(:last-child){
                margin-right: 20px;
            }
        }

        .card-item_title{
            font-size: 14px;
            line-height: 14px;
        }

        .card-item_primary{
            position: absolute;
            z-index: 9;
            bottom: 20px;
            left: 20px;
            font-size: 36px;
            line-height: 36px;
        }

        .order-sec{
            margin-top: 30px;
            padding-bottom: 18px;
            min-height: 450px;
        }
    }
</style>

