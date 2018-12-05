<template>
    <div class="modal-comp">
        <x-mask v-if="compVisible" @click.native="maskHandle"></x-mask>
        
        <transition name="fade-in-down">
            <div v-if="compVisible" class="comp-wrap" :style="{width: width}">
                <div class="comp-header">
                    <span>{{title}}</span>
                    <div @click="close" class="header-close">
                        <i class="iconfont close-icon">&#xe604;</i>
                    </div>
                </div>

                <div class="wrap-main">
                    <div v-html="msg"></div>
                </div>

                <div v-if="okText || cancelText" class="comp-btns">
                    <div class="btns-header"></div>
                    <div class="cancel-btn">
                        <x-btn height="30px" width="66px" font-size="14px" @click="cancelHandle" v-if="cancelText">{{cancelText}}</x-btn>
                    </div> 
                    <x-btn v-if="okText" height="30px" width="66px" font-size="14px" @click="okHandle" type="primary">{{okText}}</x-btn>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import XMask from '../XMask.vue'
    import XBtn from '../XBtn.vue'



    export default {
        data () {
            return {
                compVisible: true
            }
        },
        props: {
            ok:Function,
            cancel: Function,

            title:{
                default: '标题'
            },

            msg:{
                default: ''
            },
            
            okText: {
                default: ''
            },

            cancelText: {
                default: ''
            },

            closeable: {  //是否点击mask隐藏
                default: false
            },
            width: {
                default: 'auto'
            }
        },


        components: {
            XMask,
            XBtn
        },

        methods: {
            maskHandle () {
                if (this.closeable) {
                    this.compVisible = false
                }
            },

            close () {
                this.compVisible = false
            },

            cancelHandle () {
                this.compVisible = false
                this.cancel()
            },

            okHandle () {
                this.compVisible = false
                this.ok()
            }
        }

        
    }
</script>

<style lang="scss" scoped>
    .modal-comp{
        

        .comp-wrap{
            position: fixed;
            z-index:1000;
            top:50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            border-radius: 4px;
            min-width: 400px;
        }

        .comp-header{
            background: #121F3E;
            border-radius: 4px 4px 0 0;
            height: 50px;
            line-height: 50px;
            text-indent: 20px;
            position: relative;
            font-size: 16px;
            color: #FFFFFF;
        }

        .header-close{
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translate(0, -50%);
            cursor: pointer;
            line-height: 1
        }

        .close-icon{
            font-size: 14px;
            color: #fff;
        }

        .comp-btns{
            
            padding: 0 20px 20px 20px;
            display: flex;
            align-items: center
        }

        .cancel-btn{
            margin-right: 20px;
        }

        .btns-header{
            flex:1
        }

        .wrap-main{
            color: #4A4A4A;
            padding:20px 20px;
        }
    }
</style>

