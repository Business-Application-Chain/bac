
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
                        return <div class="x-table-body_cell">
                            {
                                this.columns.map(column => {
                                    return column.slot ? h('div', column.slot) : <div>{item[column.prop]}</div>
                                    
                                })
                            }
                        </div>
                        
                    })
                }
            </div>
            
        )
    }
}