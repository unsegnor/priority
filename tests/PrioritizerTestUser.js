module.exports = async function({prioritizer, id, greaterFunction, selectFunction}){
    let user = await prioritizer.getUser({id, greaterFunction, selectFunction, receiveLog})
    let logs = []

    async function receiveLog(message){
        logs.push(message)
    }

    return {
        addTask,
        getTasks,
        completeTask,
        enableGlobalLogs,
        disableGlobalLogs,
        readLogs
    }

    async function addTask(task){
        await user.addTask(task)
    }

    async function getTasks(){
        return user.getTasks()
    }

    async function completeTask(){
        return user.completeTask()
    }

    async function enableGlobalLogs(){
        await user.enableGlobalLogs()
    }

    async function disableGlobalLogs(){
        await user.disableGlobalLogs()
    }

    async function readLogs(){
        let currentLogs = logs
        logs = []
        return currentLogs
    }
}