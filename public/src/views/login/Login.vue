<template>
    <div class="login-page">
        <login-header></login-header>
        
        <router-view ></router-view>
        
    </div>
</template>

<script>
    import LoginHeader from '../../components/LoginHeader.vue'
    import LoginStep from '../../components/LoginStep.vue'
    
    export default {
        data () {
            return {
                transitionName: ''
            }
        },
        components: {
            LoginHeader,
            LoginStep
        },
        watch: {
            
        }
    }
</script>

<style lang="scss">
    .login-page{
        
    }
</style>
