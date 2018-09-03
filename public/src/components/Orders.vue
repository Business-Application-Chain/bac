<template>
    <div class="orders-comp">
        <div class="comp-header">
            <div class="comp-t1">交易HASH</div>
            <div class="comp-t2">发送者</div>
            <div class="comp-t3">接受者</div>
            <div class="comp-t4">日期</div>
            <div class="comp-t5"></div>
            <div class="comp-t6">金额/手续费</div>
        </div>
        <div v-for="item in list" :key="item.hash" class="comp-item active">
            <div class="comp-t1">
                <router-link :to="{name: 'explorerTransaction', params:{id: item.hash}}" class="comp-link" >{{item.hash}}</router-link>
            </div>
            <div class="comp-t2">
                <router-link :to="{name: 'contactDetail', params:{id: item.senderId}}" class="comp-link" replace>{{item.senderId}}</router-link>
                <!-- <div @click="go(item.senderId)" class="comp-link">{{item.senderId}}</div> -->
            </div>
            <div class="comp-t3">
                <router-link v-if="item.recipientId" :to="{name: 'contactDetail', params:{id: item.recipientId}}" class="comp-link" replace>{{item.recipientId}}</router-link>
                <div v-else>-</div>
                <!-- <div @click="go(item.recipientId)" class="comp-link">{{item.recipientId}}</div> -->
            </div>
            <div class="comp-t4">{{item.timestamp | date}}</div>
            <div class="comp-t5">
                
            </div>
            <div class="comp-t6">
                <div class="status-tag" :class="[item.senderType]">{{item.senderType | upper}}</div>
                {{item.amount | bac}} / {{item.fee | bac}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: Array
        },
        filters: {
            'upper' (value) {
                return value.toUpperCase()
            }
        },

        watch:{
            '$route' () {
                
            }
        },

        methods: {
            go (id) {
                this.$router.replace({
                    name: 'contactDetail',
                    params: {
                        id,
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "~/css/utils.scss";

    .orders-comp{
        .comp-header{
            font-size: 12px;
            color: #9B9B9B;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid  #F2F2F2;
            display: flex;
            align-items: center;
        }

        .comp-item{
            height: 50px;
            display: flex;
            align-items: center;

            font-size: 14px;
            color: #4A4A4A;
            border-bottom: 1px solid  #F2F2F2;

            &:hover{
                background: #F8FCFF;
            }
        }

        .comp-t1{
            margin-left: 24px;
            flex: 2;
            @include text-overflow();
        }

        .comp-t2{
            margin-left: 40px;
            flex: 1;
            @include text-overflow();
        }

        .comp-t3{
            margin-left: 40px;
            flex: 1;
            @include text-overflow();
        }

        .comp-t4{
            width: 80px;
            margin-left: 40px;
        }

        .comp-t5{
            width: 48px;
            margin-left: 40px
        }

        .comp-t6{
            margin-left: 10px;
            flex: 1;
            margin-right: 24px;
        }

        .comp-link{
            color: #4A90E2;
            cursor: pointer;
        }

        .comp-primary{
            color: #F5A623;
        }

        .status-tag{
            display: inline-block;
            background: #D8D8D8;
            border-radius: 2px;

            width: 48px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            font-size: 12px;
            color: #FFFFFF;
            margin-right: 5px;

            &.in{
                background: #24D17E;
            }

            &.out{
                background: #F5A623;
            }
        }
    }
</style>

