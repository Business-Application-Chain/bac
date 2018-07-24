<template>
    <div class="pagination-comp">
        <div class="comp-btn arrow" :class="{disabled: currentPage == 1}" @click="prev">上一页</div>
        <div v-for="item in indexArr" :key="item.value" class="comp-btn" @click="changeCur(item)" :class="{active: item.value == currentPage}">{{item.value}}</div>
        <div class="comp-btn arrow" :class="{disabled: currentPage == pageCount}" @click="next">下一页</div>
    </div>
</template>
<script>
    export default{
        data () {
            return {
                indexArr: [1]
            }
        },
        props: {
            pageCount:{
                default: 10,
            },
            currentPage: {
                default: 1
            }
        },

        watch: {
            currentPage (newVal) {
                this.initArr()
            }
        },

        mounted () {
            this.initArr()
        },

        methods:{
            changeCur (item) {
                let newVal
                if(item.type == 'prev') {
                    newVal = this.currentPage - 5 < 1 ? 1 : this.currentPage - 5
                }else if (item.type == 'next') {
                    newVal = this.currentPage + 5 > this.pageCount ? this.pageCount : this.currentPage + 5
                }else {
                    newVal = item.value
                }
                
                this.change(newVal)
            },

            change (index) {
                this.$emit('update:currentPage', index)
                this.$emit('currentChange', index)
            },

            prev () {
                if (this.currentPage == 1) return;

                this.change(this.currentPage  - 1)
            },

            next () {
                if (this.currentPage == this.pageCount) return;

                this.change(this.currentPage + 1)
            },

            initArr () {
                let arr = [{
                    value: 1
                }]
                const cur = this.currentPage

                let min = cur - 2
                let max = cur + 2
                if (min < 2) {
                    max += ( 1 - min)
                }

                if (max > this.pageCount) {
                    min -= (max - this.pageCount)
                }

                for(let i = min; i <= max; i ++ ){
                    if (i > 1 && i < this.pageCount) {
                        if (i == min &&  i > 2) {
                            arr.push({
                                value: '<<',
                                type: 'prev'
                            })
                        }
                        arr.push({
                            value: i
                        })
                        if( i == max && max < this.pageCount - 1) {
                            arr.push({
                                value: '>>',
                                type: 'next'
                            })
                        }
                    }
                }

                arr.push({
                    value: this.pageCount
                })
                this.indexArr = arr
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination-comp{
        font-size:  0px;
        text-align: right;
        padding: 20px;
        user-select: none;

        .comp-btn{
            display: inline-block;
            background: #E2ECFF;
            border-radius: 2px;
            height: 32px;
            line-height: 32px;
            width: 32px;
            text-align: center;
            font-size: 13px;
            color: #3F80FA;
            margin-left: 8px;
            cursor: pointer;
            
            &.active{
                background: #3F80FA;
                color: #fff;
            }

            &.arrow{
                width: 80px;
            }

            &.disabled{
                color: #B0CAFD
            }

        }
    }
</style>
