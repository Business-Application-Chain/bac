<template>
    <div class="message-index-page sec">
        <div class="sec-header">系统消息</div>

        <div class="empty-sec">
            <img class="empty-sec_img" src="../../assets/images/message.png" />
            <div class="empty-sec_hint">没有系统消息</div>
        </div>

        <div class="item">
            <div class="item-hd"></div>
            <div class="item-ft">
                <div class="ft-desc">
                    <span>公告</span>
                    <span class="desc-time">今天 12:04</span>
                </div>
                <div class="ft-title">Y-Milk未来牛奶平台包装设计大赛正在进行中！</div>
                <div class="ft-cont">
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                </div>
            </div>
        </div>

        <div class="item">
            <div class="item-hd"></div>
            <div class="item-ft">
                <div class="ft-desc">
                    <span>公告</span>
                    <span class="desc-time">今天 12:04</span>
                </div>
                <div class="ft-title">Y-Milk未来牛奶平台包装设计大赛正在进行中！</div>
                <div class="ft-cont">
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                    你的想象力会投向星河的深邃、都市的繁华、还是日常的温度？
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .message-index-page{
        min-height: 450px;
        .item{
            display: flex;
            margin: 20px 30px 0;
            padding-bottom: 33px;

            &:not(:last-child){
                border-bottom: 1px solid #f2f2f2;
            }
        }

        .item-hd{
            width: 48px;
            height: 48px;
            line-height: 48px;
            border-radius: 50%;
            text-align: center;
            background: #474747;
        }

        .item-ft{
            flex: 1;
            margin-left: 23px;
        }

        .ft-desc{
            font-size: 12px;
            color: #9B9B9B;
        }

        .desc-time{
            margin-left: 30px;
        }

        .ft-title{
            color: #4A4A4A;
            font-size: 14px;
            margin-top: 12px;
            line-height: 24px;
        }

        .ft-cont{
            color: #9B9B9B;
            font-size: 14px;
            line-height: 24px;
        }

        .empty-sec{
            margin-top: 96px;
            text-align: center;
        }

        .empty-sec_img{
            width: 100px;
            height: 80px;
        }

        .empty-sec_hint{
            margin-top: 20px;
            font-size: 16px;
            color: #4A4A4A;
        }
    }
</style>

