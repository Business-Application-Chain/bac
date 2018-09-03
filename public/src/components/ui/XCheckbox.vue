<template>
    <label class="x-checkbox-comp">
        <div class="comp-input" :class="{'is-checked': model}">
            <div class="comp-input_inner"></div>
            <input v-model="model" @change="change" class="comp-input_original" type="checkbox" />
        </div>
        <div class="comp-txt"><slot>备选项</slot></div>
    </label>
</template>

<script>
    export default {
        data () {
            return {
                model: false
            }
        },
        props: {
            value: Boolean
        },
        created () {
            this.model = this.value
        },
        methods: {
            change (e) {
                this.$emit('input', this.model)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .x-checkbox-comp{
        display: inline-block;
        white-space:nowrap;

        .comp-input{
            vertical-align: middle;
            line-height: 1;
            display: inline-block;
            position: relative;

            &.is-checked{
                &+.comp-txt{
                    color: #409eff
                }

                .comp-input_inner{
                    background-color: #409eff;
                    border-color: #409eff;
                    &:after{
                        transform: rotate(45deg) scaleY(1);
                    }
                }
            }
        }

        .comp-input_original{
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
            z-index: -1;
            opacity: 0;
        }

        .comp-input_inner{
            display: inline-block;
            position: relative;
            width: 14px;
            height: 14px;
            box-sizing: border-box;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
            transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);

            &:after{
                box-sizing: content-box;
                content: "";
                border: 1px solid #fff;
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 4px;
                position: absolute;
                top: 1px;
                transform: rotate(45deg) scaleY(0);
                width: 3px;
            }

        }

        .comp-txt{
            font-size: 14px;
            color: #606266;
            display: inline-block;
            padding-left: 10px;
            line-height: 19px;
            cursor: pointer;
        }
    }
</style>
