<template>
    <div v-show="name == $parent.value" class="tabs-pane-comp">
        <slot></slot>
    </div>
</template>

<script>
    import {assign} from 'lodash'

    export default {
        data () {
            return {
                active: 0
            }
        },
        props: {
            label: {
                default: '选项卡'
            },
            name: String
        },

        

        mounted () {
            this.$parent.insertChild(this)
        },



        destroyed(){
            console.log('destroyed')
        }
    }
</script>

<style lang="scss" scoped>
    .tabs-pane-comp{
        background: #fff;
    }
</style>

