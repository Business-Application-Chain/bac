<template>
    <div class="tabs-pane-comp">
        <slot></slot>
    </div>
</template>

<script>
    import {assign} from 'lodash'

    export default {
        props: {
            label: {
                default: '选项卡'
            },
            value: String
        },

        mounted () {
            
            // this.$parent.insertChild(assign({
            //     slots:this.$slots.default
            // }, this.$props))
            this.$parent.insertChild(this)
        },



        destroyed(){
            console.log('destroyed')
        }
    }
</script>

<style lang="scss" scoped>
    .tabs-pane-comp{
        display: none
    }
</style>

