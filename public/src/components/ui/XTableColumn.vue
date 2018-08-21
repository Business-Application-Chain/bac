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
            console.log(this.$scopedSlots)
            const obj = assign(this.$props, {
                slot: this.$slots.default,
                // render (h, data) {
                //     return this.scopedSlots.default ? this.scopedSlots.default(data) : <div>{data[this.prop]}</div>
                // }
            })
            
            this.$parent.insertColumn(obj)
        }
    }
</script>

<style lang="scss" scoped>
    .x-table-column-comp{

    }
</style>

