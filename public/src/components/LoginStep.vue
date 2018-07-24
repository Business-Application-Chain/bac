<template>
    <div class="login-step-comp">
        
        <x-circle :type="step == 1 ? 'plain' : 'primary'"></x-circle>
        <div class="comp-text">{{$t('madeBackupWords')}}</div>
        <div class="comp-line"></div>
        <x-circle :type="step == 2 ? 'plain' : (step == 3 ? 'primary' : 'disabled')"></x-circle>
        <div class="comp-text" :class="{disabled: step == 1}">{{$t('setPassword')}}</div>
        <div class="comp-line"></div>
        <x-circle :type="step == 3 ? 'plain' : 'disabled'"></x-circle>
        <div class="comp-text" :class="{disabled: step == 1 || step == 2}">{{$t('exportFile')}}</div>
    </div>
</template>

<script>
    import XCircle from './ui/XCircle.vue'
    
    export default {
        props:{
            step: {
                default: 1
            }
        },
        components:{
            XCircle
        }
    }
</script>

<style lang="scss" scoped>
    .login-step-comp{
        height: 64px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        .comp-text{
            font-size: 14px;
            color: #4A4A4A;
            margin-left: 10px;
            &.disabled{
                color: #9B9B9B;
            }
        }

        .comp-line{
            width: 80px;
            height: 0px;
            border-top: 1px dashed #DCDCDC;
            margin: 0 30px;
        }
    }
</style>

