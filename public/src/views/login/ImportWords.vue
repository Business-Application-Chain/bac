<template>
    <div class="login-importwords-page">
        <div class="page-title">
            {{$t('Importfile')}}
        </div>
        <div class="page-desc">
           
        </div>

        <div class="page-sec">
            <div class="import-sec">
                <div class="sec-title pointer-title">
                    <div class="title-hd"><b>{{$t('Openwalletfromfile')}}</b></div>
                </div>

                <div v-if="visible" class="file-sec">
                    <img class="file-sec_hd" src="../../assets/images/json.png" />
                    <div class="file-sec_bd">
                        <div class="sec_bd-title">{{title}}</div>
                        <div class="sec_bd-desc">{{$t('Done')}}</div>
                    </div>
                    <div class="file-sec_ft">
                        
                    </div>
                </div>

                <div @dragenter.prevent @dragover.prevent @drop.stop.prevent="drop" class="drag-cont">
                    <input class="upload-input" @change="upload" type="file" />
                    <img class="upload-img" src="../../assets/images/upload.png" />
                    <div class="upload-title">
                        <b>{{$t('DragDrogor')}}</b>
                        <b class="link"> {{$t('Browse')}}</b>
                    </div>
                    <div class="upload-desc"></div>
                </div>
            </div>
        </div>

        <div v-if="visible" class="page-sec">
            <div class="password-sec">
                <div class="sec-title pointer-title">
                    <div class="title-hd"><b>{{$t('password')}}</b></div>
                </div>

                <x-input :error-msg="$t('Passworddonotmatch')" :status="pwStatus" v-model="password" type="password"></x-input>
            </div>
        </div>

        <div v-if="visible" class="btn-sec">
            <x-btn @click="signIn" width="100%" height="60px" type="primary"><b>{{$t('SignIn')}}</b></x-btn>
        </div>
    </div>
</template>

<script>
    import XBtn from '~/components/ui/XBtn.vue'
    import aes from '~/js/plugins/aes'
    import XInput from '~/components/ui/XInput.vue'
    import sha256 from 'crypto-js/sha256'
    import api from '~/js/api/index'
    import Toast from '~/components/ui/toast/index'
    

    export default {
        data () {
            return {
                visible: false,
                title: 'File Name',
                password: '',
                pwStatus: ''
            }
        },
        components: {
            XBtn,
            XInput
        },

        watch: {
            password () {
                this.pwStatus = ''
            }
        },
        mounted () {
            
        },
        methods: {
            readFile (file) {
                if (!file) return;
                var reader = new FileReader();
                reader.onload = event => {
                    let data
                    let raw
                    try{
                        data = JSON.parse(event.target.result)
                        raw = aes.decrypt(data.data)
                    }catch(e){
                        Toast.error('文件内容有误，请选择正确的文件')
                        return
                    }

                    this.title = file.name
                    this.visible = true
                    this.$store.dispatch('setKey', JSON.parse(raw))
                }
                reader.readAsText(file);
            },

            drop (e) {
                const file = e.dataTransfer.files[0]
                this.readFile(file)
            },

            upload (e) {
                const file = e.target.files[0]
                this.readFile(file)
            },

            signIn () {
                const pw = sha256(this.password).toString()

                if (pw == this.$store.state.key.password) {
                    this.pwStatus = 'success'
                    
                    api.account.open([this.$store.state.key.mnemonic]).then(res => {
                        if (res === null) return;
                        
                        localStorage.setItem('key', JSON.stringify(this.$store.state.key))
                        localStorage.setItem('account', JSON.stringify(res.account))
                        this.$store.dispatch('setAccount', res.account)
                        this.$router.push({name: 'dashboard'})
                    })
                } else{
                    this.pwStatus = 'error'
                }
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-importwords-page{
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
            width: 820px;
            margin: 28px auto;
        }

        .page-sec{
            background: #FFFFFF;
            box-shadow: 0 0 14px 0 rgba(0,0,0,0.02);
            border-radius: 4px;
            margin:0 auto 8px;
            width: 820px;
            box-sizing: border-box;
            padding: 0 30px;
            overflow: hidden;
        }
        .words-sec{
            padding-bottom:40px;
        }
        .sec-title{
            display: flex;
            align-items: center;
            margin-top: 30px;
            margin-bottom: 14px;
        }

        .title-hd{
            font-size: 18px;
            color: #4A4A4A;
            line-height: 18px;           
        }

        .title-bd{
            margin-left: 40px;
            flex: 1;
            height: 0px;
            border-top: 1px solid #eee;
        }

        .title-ft{
            margin-left: 15px;
        }
        .import-sec{
            padding-bottom: 28px;
        }

        .arrow-icon{
            transition: all .3s;

            &.active{
                transform: rotate(-180deg)
            }
        }

        .file-sec{
            display: flex;
            align-items: center;
            height: 80px;
            background: #F8F9FC;
            border: 1px solid #E6E6E6;
            border-radius: 1px;
            padding: 0 30px 0 25px;
            margin-bottom: 8px;
        }

        .file-sec_hd{
            width: 42px;
            height: 42px;
        }

        .file-sec_bd{
            flex: 1;
            margin-left: 17px;
            line-height: 1;

            .sec_bd-title{
                font-size: 16px;
                color: #4A4A4A;
            }
            .sec_bd-desc{
                font-size: 14px;
                color: #9B9B9B;
                margin-top: 6px;
            }
        }

        .file-sec_ft{
            line-height: 1;
            cursor: pointer;
            .iconfont{
                font-size: 22px;
                color: #d8d8d8
            }
        }

        .drag-cont{
            border: 1px dashed #E2ECFF;
            border-radius: 1px;
            height: 362px;
            text-align: center;
            position: relative;
        }

        .upload-input{
            position: absolute;
            z-index: 9;
            top: 0px;
            left: 0px;
            width: 100%;
            bottom: 0px;
            opacity: 0;
            cursor: pointer;
        }

        .upload-img{
            width: 100px;
            height: 67px;
            margin-top: 130px;
        }

        .upload-title{
            font-size: 16px;
            color: #4A4A4A;
            margin-top: 65px;
        }

        .upload-desc{
            font-size: 16px;
            color: #9B9B9B;
            line-height: 16px;
            margin-top: 10px;
        }

        .link{
            color: #3F80FA;
        }

        .password-sec{
            padding-bottom: 10px;
        }

        .btn-sec{
            width: 820px;
            margin: 0 auto;
        }
        
    }
</style>

