<template>
    <div @click="optionsVisible = !optionsVisible" class="x-select-comp">
        <div class="comp-placeholder" v-if="!label">{{placeholder}}</div>
        <div class="comp-label" v-if="label">{{label}}</div>
        <div class="comp-arrow"></div>

        <transition name="zoom-in-top">
            <div v-if="optionsVisible" class="comp-list">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                optionsVisible: false,
                label: ''
            }
        }, 
        props: {
            value: {
                default: ''
            },
            placeholder: {
                default: '请选择'
            }
        },

        mounted () {
            
        },

        methods: {
            change (item) {
                this.label = item.label
                this.$emit('input', item.value)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-select-comp{
        background: #F8F9FC;
        border: 1px solid #EDEFF5;
        border-radius: 1px;
        position: relative;
        height: 45px;
        line-height: 45px;
        padding: 0 20px;
        box-sizing: border;
        cursor: pointer;

        .comp-placeholder{
            font-size: 16px;
            color: #CBCBCB;
        }

        .comp-label{
            font-size: 16px;
            color: #4A4A4A;
        }

        .comp-arrow{
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 8px 6px 0 6px;
            border-color: #9B9B9B transparent transparent transparent;

            position: absolute;
            z-index: 9;
            right: 12px;
            top: 50%;
            transform: translate(0, -50%)
        }

        .comp-list{
            box-shadow: 0 2px 8px rgba(0,0,0, .1);
            background: #fff;
            border-radius: 4px;
            position: absolute;
            z-index:99;
            left: 0px;
            right: 0px;
            top: 50px;
        }
        
    }
</style>



