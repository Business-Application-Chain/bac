<template>
    <div class="tabs-comp">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        mounted () {
            console.log(this.$slots)
        }
    }
</script>

<style lang="scss" scoped>

</style>

