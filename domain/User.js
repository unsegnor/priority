const PrioritizedList = require("./PrioritizedList")

module.exports = {
    create: async function({id, greaterFunction, repository, selectFunction, receiveLog, globalEvents}){
        let list = await PrioritizedList.getPersistentPrioritizedList(greaterFunction, id, repository)
        let userState
        let configuration
        await initializeConfiguration()

        async function initializeConfiguration(){
            //TODO: simplify this adding new features to persistent programming

            userState = await repository.getRoot(`${id}-user`)
            configuration = await userState.get('configuration')
            if(!configuration) { 
                console.log(id, 'creating new configuration')
                //TODO: here we had to initialize the object if it didn't exist, but it should be done by persistent programming
                configuration = await repository.getNew()
                userState.set('configuration', configuration)
            }

            //TODO: this is also an initialization, we could have an initialize function in persistent programming
            if(!(await configuration.get('globalLogsEnabled'))) await configuration.set('globalLogsEnabled', 'false')

            //TODO: this is also a bit weird but maybe unavoidable, in the end we have to set the listeners again whenever we load the user or persist the listeners
            let globalLogsEnabled = await isConfigLogsEnabled()
            console.log(id, 'globalLogsEnabled during initialization:', globalLogsEnabled)
            if(globalLogsEnabled) await globalEvents.on('task-created', onTaskCreated)

            //console.log('globalEvents', globalEvents)
        }

        async function isConfigLogsEnabled(){
            return (await configuration.get('globalLogsEnabled')) == 'true'
        }

        return {
            addTask,
            getTasks,
            completeTask,
            enableGlobalLogs,
            disableGlobalLogs
        }

        async function addTask(task){
            await list.add(task)
            console.log(id, 'emitting task-created')
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
            if(!(await isConfigLogsEnabled())){
                console.log(id, 'enabling global logs')
                await globalEvents.on('task-created', onTaskCreated)
                await configuration.set('globalLogsEnabled', 'true')
                console.log(id, 'enabled global logs', await isConfigLogsEnabled())
            }
        }

        async function onTaskCreated(){
            console.log(id, 'received task created')
            await receiveLog('tarea creada')
        }

        async function disableGlobalLogs(){
            if(await isConfigLogsEnabled()){
                await globalEvents.removeListener('task-created', onTaskCreated)
                await configuration.set('globalLogsEnabled', 'false')
            }
        }
    }
}