<template>
    <div class="modal-comp">
        <x-mask v-if="compVisible" @click.native="maskHandle"></x-mask>
        
        <transition name="fade-in-down" @after-leave="leave">
            <div v-if="compVisible" class="comp-wrap" :class="{small: size == 'small'}" :style="{width: width}">
                <div class="comp-header">
                    <span>{{title}}</span>
                    <div @click="close" class="header-close">
                        <i class="iconfont close-icon">&#xe604;</i>
                    </div>
                </div>

                <div v-if="hint" class="comp-hint">
                    <span class="hint-circle"></span>
                    <span>注意：{{hint}}</span>
                </div>

                <div class="wrap-main">
                    <slot>这里是内容</slot>
                </div>

                <div v-if="cancelVisible || okVisible" class="comp-btns">

                    <div class="cancel-btn">
                        <x-btn @click="close" v-if="cancelVisible">{{cancelText}}</x-btn>
                    </div> 
                    <x-btn v-if="okVisible" @click="okHandle" :loading="okLoading" type="primary">{{okText}}</x-btn>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import XMask from './XMask.vue'
    import XBtn from './XBtn.vue'

    export default {
        data () {
            return {
                compVisible: false
            }
        },
        props: {
            visible: {
                default: false
            },
            
            title:{
                default: '标题'
            },

            okVisible:{
                default: true
            },
            
            okText: {
                default: '确认'
            },

            okLoading: {
                default: false
            },

            cancelVisible: {
                default: true
            },

            cancelText: {
                default: '取消'
            },

            hint: {
                default: ''
            },

            size: {
                default: 'normal' // small
            },

            closeable: {  //是否点击mask隐藏
                default: true
            },
            width: {
                default: '600px'
            }
        },

        mounted () {
            this.compVisible = this.visible
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

            leave () {
                this.$emit('update:visible', false)
                this.$emit('close')
            },
            okHandle () {
                this.$emit('ok')
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

            &.small{
                width: 360px;

                .comp-header{
                    height: 60px;
                    line-height: 60px;
                }

                .wrap-main{
                    padding:50px 30px;
                }

                .comp-btns{
                    padding: 20px 0px;
                }
            }
        }

        .comp-header{
            background: #121F3E;
            border-radius: 4px 4px 0 0;
            height: 80px;
            line-height: 80px;
            text-align: center;
            position: relative;
            font-size: 20px;
            color: #FFFFFF;
        }

        .header-close{
            position: absolute;
            right: 36px;
            top: 50%;
            transform: translate(0, -50%);
            cursor: pointer;
            line-height: 1
        }

        .close-icon{
            font-size: 14px;
            color: #fff;
        }

        .comp-hint{
            height: 40px;
            line-height: 40px;
            background: #e5efff;
            text-indent: 30px;
            font-size: 12px;
            color: #FF7E7E;
        }

        .hint-circle{
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #FF7E7E;
            border-radius: 50%;
            margin-right: 10px;
            vertical-align: middle
        }

        .comp-btns{
            margin: 0 30px;
            border-top: 1px solid #F2F2F2;
            padding: 25px 55px;
            display: flex;
            align-items: center
        }

        .cancel-btn{
            flex: 1
        }

        .wrap-main{
            color: #4A4A4A;
            padding: 30px 30px;
        }
    }
</style>

