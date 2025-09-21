module.exports = async function({client, greaterFunction, selectFunction}){
    async function startBot(){
        await sendMessage('/start');
    }

    async function selectOption(option1, option2){
        let selectedText = await greaterFunction(option1.text, option2.text)
        if(selectedText == option1.text) return option1
        if(selectedText == option2.text) return option2
    }

    async function sendMessage(message){
        //console.log(`Sending message ${message}`)
        const msg = client.makeMessage(message);
        await client.sendMessage(msg);
    }

    async function waitResponse(){
        const updates = await client.getUpdates();
        if(updates.result.length > 1) throw new Error("We were expecting one message but got more")
        return updates.result[0].message
    }

    async function waitResponses(){
        const updates = await client.getUpdates();
        return updates.result
    }

    let tasksList = []
    //let recurrentTasks = []

    await startBot()
    return {
        addTask: async function(task){
            await sendMessage(task);
            let finished_interaction = false
            while(!finished_interaction){
                let response = await waitResponse()
                if(response.text.includes("lista")){
                    let splittedResponse = response.text.split("\n")
                    tasksList = splittedResponse.slice(2,splittedResponse.length-1)
                    finished_interaction = true
                }else if(response.text.includes("?")){
                    let options = response.reply_markup.inline_keyboard
                    let selectedOption = await selectOption(options[0][0], options[1][0])
                    await sendCallBack(selectedOption.callback_data)
                }
            }
        },
        getTasks: async function(){
            return tasksList
        },
        getBotVersion: async function(){
            await sendMessage("/version")
            let response = await waitResponse()
            return response.text
        },
        completeTask: async function(){
            await sendMessage("/completar")
            let finished_interaction = false
            while(!finished_interaction){
                let response = await waitResponse()
                if(response.text.includes("lista")){
                    let splittedResponse = response.text.split("\n")
                    tasksList = splittedResponse.slice(2,splittedResponse.length-1)
                    finished_interaction = true
                }else if(response.text.includes("?")){
                    let options = response.reply_markup.inline_keyboard
                    let selectedOption
                    if(await selectFunction(response.text)) selectedOption = options[0][0]
                    else selectedOption = options[0][1]
                    await sendCallBack(selectedOption.callback_data)
                }
            }
        },
        addRecurrentTask: async function(name){
            await sendMessage("/recurrent")
            let initialResponses = await waitResponses()
            await sendMessage(name)
            let finalResponses = await waitResponses()
            // Asegurar que la operación se complete correctamente
            // esperando a que aparezca la nueva tarea en la lista
            if(finalResponses.length === 0 || finalResponses[0].message.text === "No hay tareas recurrentes") {
                throw new Error("Failed to add recurrent task: " + name)
            }
        },
        getRecurrentTasks: async function(){
            await sendMessage("/recurrent")
            let responses = await waitResponses()
            //console.log('responses', responses)
            let recurrentTasks = []
            if(responses[0].message.text == "No hay tareas recurrentes") return []
            for(let response of responses){
                let taskText = response.message.text
                let taskProperties = taskText.split(' desde hace ')
                recurrentTasks.push({
                    get: async function(property){
                        if(property == 'name') return taskProperties[0]
                        else return taskProperties[1]
                    },
                    complete: async function(){
                        //console.log('reply_markup', response.message.reply_markup)
                        let completeOption = response.message.reply_markup.inline_keyboard[0][0]
                        await sendCallBack(completeOption.callback_data)
                    },
                    remove: async function(){
                        let removeOption = response.message.reply_markup.inline_keyboard[0][1]
                        await sendCallBack(removeOption.callback_data)
                    }
                })
            }
            return recurrentTasks
        },
        completeRecurrentTask: async function(name){
            // Usar el método directo sin llamar a getRecurrentTasks primero
            // para evitar interferencias con el time travelling
            await sendMessage("/recurrent")
            let responses = await waitResponses()
            
            if(responses.length === 0 || responses[0].message.text === "No hay tareas recurrentes") {
                throw new Error("No recurrent tasks found to complete")
            }
            
            for(let response of responses){
                let taskText = response.message.text
                let taskProperties = taskText.split(' desde hace ')
                let taskName = taskProperties[0]
                
                if(taskName === name) {
                    let completeOption = response.message.reply_markup.inline_keyboard[0][0]
                    await sendCallBack(completeOption.callback_data)
                    return
                }
            }
            throw new Error(`Recurrent task '${name}' not found`)
        },
        removeRecurrentTask: async function(name){
            // Usar el método directo para consistencia
            await sendMessage("/recurrent")
            let responses = await waitResponses()
            
            if(responses.length === 0 || responses[0].message.text === "No hay tareas recurrentes") {
                throw new Error("No recurrent tasks found to remove")
            }
            
            for(let response of responses){
                let taskText = response.message.text
                let taskProperties = taskText.split(' desde hace ')
                let taskName = taskProperties[0]
                
                if(taskName === name) {
                    let removeOption = response.message.reply_markup.inline_keyboard[0][1]
                    await sendCallBack(removeOption.callback_data)
                    return
                }
            }
            throw new Error(`Recurrent task '${name}' not found`)
        }
    }

    async function sendCallBack(data){
        if (data.length > 55) throw new Error(`Trying to send a callback lenght greater than 55 allowed by current telegram API: ${data}`)
        const callback = client.makeCallbackQuery(data);
        await client.sendCallback(callback);
    }
}