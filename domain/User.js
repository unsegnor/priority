const PrioritizedList = require("./PrioritizedList")

module.exports = {
    create: async function({id, greaterFunction, repository, selectFunction}){
        let list = await PrioritizedList.getPersistentPrioritizedList(greaterFunction, id, repository)
        return {
            addTask,
            getTasks,
            completeTask,
            enableGlobalActivityLogs,
            readLogs
        }

        async function addTask(task){
            await list.add(task)
        }

        async function getTasks(){
            return list.toArray()
        }

        async function completeTask(){
            let tasks = await getTasks()
            let selectedTask = undefined
            let currentTask = 0
            while(!selectedTask && currentTask < tasks.length){
                if(await selectFunction(tasks[currentTask])){
                    selectedTask = tasks[currentTask]
                    await list.remove(selectedTask)
                    break
                }
                currentTask++
            }
        }

        async function enableGlobalActivityLogs(){
            
        }

        async function readLogs(){

        }
    }
}