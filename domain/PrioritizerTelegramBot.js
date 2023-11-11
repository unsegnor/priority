// Stryker disable next-line all : next line is there to fix a bug from telegram bot package
process.env.NTBA_FIX_319 = true

const TelegramBot = require('node-telegram-bot-api');
const Prioritizer = require("../index.js")
const { nanoid } = require('nanoid');
const packageJson = require('../package.json')


let userState = {}

module.exports = {
    createNew: async function(repository, token){
        const prioritizer = Prioritizer.createNew(repository)
        let serverUrl = undefined
        let bot
        return {
            setTelegramServerURL: function(url){
                serverUrl = url
            },
            start,
            stop: async function(){
                await bot.stopPolling()
            }
        }

        async function compareWhichTaskIsMoreImportant(chatId, task1, task2){
            return new Promise(function(accept){
              let query_id = nanoid();
              let responseHanndler = async (query)=>{
                const data = JSON.parse(query.data)
                const receivedQueryId = data.query_id
                const response = data.response
              
                if(receivedQueryId == query_id){
                  bot.off('callback_query', responseHanndler)
          
                  if(response == 1) accept(task1)
                  if(response == 2) accept(task2)
                  accept()
                }
              }
          
              bot.on('callback_query', responseHanndler)
              bot.sendMessage(chatId, `¿Cuál va primero?`, {
                reply_markup: {
                  inline_keyboard: [
                    [{text: task1, callback_data: JSON.stringify({query_id, response: 1})}],
                    [{text: task2, callback_data: JSON.stringify({query_id, response: 2})}]
                  ]
                }
              })
            })
          }

          async function selectTask(chatId, task){
            return new Promise(function(accept){
              let query_id = nanoid();
              let responseHanndler = async (query)=>{
                const data = JSON.parse(query.data)
                const receivedQueryId = data.query_id
                const response = data.response
              
                if(receivedQueryId == query_id){
                  bot.off('callback_query', responseHanndler)
          
                  if(response == 1) accept(true)
                  if(response == 2) accept(false)
                  accept()
                }
              }
          
              bot.on('callback_query', responseHanndler)
              bot.sendMessage(chatId, `¿Has terminado ${task}?`, {
                reply_markup: {
                  inline_keyboard: [[
                    {text: "Sí", callback_data: JSON.stringify({query_id, response: 1})},
                    {text: "No", callback_data: JSON.stringify({query_id, response: 2})}
                  ]]
                }
              })
            })
          }

          async function showRecurrentTasksList(bot, user, chatId){
            //console.log('showing recurrent tasks')
            let tasks = await user.getRecurrentTasks()
            //console.log(`tasks: ${tasks}`)
            if(tasks.length == 0){
              bot.sendMessage(chatId, "No hay tareas recurrentes")
              return
            } 
            for(let task of tasks){
              let taskName = (await task.get('name')) 
              let taskText = taskName +' desde hace ' + (await task.get('time since last completion'))
              bot.sendMessage(chatId, `${taskText}`, {
                reply_markup: {
                  inline_keyboard: [[
                    {text: "Completar", callback_data: JSON.stringify({query_id:taskName, chatId, response: 'complete'})}
                  ]]
                }
              })
            }
          }

          async function showList(bot, user, chatId){
            let tasks = await user.getTasks()
            let tasksString = "Esta es tu lista ordenada: \n\n"
            for(let task of tasks){
              tasksString += task + "\n"
            }
          
            bot.sendMessage(chatId, tasksString);
          }

        async function start(){
            const botOptions = {polling: true, baseApiUrl: serverUrl};
            bot = new TelegramBot(token, botOptions);

            bot.on('message', async (msg) => {
                const chatId = msg.chat.id;
                if(msg.text.startsWith('/version')) {
                    bot.sendMessage(chatId, packageJson.version)
                    return
                }

                if(msg.text.startsWith('/start')) return
                
                let user = await prioritizer.getUser({
                    id: chatId,
                    greaterFunction: compareWhichTaskIsMoreImportant.bind(undefined, chatId),
                    selectFunction: selectTask.bind(undefined, chatId)
                  })
                
                if(msg.text.startsWith('/completar')){
                  await user.completeTask()
                  await showList(bot, user, chatId)
                  return
                }

                if(msg.text.startsWith('/recurrent')){
                  userState[chatId] = "Waiting for recurrent task name"
                  await showRecurrentTasksList(bot, user, chatId)
                  return
                }
                
                if(userState[chatId] == "Waiting for recurrent task name"){
                  userState[chatId] = undefined
                  await user.addRecurrentTask(msg.text)
                  await showRecurrentTasksList(bot, user, chatId)
                  return
                }

                  await user.addTask(msg.text)
                  await showList(bot, user, chatId)
            });

            bot.on('callback_query', async function(query){
              //console.log(`received callback ${query.data}`)
              const data = JSON.parse(query.data)
              const chatId = data.chatId
              const taskName = data.query_id
              const action = data.response

              if(action == 'complete'){
                let user = await prioritizer.getUser({
                  id: chatId,
                  greaterFunction: compareWhichTaskIsMoreImportant.bind(undefined, chatId),
                  selectFunction: selectTask.bind(undefined, chatId)
                })
                await user.completeRecurrentTask(taskName)
              }
            })
        }
    }
}
