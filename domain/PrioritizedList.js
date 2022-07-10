async function getPositionToInsert(item, list, greater){
    let list_start = 0
    let list_end = list.length
    while (list_start < list_end){
        let middle_position = Math.floor((list_start + list_end)/2)
        if (await greater(item, list[middle_position]) == item) list_end = middle_position
        else list_start = middle_position +1
    }
    return list_start
}

function arrayInsert(array, item, position){
    array.splice(position, 0, item)
}

function arrayRemove(array, position){
    array.splice(position, 1)
}

module.exports = {
    createPrioritizedList: async function (greater){
        let items = []
        return {
            toArray: async function (){
                return items
            },
            add: async function(item){
                let position = await getPositionToInsert(item, items, greater)
                arrayInsert(items, item, position)
            }
        }
    },

    getPersistentPrioritizedList: async function(greater, name, state){
        let app = await state.getRoot(name)
        let items = await app.get('items') || []

        return {
            add: async function(item){
                let position = await getPositionToInsert(item, items, greater)
                arrayInsert(items, item, position)
                await app.set('items', items)
            },
            toArray: async function(){
                return items
            },
            remove: async function(item){
                let position = items.indexOf(item)
                arrayRemove(items, position)
                await app.set('items', items)
            }
        }
    }
}