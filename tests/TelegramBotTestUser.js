module.exports = async function({client, id, greaterFunction}){
    async function startBot(){
        sendMessage('/start');
    }

    async function selectOption(option1, option2){
        let selectedText = await greaterFunction(option1.text, option2.text)
        if(selectedText == option1.text) return option1
        if(selectedText == option2.text) return option2
    }

    async function sendMessage(message){
        const msg = client.makeMessage(message);
        await client.sendMessage(msg);
    }

    async function waitResponse(){
        const updates = await client.getUpdates();
            if(updates.result.length > 1) throw "We were expecting one message but got more"
            let response = updates.result[0].message
            return response
    }

    let tasksList = []

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
                    const callback = client.makeCallbackQuery(selectedOption.callback_data);
                    await client.sendCallback(callback);
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
        }
    }
}