<script>
    import {assign, uniqueId} from 'lodash'

    export default {
        props:{
            prop: String,
            label: String,
            width: String,
            minWidth: String
        },
        data () {
            return {
                id: uniqueId('table-column-')
            }
        },
        created () {
            const obj = assign({
                renderBody: data => {
                    return this.$scopedSlots.default ?  this.$scopedSlots.default(data) :  data[this.prop]
                }
            }, this.$props)

            obj.realStyle = {
                width: obj.width ? obj.width + 'px' : '',
                minWidth: (obj.minWidth || obj.width) + 'px', 
                flex: obj.minWidth
            }
            
            this.$parent.insertColumn(obj)
        },

        render () {
            return null
        },

        destroyed () {
            this.$parent.removeColumn(this.id)
        }
    }
</script>


