<script>
    export default{
        props: {
            tabs: Array,
            value: String
        },
        render (h) {
            return (
                <div class="tabs-body-comp">
                    {
                        this.tabs.map(item => {
                            if (item.value == this.value){
                                return <div>{item.slots}</div>
                            }
                        })
                    }
                </div>
               
            )
        }
    }
</script>

<style lang="scss" scoped>
    .tabs-body-comp{
        background: #fff;
    }
</style>
