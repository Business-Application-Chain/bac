<template>
    <div class="index-page">
        <login-header></login-header>
        <div class="page-title first-title"><b>BAC</b></div>
        <div class="page-title second-title"><b>An Open Network For <br> Smart Economy</b></div>
        <div class="login-btns">
            <router-link class="login-btn" to="/login/import">
                <i class="iconfont upload-icon">&#xe606;</i>
                {{$t('openWallet')}}
            </router-link>
            <router-link class="login-btn" to="/login/gen">
                <i class="iconfont">&#xe613;</i>
                {{$t('createWallet')}}
            </router-link>
            
            <router-link class="login-btn" to="/login/write">
                <i class="iconfont">&#xe614;</i>
                {{$t('createFile')}}
            </router-link>
        </div>
            
    </div>
</template>

<script>
    import LoginHeader from '../components/LoginHeader.vue'
    
    export default {
        components: {
            LoginHeader
        }    
    }
</script>

<style lang="scss" scoped>
    .index-page{
        background: #121F3E;
        min-height: 100%;

        .login-btns{
            width: 370px;
            margin: 58px auto;
        }

        .login-btn{
            display: block;
            height: 58px;
            line-height: 58px;
            text-align: center;
            color: #fff;
            font-size: 18px;
            padding: 0 24px;
            background: rgba(63,128,250,0.15);
            border: 2px solid #3F80FA;
            border-radius: 2px;
            margin-bottom: 30px;

            &:hover{
                background: #3F80FA
            }
            .iconfont{
                font-size: 20px;
                margin-right: 10px;
            }
        }

        .page-title{
            font-size: 50px;
            color: #fff;
            text-align: center;
            line-height: 70px;
        }

        .first-title{
            margin-top: 100px;
        }

        .second-title{
            margin-top: 50px;
        }

        .upload-icon{
            font-size: 30px;
        }

        .btn-primary{
            background: #3F80FA;
            border: 1px solid #3F80FA;
        }

        .btn-plain{
            background: rgba(63, 128, 250, .15);
            border: 1px solid #3F80FA;
            margin-left: 30px;
        }
    }
</style>