<template>
    <div class="status-tag-comp" :class="[type]">
        {{type | upper}}
    </div>
</template>

<script>
    export default{
        props:{
            type: String
        },
        filters: {
            'upper' (value) {
                return value.toUpperCase()
            }
        },
    }
</script>

<style lang="scss" scoped>
    .status-tag-comp{
        display: inline-block;
        background: #D8D8D8;
        border-radius: 2px;

        width: 48px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        font-size: 12px;
        color: #FFFFFF;
        margin-right: 5px;

        &.in{
            background: #24D17E;
        }

        &.out{
            background: #F5A623;
        }
    }
</style>
