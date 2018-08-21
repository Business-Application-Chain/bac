export default {
    props: {
        list: Array,
        columns: Array
    },
    render (h) {
        return (
            this.list.forEach( (item) => {
                <div>
                    this.columns.forEach( (column) => {
                        
                        <div>{column.slot ? column.slot : h('div', item[column.prop])}</div>
                    })
                </div>
            })
        )
    }
}