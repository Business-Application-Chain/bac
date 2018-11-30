<template>
    <div @click="handle" class="x-option-comp">
        <slot>{{label}}</slot>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                default: ''
            },
            label: {
                default: 'label'
            }
        },

        methods: {
            handle () {
                this.$parent.change({
                    value: this.value,
                    label: this.label
                })

                this.$emit('change')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-option-comp{
        height: 50px;
        padding: 0 20px;
        line-height: 50px;
        font-size: 14px;
        color: #4A4A4A;

        &:hover{
            background: #EEF4FF;
        }
    }
</style>
