<template>
    <div class="x-circle-comp">
        <i v-if="type == 'primary'" class="iconfont">&#xe605;</i>
        <div v-if="type == 'plain' " class="comp-bd plain"></div>
        <div v-if="type == 'disabled' " class="comp-bd disabled"></div>
    </div>
</template>

<script>
    export default {
        props:{
            type:{
                default: 'primary'
            }  //disabled primary plain
        }
    }
</script>

<style lang="scss" scoped>
    .x-circle-comp{
        display: inline-block;
        font-size: 0px;

        .iconfont{
            color: #24D17E;
        }

        .comp-bd{
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            &.plain{
                background: #E9FAF2;
                border: 1px solid #24D17E
            }
            &.disabled{
                background: #fff;
                border: 1px solid #DBDBDB   
            }
        }
    }
</style>

