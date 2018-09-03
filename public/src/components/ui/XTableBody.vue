<script>
    export default {
        props: {
            list: Array,
            columns: Array
        },
        render (h) {
            return (
                <div class="x-table-body">
                    {
                        this.list.map(item => {
                            return <div class="x-table-body_row">
                                {
                                    this.columns.map(column => {
                                        return <div class="x-table-body_row-cell" style={column.realStyle}>{column.renderBody(item)}</div>
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            )
        }
    }
</script>

<style lang="scss" scoped>
    .x-table-body{
        .x-table-body_row{
            display: flex;
            align-items: center;
            
            font-size: 14px;
            color: #4A4A4A;
            &:hover{
                .x-table-body_row-cell{
                    background: #F8FCFF;
                }
            }

            .link{
                color: #55A8FD;
            }
        }
        
        .x-table-body_row-cell{
            border-bottom: 1px solid #F2F2F2;
            height: 50px;
            line-height: 50px;
        }
    }
</style>
