<template>
    <div class="x-btn-comp" 
        @click="handle" 
        :class="{plain: type == 'plain', primary: type == 'primary', disabled: disabled}" 
        :style="{width: width, padding: width ? '0px' : '0 30px', height: height, lineHeight: height}">
        <template v-if="loading">
            <beat-loader ></beat-loader>
        </template>
        <template v-if="!loading">
            <i v-if="icon" class="iconfont" :style="{fontSize: iconSize}" v-html="icon"></i>
            <span class="comp-txt" :style="{fontSize: fontSize}"><slot></slot></span>
        </template>
    </div>
</template>

<script>
    import BeatLoader from './spinner/BeatLoader.vue'

    export default {
        props: {
            type: {
                default: 'plain' // primary plain
            },
            icon: {
                default: ''
            },
            iconSize:{
                default: '20px'
            },
            fontSize: {
                default: '16px'
            },
            loading: {
                default: false
            },
            disabled: {
                default: false
            },
            width: String,
            height: {
                default: '42px'
            }
        },
        components:{
            BeatLoader
        },
        methods: {
            handle () {
                if (!this.loading && !this.disabled) {
                    this.$emit('click')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-btn-comp{
        text-align: center;
        display:inline-block;
        font-size: 16px;
        border-radius: 2px;
        padding: 0 30px;
        cursor: pointer;
        transition: all .3s;
        box-sizing: border-box;
        font-size: 0px;


        &:not(.disabled):hover{
            &.plain{
                background: #F6F9FF;
            }

            &.primary{
                background: #CFDFFE
            }
        }

        &.plain{
            border: 1px solid #E9E9E9;
            background: #fff;
            color: #3F80FA;
        }

        &.primary{
            border: 1px solid #E2ECFF;
            background: #E2ECFF;
            color: #3F80FA;
        }

        &.disabled{
            color: #B0CAFD;
            cursor: not-allowed;
        }

        .iconfont{
            
            margin-right: 10px;
        }
    }
</style>
