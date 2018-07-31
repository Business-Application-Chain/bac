<template>
    <div class="contact-detail-page">
        <div class="sec">
            <div class="sec-header">联系人</div>
            <div class="contact-info">
                <div class="info-item">
                    <span class="info-item_desc">别名: </span> 
                    <span class="info-item_primary">{{userAccount.username || '-'}}</span>
                </div>
                <div class="info-item">
                    <span class="info-item_desc">地址: </span> 
                    <span class="info-item_primary">{{userAccount.address[0]}}</span>
                </div>
                <x-btn v-if="!userAccount.isFriend" @click="addVisible = true" icon="&#xe601;" width="90px">添加</x-btn>
                <div class="info-ft">
                    <x-btn @click="sendVisible = true" type="primary" icon="&#xe60b;" width="90px">Send</x-btn>
                </div>
            </div>
        </div>

        <div class="sec order-sec">
            <div class="sec-header">交易</div>
            <account-orders :address="id"></account-orders>
        </div>

        <send v-if="sendVisible" :visible.sync="sendVisible" :recipient="id"></send>
        <add-contact v-if="addVisible" :visible.sync="addVisible" :address="userAccount.address[0]" @success="successHandle"></add-contact>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import AccountOrders from '~/components/AccountOrders.vue'
    import api from '~/js/api/index'
    import Send from '~/components/Send.vue'
    import AddContact from '~/components/AddContact.vue'
    import {mapState} from 'vuex'
    import Toast from '~/components/ui/toast/index'

    export default {
        data () {
            return {
                userAccount: {
                   address: []
                },
                sendVisible: false,
                addVisible: false,
                id: ''
            }
        },
        components:{
            XBtn,
            AccountOrders,
            Send,
            AddContact
        },
        computed: {
            ...mapState(['account'])
        },

        watch: {
            
        },
        created () {
            this.id = this.$route.params.id
            this.fetch()
            
        },
        
        beforeRouteUpdate (to, from, next) {
            // console.log(from, to )
            this.id = to.params.id
            this.fetch()
            next()
        },

        methods: {
            fetch () {
                api.account.getAccount([this.id, this.account.address[0]]).then(res => {
                    if (res === null) return;
                    
                    this.userAccount = res.account
                })
            },

            successHandle () {
                Toast.success('添加联系人成功')
                this.userAccount.isFriend = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contact-detail-page{
        .contact-info{
            display: flex;
            align-items: center;
            height: 80px;
            font-size: 14px;
            padding: 0 30px;
        }

        .info-item{
            flex: 1;
        }

        .info-item_desc{
            color: #4A4A4A;
        }

        .info-item_primary{
            color: #000;
        }

        .info-ft{
            margin-left: 15px;
        }

        .order-sec{
            margin-top: 30px;
            padding-bottom: 30px;
        }
    }
</style>

