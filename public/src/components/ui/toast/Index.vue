<template>
    <transition name="toast" appear @after-leave="closed">
        <div v-if="visible" class="toast-comp" :class="[type]">
            <i v-if="type == 'success'" class="iconfont">&#xe605;</i>
            <i v-if="type == 'error'" class="iconfont">&#xe60f;</i>
            <i v-if="type == 'warn'" class="iconfont">&#xe612;</i>
            <span class="comp-text">{{msg}}</span>
        </div>
    </transition>
</template>

<script>
    export default {
        data () {
            return {
                visible: true
            }
        },
        props: {
            type: {
                default: 'warn' //success,  error, warn
            },
            msg: {
                default: '恭喜发送成功'
            },
            duration: {
                default: 1500
            },
            onClose: Function
        },

        mounted () {
            setTimeout(() => {
                this.visible = false
            }, this.duration)
        },

        methods: {
            closed () {
                if (this.onClose) {
                    this.onClose()
                }
            }
        }
        
    }
</script>

<style lang="scss" scoped>
    .toast-comp{
        position: fixed;
        z-index: 1000;
        height: 60px;
        line-height: 60px;
        border-radius: 4px;
        font-size: 18px;
        padding:0 30px;
        left: 50%;
        top: 50px;
        transform: translate(-50%, 0);

        &.success{
            background: #E4FFE0;
            border: 1px solid #B7E3B1;
            box-shadow: 0 2px 4px 0 rgba(47,79,42,0.16);
            color: #77C86B;
        }

        &.error{
            background: #FED7D7;
            border: 1px solid #F3B6B6;
            box-shadow: 0 2px 4px 0 rgba(83,37,37,0.16);
            color: #FF7E7E;
        }

        &.warn{
            background: #FFE9D0;
            border: 1px solid #FFC37F;
            box-shadow: 0 2px 4px 0 rgba(100,55,3,0.16);
            color: #FF9317;
        }

        .iconfont{
            font-size: 24px;
            vertical-align: middle;
            margin-right: 10px;
        }

        .comp-text{
            vertical-align: middle
        }
    }
</style>

