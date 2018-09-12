<template>
    <div class="tabs-comp">
        <div class="comp-header">
            <div v-for="(item, index) in tabs" :key="index" @click="$emit('input', item.name)" class="comp-header_item" :class="{active: item.name == value}">{{item.label}}</div>
        </div>
        <div><slot></slot></div>
    </div>
</template>

<script>
    

    export default {
        
        data () {
            return {
                tabs:[]
            }
        },
        props:{
            value: String
        },
        mounted () {
            if (!this.value){
                this.$emit('input', this.tabs[0].value)
            }
        },

        components: {
        },

        methods: {
            insertChild (item) {
                this.tabs.push(item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tabs-comp{
        .comp-header{
            display: flex;
            align-items: center;
            
        }

        .comp-header_item{
            width: 130px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #F4F4F4;
            font-size: 16px;
            color: #9B9B9B;
            position: relative;
            border-radius: 4px 4px 0 0;
            cursor: pointer;
            transition: all .15s;

            &:not(:first-child){
                &:before{
                    content: '';
                    position: absolute;
                    z-index:9;
                    left: 0px;
                    top: 50%;
                    transform: translate(0, -50%);
                    width: 1px;
                    height: 16px;
                    background:#DADADA;
                    transition: all .3s;
                }    
            }

            &.active{
                color:#4A4A4A;
                background: #fff;
                &:before{
                    height:0px;
                }

                & + .comp-header_item{
                    &:before{
                        height:0px;
                    }
                }
            }
        }
    }
</style>

