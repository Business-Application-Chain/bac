<template>
    <div class="login-header-comp">
        <router-link :to="{path: '/'}" class="logo">
            <img class="logo-img" src="../assets/images/logo.png" />
        </router-link>
        <lang></lang>
    </div>
</template>

<script>
    import Lang from './lang.vue'
    
    export default {
        components:{
            Lang
        }
    }
</script>

<style lang="scss" scoped>
    .login-header-comp{
        background: #121F3E;
        height: 85px;
        display: flex;
        align-items: center;
        padding: 0 140px;

        .logo{
            flex:1 
        }

        .logo-img{
            width: 130px;
            height: 40px;
        }
    }
</style>
