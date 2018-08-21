<template>
    <div class="x-table-column-comp">
        <slot>
            {{label}}
        </slot>
    </div>
</template>

<script>
    import {assign} from 'lodash'

    export default {
        props:{
            prop: String,
            label: String,
            width: String,
            minWidth: String
        },

        created () {
            console.log(this.$slots)
            this.$parent.insertColumn(assign(this.$props, {
                slot: this.$slots.default
            }))
        }
    }
</script>

<style lang="scss" scoped>
    .x-table-column-comp{

    }
</style>

