<template>
    <div class="x-table-comp">
        <div class="hidden-columns"><slot></slot></div>
        
        <div class="comp-header">
            <div class="comp-header_cell" v-for="item in columns" :key="item.prop" :style="item.realStyle">{{item.label}}</div>
        </div>
        <x-table-body :columns="columns" :list="list"></x-table-body>
        
    </div>
</template>

<script>
    import XTableBody from './XTableBody.vue'
    import {findIndex} from 'lodash'

    export default {
        data () {
            return {
                columns: []
            }
        },
        props: {
            list: Array
        },

        components: {
            XTableBody
        },

        created () {
            
        },

        methods: {
            insertColumn (item) {
                this.columns.push(item)
            },
            removeColumn (id) {
                const index = findIndex(this.columns, item => item.id == id)
                this.columns.splice(index, 1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-table-comp{
        overflow: auto;

        .hidden-columns{
            display: none;
        }

        .comp-header{
            font-size: 12px;
            color: #9B9B9B;
            
            
            display: flex;
            align-items: center;
        }

        .comp-header_cell{
            border-bottom: 1px solid  #F2F2F2;
            height: 40px;
            line-height: 40px;
        }

        .comp-cell{
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            
            color: #4A4A4A;

            &:not(:last-child){
                 border-bottom: 1px solid #F2F2F2
            }

            &:hover{
                background: #F8FCFF;
            }

            .link{
                color: #55A8FD;
            }
        }
    }
</style>

