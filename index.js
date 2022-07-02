module.exports = {
    createPrioritizedList: async function (greater){
        let items = []
        function arrayInsert(array, item, position){
            array.splice(position, 0, item)
        }

        async function getPositionToInsert(item){
            let list_start = 0
            let list_end = items.length
            while (list_start < list_end){
                let middle_position = Math.floor((list_start + list_end)/2)
                if (await greater(item, items[middle_position]) == item) list_end = middle_position
                else list_start = middle_position +1
            }
            return list_start
        }

        return {
            toArray: function (){
                return items
            },
            add: async function(item){
                if(items.length == 0) items.push(item)
                else{
                    let position = await getPositionToInsert(item)
                    arrayInsert(items, item, position)
                }
            }
        }
    }
}
