<template>
    <div class="main-page">
        <main-header></main-header>
        
        <div class="page-cont">
            <side-bar :name="$router.currentRoute.name"></side-bar>
            <div class="cont-bd">
                <transition  mode="out-in">
                    <router-view />
                </transition>
                
            </div>
        </div>
        
    </div>
</template>

<script>
    import MainHeader from '../components/MainHeader.vue'
    import SideBar from '../components/SideBar.vue'

    export default {
        components: {
            MainHeader,
            SideBar
        },
        created () {
            
        },
        watch: {
           
        }
    }
</script>


<style lang="scss" scoped>
    .main-page{
        
        .page-cont{
            display: flex;
            position: fixed;
            top: 85px;
            left: 0px;
            right: 0px;
            bottom: 0px;
        }

        .cont-bd{
            flex: 1;
            margin: 30px;
            overflow: auto;
        }
    }
</style>
