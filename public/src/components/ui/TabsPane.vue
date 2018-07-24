<template>
    <div class="tabs-pane-comp">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                default: '选项卡'
            }
        }
    }
</script>

<style lang="scss" scoped>
    
</style>

