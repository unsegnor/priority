const PrioritizedList = require("./PrioritizedList")

module.exports = {
    create: async function({id, greaterFunction, repository}){
        let list = await PrioritizedList.getPersistentPrioritizedList(greaterFunction, id, repository)
        return {
            addTask: async function(task){
                await list.add(task)
            },
            getTasks: async function(){
                return await list.toArray()
            }
        }
    }
}