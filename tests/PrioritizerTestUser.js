module.exports = async function({prioritizer, id, greaterFunction, selectFunction}){

    let defaultGreaterFunction = async function (task1, task2){
        if (task1 > task2) return task1;
        if (task2 > task1) return task2;
    }

    let defaultSelectFunction = async function(task){
        return (task.includes(selectedText))
    }

    let user = await prioritizer.getUser({id,
        greaterFunction: greaterFunction || defaultGreaterFunction,
        selectFunction: selectFunction || defaultSelectFunction,
        receiveLog})
        
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