<template>
    <div class="lang-comp" v-click-outside="hide">
        <div class="comp-cont" @click="visible = !visible">
            <img class="comp-img" v-if="$i18n.locale == 'zh'" src="../assets/images/zh.png" />
            <img class="comp-img" v-if="$i18n.locale == 'en'" src="../assets/images/en.png" />
            <div class="comp-text">{{$t('lang')}}</div>
            <i class="iconfont arrow-icon" :class="{active: visible}">&#xe607;</i>
        </div>

        <transition name="fade-in-up">
            <div v-if="visible" class="comp-hide">
                <div class="hide-item" @click="setLang('zh')">
                    <img class="hide-item_img" src="../assets/images/zh.png" />
                    <div class="hide-item_txt">中文(简)</div>
                </div>
                <div class="hide-item" @click="setLang('en')">
                    <img class="hide-item_img" src="../assets/images/en.png" />
                    <div class="hide-item_txt">English</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside'

    export default {
        data () {
            return {
                visible: false
            }
        },
        mounted () {
            console.log(this.$i18n.locale)
        },
        directives:{
            ClickOutside
        },
        methods:{
            setLang (lang) { 
                this.$i18n.locale = lang
                this.visible = false
                localStorage.setItem('lang', lang)
            },
            hide () {
                this.visible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .lang-comp{
        
        
        position: relative;

        .comp-cont{
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .comp-img{
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }

        .comp-text{
            font-size: 14px;
            color: #FFFFFF;
            line-height: 16px;
            margin-left: 14px;
        }

        .arrow-icon{
            color: #fff;
            font-size: 12px;
            margin-left: 10px;
            transition: all .3s;

            &.active{
                transform: rotate(-180deg)
            }
        }

        

        .comp-hide{
            position: absolute;
            z-index: 9;
            box-shadow: 0 0 8px rgba(0, 0,0, .1);
            top: 38px;
            width: 160px;
            left: 50%;
            margin-left: -80px
        }
        .hide-item{
            display: flex;
            align-items: center;
            height: 50px;
            background: #fff;
            cursor: pointer;

            &:first-child{
                border-radius: 4px 4px 0 0;
            }
            &:last-child{
                border-radius: 0px 0px 4px 4px;
            }
        }

        .hide-item_img{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-left: 30px;
        }

        .hide-item_txt{
            font-size: 14px;
            color: #4A4A4A;
            line-height: 16px;
            margin-left: 14px;
        }
    }
</style>

