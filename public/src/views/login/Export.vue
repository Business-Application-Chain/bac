<template>
    <div class="login-export-page">
        <login-step step="3"></login-step>
        <div class="page-title">
            {{$t('yourFile')}}
        </div>
        <div class="page-desc">
            {{$t('PleasekeepyourfileinasafeplaceYouwillneedtheminordertoretrievethewallet')}}
        </div>
        <div class="page-sec pointer-sec" @click="createAndDownloadFile">
            <div class="export-cont">
                <div class="export-cont_title">{{$t('Exportyourfile')}}</div>
                <img class="export-cont_img" src="../../assets/images/exportx2.png" />
                <div class="export-cont_ft">{{$t('Export')}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    
    import XBtn from '../../components/ui/XBtn.vue'
    import XInput from '../../components/ui/XInput.vue'
    import aes from '../../js/plugins/aes'
    import LoginStep from '../../components/LoginStep.vue'
    import exportFile from '../../js/plugins/export-file'

    export default {
        data () {
            return {
               
            }
        },
        components:{
            XBtn,
            XInput,
            LoginStep
        },

        computed:{
            
        },

        methods: {
            goBack () {
                this.$router.go(-1)
            },

            createAndDownloadFile () {
                var str = JSON.stringify(this.$store.state.key)
                var content = {
                    data: aes.encrypt(str)
                }

                exportFile('bac_keystore.json', JSON.stringify(content))
                
                this.$router.replace({
                    path: '/'
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-export-page{
        .page-title{
            font-size: 36px;
            color: #4A4A4A;
            line-height: 36px;
            text-align: center;
            margin-top: 60px;
        }
        .page-desc{
            font-size: 18px;
            color: #9B9B9B;
            line-height: 30px;
            width: 500px;
            margin: 28px auto;
        }

        .page-sec{
            background: #FFFFFF;
            box-shadow: 0 0 14px 0 rgba(0,0,0,0.02);
            border-radius: 4px;
            margin:0 auto 8px;
            width: 500px;
            box-sizing: border-box;
            padding: 0 30px;
            overflow: hidden;
        }

        .pointer-sec{
            cursor: pointer;
        }

        .export-cont{
            height: 75px;
            display: flex;
            align-items: center;
        }

        .export-cont_title{
            font-size: 18px;
            color: #4A4A4A;
            flex:1
        }

        .export-cont_img{
            width: 22px;
            height: 22px;
        }

        .export-cont_ft{
            font-family: Arial-BoldMT;
            font-size: 18px;
            color: #3F80FA;
            margin-left: 9px;
        }
       
        .btn-cont{
            display:flex;
            align-items: center;
            height: 100px;
        }

        .btn-cont_hd{
            flex: 1;
        }
    }
</style>
