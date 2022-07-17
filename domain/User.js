const PrioritizedList = require("./PrioritizedList")

module.exports = {
    create: async function({id, greaterFunction, repository, selectFunction, receiveLog, globalEvents}){
        let list = await PrioritizedList.getPersistentPrioritizedList(greaterFunction, id, repository)
        return {
            addTask,
            getTasks,
            completeTask,
            enableGlobalLogs,
            disableGlobalLogs
        }

        async function addTask(task){
            await list.add(task)
            globalEvents.emit('task-created')
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

        async function enableGlobalLogs(){
            await globalEvents.on('task-created', onTaskCreated)
        }

        async function onTaskCreated(){
            await receiveLog('tarea creada')
        }

        async function disableGlobalLogs(){
            console.log('antes', globalEvents.listeners('task-created'))
            await globalEvents.removeListener('task-created', onTaskCreated)
            console.log('después', globalEvents.listeners('task-created'))
        }
    }
}