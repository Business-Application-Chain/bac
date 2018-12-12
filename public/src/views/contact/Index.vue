<template>
    <div class="contact-index-page">
        <div class="sec">
            <div class="sec-header">
                <div class="sec-header_hd">
                    {{$t('Contact')}}({{list.length}})
                </div>
                <div class="sec-header_ft">
                    <x-btn @click="addVisible = true" icon="&#xe601;" height="36px" type="primary" width="90px">{{$t('Add')}}</x-btn>
                </div>
            </div>
            
        </div>

        <div v-if="list.length > 0" class="contact-list">
            <router-link  v-for="item in list" :to="{name: 'contactDetail', params:{id: item.master_address} }" :key="item.master_address" class="contact-item">
                <div class="item-hd">
                    <div class="item-hd_name"><b>{{item.username ? item.username : '-'}}</b></div>
                    <div class="item-hd_desc">{{item.master_address}}</div>
                </div>
                <div @click.prevent="send(item.master_address)" class="item-ft">
                    <i class="iconfont">&#xe60b;</i>
                    <span>{{$t('Send')}}</span>
                </div>
            </router-link>
        </div>

        <div v-else class="empty-sec">
            <img class="empty-sec_img" src="../../assets/images/none_contact.png" />
            <div class="empty-sec_hint">{{$t('Nocontact')}}</div>
        </div>

        <send v-if="sendVisible" :visible.sync="sendVisible" :recipient="sendAddress"></send>
        <add-contact v-if="addVisible" :visible.sync="addVisible" @success="addHandle"></add-contact>
    </div>
</template>

<script>
    import api from '~/js/api/index'
    import Send from '~/components/Send.vue'
    import XBtn from '~/components/ui/XBtn.vue'
    import AddContact from '~/components/AddContact.vue'
    import {mapState} from 'vuex'
    

    export default {
        data () {
            return {
                list: [],
                sendVisible: false,
                sendAddress: '',
                addVisible: false,
            }
        },
        
        computed :{
            ...mapState({
                account: state => state.account,
                key: state => state.key
            })
        },

        created () {
            api.contacts.getList([this.account.publicKey]).then(res => {
                if (res === null) return;
                this.list = res
            })
        },

        components: {
            Send,
            XBtn,
            AddContact
        },

        methods: {
            send (address) {
                this.sendAddress = address
                this.sendVisible = true
            },
            addHandle (res) {
                this.list.push(res)
            }
        }
    }
</script>

<style lang="scss">
    .contact-index-page{
        background: #fff;
        border-radius: 4px;

        min-height: 450px;


        .page-header{
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            color: #4A4A4A;
            padding: 0 30px;
            border: 1px solid #F2F2F2;
            display: flex;
            align-items: center;
        }

        .header-hd{
            flex: 1
        }

        
        .contact-list{
            display: flex;
            flex-wrap: wrap;
            padding: 0 30px;
            margin-top: 30px;
        }
        

       

        .contact-item{
            display: flex;
            align-items: center;
            background: #F5F7FC;
            border-radius: 1px;
            height: 74px;
            width: 100%;
            margin-bottom: 20px;
            
            
            .item-hd{
                flex: 1;
                margin-left: 10px;
            }

            .item-hd_name{
                font-size: 16px;
                color: #55A8FD;
            }

            .item-hd_desc{
                font-size: 14px;
                color: #9B9B9B;
                margin-top: 4px;
            }

            .item-ft{
                width: 76px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                color: #3F80FA;
                background: #E2ECFF;
                border-radius: 2px;
                text-align: center;
                margin-right: 10px;
                cursor: pointer;
            }

            .iconfont{
                font-size: 20px;
                margin-right: 4px;
                vertical-align: middle;
            }
        }

        @media (min-width: 1400px) {
            .contact-list{
                margin-left: -2%
            }
            .contact-item{
                width: 48%;
                margin-left: 2%;
            }
        }

        @media (min-width: 1800px) {
            .contact-list{
                margin-left: -2%
            }
            .contact-item{
                width: 31.33333%;
                margin-left: 2%;
            }
        }

        .empty-sec{
            text-align: center;
            margin-top: 140px;
        }

        .empty-sec_img{
            width: 100px;
            height: 82px;
        }

        .empty-sec_hint{
            font-size: 16px;
            color: #4A4A4A;
            margin-top: 18px;
            
        }
        
    }
</style>
