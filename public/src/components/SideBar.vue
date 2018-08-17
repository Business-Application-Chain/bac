<template>
    <div class="side-bar-comp">
        <router-link :to="{name: 'dashboard'}" class="comp-item" :class="{active: name == 'dashboard'}">
            <img class="comp-item_hd" src="../assets/images/dashboard@3x.png" />
            <div class="comp-item_ft">主控面板</div>
        </router-link>

        <div class="comp-line">
            核心数据
        </div>

        <router-link :to="{name: 'account'}" class="comp-item" :class="{active: name == 'account'}">
            <img class="comp-item_hd" src="../assets/images/account@3x.png" />
            <div class="comp-item_ft">账户</div>
        </router-link>
        <router-link :to="{name: 'contact'}" class="comp-item" :class="{active: name == 'contact'}">
            <img class="comp-item_hd" src="../assets/images/contact@3x.png" />
            <div class="comp-item_ft">联系人</div>
        </router-link>
        <router-link :to="{name: 'explorer'}" class="comp-item" :class="{active: name == 'browser'}">
            <img class="comp-item_hd" src="../assets/images/browser@3x.png" />
            <div class="comp-item_ft">浏览器</div>
        </router-link>
        <router-link :to="{name: 'dapp'}" class="comp-item">
            <img class="comp-item_hd" src="../assets/images/browser@3x.png" />
            <div class="comp-item_ft">资产</div>
        </router-link>

        <div class="network-sec">
            <div class="sec-title">MAINNET 同步状态</div>
            <div class="sec-desc">同步中: {{height}}/{{peerHeight}}</div>
            <div class="sec-desc">连接数: {{peerCount}}</div>
        </div>
    </div>
</template>

<script>
    import ws from '~/js/plugins/ws'

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
        created () {
            ws.add(({mod, name, data}) => {
                if (mod == 'kernel' && name == 'status') {
                    this.height = data.height
                    this.peerHeight = data.peerHeight
                    this.peerCount = data.peerCount
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    .side-bar-comp{
        width: 360px;
        background: #293145;
        height: 100%;
        position: relative;

        .comp-item{
            display: flex;
            align-items: center;
            height: 60px;

            &.router-link-active{
                background-image: linear-gradient(-269deg, #454C5D 0%, #293145 100%);
            }
        }

        .comp-item_hd{
            width: 30px;
            height: 30px;
            margin-left: 30px;
            color: #fff;
        }

        .comp-item_ft{
            font-size: 18px;
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
            font-size: 14px;
            color: #FFFFFF;
        }

        .sec-desc{
            font-size: 16px;
            color: rgba(255, 255, 255, .5);
            margin-top: 10px;
        }
    }
</style>

