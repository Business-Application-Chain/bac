<template>
    
    <div class="searchbar-comp" :class="{active: isActive}">
        <input :value="value" @input="$emit('input', $event.target.value)"  @keyup.enter="search" @focus="isActive = true" @blur="isActive = false" :placeholder="placeholder " type="text" class="search-input">
        <div v-if="value" @click="clear" class="search-close"><i class="iconfont">&#xe60f;</i></div>
        <div @click="search" class="search-btn">{{$t('Search')}}</div>
    </div>
    
</template>

<script>
    export default {
        data () {
            return {
                isActive: false,
                
            }
        },
        props: {
            value: {
                default: ''
            },
            placeholder: {
                default: 'hash / name'
            }
        },
        methods: {
            search () {
                this.$emit('submit', this.value)
            },
            clear () {
                this.$emit('input', '')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .searchbar-comp{
        height: 50px;
        line-height: 50px;        
        border-radius: 4px;
        display: flex;
        align-items: center;
        position: relative;
        border: 1px solid #F5F7FC;

        &.active{    
            border: 1px solid rgba(63,128,250,0.50);
        }
    }

    .search-input{
        flex: 1;
        border: none;
        height: 100%;
        border-radius: 4px 0 0 4px;
        text-indent: 30px;
        &::-webkit-input-placeholder{
            color: #CBCBCB;
        }

        
    }

    .search-btn{
        background: #E2ECFF;
        border-radius: 0 4px 4px 0;
        font-size: 16px;
        color: #3F80FA;
        width: 110px;
        text-align: center;
        height: 100%;
        cursor: pointer;
    }

    .search-close{
        position: absolute;
        z-index: 9;
        right: 140px;
        line-height: 1;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;

        .iconfont{
            font-size: 22px;
            color: #dbdbdb
        }
    }
</style>
