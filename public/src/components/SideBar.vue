<template>
    <div class="side-bar-comp">
        <router-link :to="{name: 'dashboard'}" class="comp-item" :class="{active: name == 'dashboard'}">
            <img class="comp-item_hd" src="../assets/images/dashboard@3x.png" />
            <div class="comp-item_ft">{{$t('Dashboard')}}</div>
        </router-link>

        <div class="comp-line">
            {{$t('CoreData')}}
        </div>

        <router-link :to="{name: 'account'}" class="comp-item" >
            <img class="comp-item_hd" src="../assets/images/account@3x.png" />
            <div class="comp-item_ft">{{$t('Account')}}</div>
        </router-link>
        <router-link :to="{name: 'contact'}" class="comp-item">
            <img class="comp-item_hd" src="../assets/images/contact@3x.png" />
            <div class="comp-item_ft">{{$t('Contact')}}</div>
        </router-link>
        <router-link :to="{name: 'explorer'}" class="comp-item">
            <img class="comp-item_hd" src="../assets/images/browser@3x.png" />
            <div class="comp-item_ft">{{$t('Explorer')}}</div>
        </router-link>
        <router-link style="display:none" :to="{name: 'assets'}" class="comp-item">
            <img class="comp-item_hd" src="../assets/images/dapp@3x.png" />
            <div class="comp-item_ft">资产</div>
        </router-link>
        <router-link :to="{name: 'dapp'}" class="comp-item">
            <img class="comp-item_hd" src="../assets/images/dapp@3x.png" />
            <div class="comp-item_ft">Dapp</div>
        </router-link>
        

        <div class="network-sec">
            <div class="get-btn">
                <x-btn type="primary" @click="facut">获取测试币</x-btn>
            </div>
            <div class="sec-title">TEST NET {{$t('Synchronizationstatus')}}</div>
            <div class="sec-desc">{{$t('Synchronizing')}}: {{height}}/{{peerHeight}}</div>
            <div class="sec-desc">{{$t('Connections')}}: {{peerCount}}</div>
        </div>
    </div>
</template>

<script>
    import ws from '~/js/plugins/ws'
    import XBtn from '~/components/ui/XBtn.vue'
    import axios  from 'axios'
    import {mapState} from 'vuex'
    import Toast from '~/components/ui/toast/index'

    export default {
        data () {
            return {
                height: '-',
                peerHeight: '-',
                peerCount: '-'
            }
        },
        props: {
            name: String
        },
        components: {
            XBtn
        },

        computed: {
            ...mapState({
                account: state => state.account,
                key: state =>  state.key
            }),
        },

        created () {
            ws.add(({mod, name, data}) => {
                if (mod == 'kernel' && name == 'status') {
                    this.height = data.height
                    this.peerHeight = data.peerHeight
                    this.peerCount = data.peerCount
                }
            })
        },
        methods: {
            async facut () {
                const res = await axios.get( 'http://13.229.137.253:1885/facut/' + this.account.address[0])

                if(res.data.code == 200) {
                    Toast.success(this.$t('TransferSuccess') + res.data.result.transactionHash)
                } else {
                    Toast.error(res.data.error)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .side-bar-comp{
        width: 240px;
        background: #293145;
        height: 100%;
        position: relative;

        .comp-item{
            display: flex;
            align-items: center;
            height: 52px;
            margin-top: 8px;

            &.router-link-active{
                background-image: linear-gradient(-269deg, #454C5D 0%, #293145 100%);
            }
        }

        .comp-item_hd{
            width: 26px;
            height: 26px;
            margin-left: 28px;
            color: #fff;
        }

        .comp-item_ft{
            font-size: 16px;
            color: #FFFFFF;
            line-height: 18px;
            margin-left: 24px;
        }

        .comp-line{
            font-size: 14px;
            color:rgba(255, 255, 255, .5);
            letter-spacing: 0;
            line-height: 34px;
            position: relative;
            text-indent: 20px;
            height: 34px;

            &:after{
                content: '';
                position: absolute;
                z-index: 9;
                height: 1px;
                background: rgba(255, 255, 255, .1);
                left: 90px;
                right: 20px;
                top: 50%;
                transform: translate(0, -50%);
            }
        }

        .network-sec{
            position: absolute;
            bottom: 100px;
            left: 30px;
            line-height: 1;
        }

        .sec-title{
            font-size: 12px;
            color: #FFFFFF;
        }

        .sec-desc{
            font-size: 14px;
            color: rgba(255, 255, 255, .5);
            margin-top: 10px;
        }

        .get-btn{
            margin-bottom: 30px;
        }
    }
</style>

