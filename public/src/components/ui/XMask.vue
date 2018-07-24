<template>
    <transition name="fade">
        <div class="x-mask-comp"></div>
    </transition>
</template>

<script>
    export default {
        methods: {
            close () {
               
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-mask-comp{
        position: fixed;
        z-index: 999;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background: rgba(0, 0, 0, .5)
    }
</style>

