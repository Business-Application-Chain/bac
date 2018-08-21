<template>
    <div class="x-table-comp">
        <div class="hidden-columns"><slot></slot></div>
        <div class="comp-header">
            <div v-for="item in columns" :key="item.prop" :style="{width: item.width + 'px'}">{{item.label}}</div>
        </div>
        <x-table-body :columns="columns" :list="list"></x-table-body>
    </div>
</template>

<script>
    import XTableBody from './XTableBody'
    export default {
        data () {
            return {
                columns: []
            }
        },
        props: {
            list: Array
        },

        created () {

        },

        components: {
            XTableBody
        },

        methods: {
            insertColumn (item) {
                this.columns.push(item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-table-comp{
        .hidden-columns{
            display: none;
        }

        .comp-header{
            font-size: 12px;
            color: #9B9B9B;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid  #F2F2F2;
            display: flex;
            align-items: center;
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

