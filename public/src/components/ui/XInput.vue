<template>
    <div class="x-input-comp">
        <input class="x-input_input" :disabled="disabeld" :value="value" @input="$emit('input', $event.target.value)" :placeholder="placeholder" :class="{error: status == 'error'}" :type="type" />
        <div v-if="status == 'error'" class="x-input_err">{{errorMsg}}</div>
        <div v-if="status == 'success'" class="x-input_success"><x-circle type="primary"></x-circle></div>
    </div>
</template>

<script>
    import XCircle from './XCircle.vue'
    
    export default {
        props: {
            value: String,
            type: {
                default: 'text'
            },
            status: {
                default: ''  //success, error
            },
            errorMsg: {
                default: '出错啦'
            },
            placeholder: {
                default: ''
            },
            disabeld:{
                default: false
            }
        },

        components:{
            XCircle
        }
    }
</script>

<style lang="scss" scoped>
    .x-input-comp{
        position: relative;
        height: 65px;

        .x-input_input{
            background: #F8F9FC;
            border: 1px solid #EDEFF5;
            border-radius: 1px;
            height: 40px;
            line-height: 40px;
            width: 100%;
            text-indent: 20px;
            box-sizing: border-box;
            font-size: 14px;

            &::placeholder{
                font-size: 14px;
                color: #CBCBCB;
            }

            &.error{
                border: 1px solid #FF7E7E;
            }
        }

        .x-input_success{
            position: absolute;
            z-index: 9;
            top: 13px;
            right:20px;
        }

        .x-input_err{
            font-size: 14px;
            color: #FF7E7E;
            margin-top: 5px;
        }
    }
</style>

