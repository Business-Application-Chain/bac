<template>
    <div class="main-header-comp">
        <router-link :to="{name: 'dashboard'}" class="logo">
            <img class="logo-img" src="../assets/images/logo.png" />
        </router-link>
        <div @click="sendVisible = true" class="send-btn">
            <i class="iconfont send-btn_icon">&#xe60b;</i>
            <span>Send</span>
        </div>

        <router-link :to="{name: 'account'}" class="user-btn">
            <i class="iconfont user-btn_icon">&#xe60d;</i>
            <span class="user-btn_txt">
                {{balance | bac}}
                <span class="user-btn_desc">BAC</span>
            </span>
        </router-link >

        <div style="display:none" class="message-btn" v-click-outside="hideMessage">
            <div @click="messageVisible = !messageVisible" class="icon-btn">
                <i class="iconfont message-icon">&#xe60c;</i>
                <div class="btn-badge">9+</div>
            </div>    
            <transition name="fade-in-up">
                <div v-if="messageVisible" class="message-list sec">
                    <div class="sec-header">消息通知</div>
                    <div class="message-cont">
                        <div @click="goMessage" class="message-item">
                            <div class="message-item_inner">
                                <b>[公告]</b> 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护
                            </div>
                        </div>
                        <div @click="goMessage" class="message-item">
                            <div class="message-item_inner">
                                <b>[公告]</b> 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护
                            </div>
                        </div>
                        <div @click="goMessage" class="message-item">
                            <div class="message-item_inner">
                                <b>[公告]</b> 北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护北京时间2点服务器进行维护
                            </div>
                        </div>
                    </div>
                    <div @click="goMessage" class="message-more">查看全部</div>
                </div>
            </transition>
        </div>

        <router-link :to="{name: 'settings'}" class="icon-btn setting-btn">
            <i class="iconfont setting-icon">&#xe60e;</i>
        </router-link>

        <div @click="logout" class="icon-btn logout-btn">
            <i class="iconfont setting-icon">&#xe615;</i>
        </div>

        <lang></lang>

        <send v-if="sendVisible" :visible.sync="sendVisible"></send>
    </div>
</template>

<script>
    import Lang from './lang.vue'
    import ClickOutside from 'vue-click-outside'
    import Send from './Send.vue'
    import {mapState} from 'vuex'
    import {clear} from '../js/plugins/account'

    export default {
        data () {
            return {
                messageVisible: false,
                sendVisible: false
            }
        },
        components:{
            Lang,
            Send
        },
        computed: {
            ...mapState({
                balance: state =>  state.account.balance
            })
        },
        directives:{
            ClickOutside
        },
        methods:{
            hideMessage () {
                this.messageVisible = false
            },

            goMessage () {
                this.messageVisible = false
                this.$router.push({
                    name: 'message'
                })
            },

            logout () {
                
                clear(this.$store)

                this.$router.push({
                    path: '/'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../css/utils.scss";

    .main-header-comp{
        background: #121F3E;
        height: 85px;
        display: flex;
        align-items: center;
        padding: 0 30px;

        .logo{
            flex:1 
        }

        .logo-img{
            width: 130px;
            height: 40px;
        }

        .send-btn{
            width: 108px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            background: #55A8FD;
            border-radius: 2px;
            color: #fff;
            cursor: pointer;
        }

        .send-btn_icon{
            font-size: 20px;
            margin-right: 10px;
            vertical-align: middle;
        }

        .user-btn{
            background: rgba(255, 255, 255, .15);
            padding:0 20px;
            height: 44px;
            line-height: 44px;
            border-radius: 2px;
            font-size: 16px;
            color: #FFFFFF;
            text-align: center;
            margin-left: 10px;
            cursor: pointer;
        }

        .user-btn_icon{
            font-size: 20px;
            margin-right: 10px;
        }
        .user-btn_desc{
            font-size: 12px;
        }

        .icon-btn{
            width: 44px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            background: rgba(255, 255, 255, .15);
            font-size: 0px;
            margin-left: 10px;
            position: relative;
            cursor: pointer;
        }

        .message-icon{
            font-size: 26px;
            color: #fff;
        }

        .btn-badge{
            position: absolute;
            background: #24D17E;
            border: 2px solid #35405A;
            width: 16px;
            height: 16px;
            line-height: 16px;
            border-radius: 50%;
            top: 5px;
            right: 5px;
            text-align: center;
            font-size: 12px;
            color:#fff;
        }

        .setting-icon{
            font-size: 24px;
            color: #fff;
        }

        .logout-btn{
            margin-right: 25px;
        }

        .message-btn{
            position: relative;
        }

        .message-list{
            right: 0px;
            top: 64px;
            position: absolute;
            z-index: 9;
            width: 300px;
            text-align: left;
            box-shadow: 0 0 8px rgba(0, 0,0, .1);
        }

        .message-cont{
            height: 225px;
        }

        .message-item{
            display: block;
            font-size: 14px;
            line-height: 20px;
            color: #4A4A4A;
            padding: 13px 30px;
            cursor: pointer;

            &:hover{
                background: #F8FCFF;
            }
        }

        .message-item_inner{
            @include  multi-line(2);
        }

        .message-more{
            display: block;
            font-size: 14px;
            color: #3F80FA;
            height: 45px;
            line-height: 45px;
            text-align: center;
            cursor: pointer;
        }
        
    }
</style>
