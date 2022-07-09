// Stryker disable next-line all : next line is there to fix a bug from telegram bot package
process.env.NTBA_FIX_319 = true

const TelegramBot = require('node-telegram-bot-api');
const Prioritizer = require("../index.js")
const { nanoid } = require('nanoid');
const packageJson = require('../package.json')

module.exports = {
    createNew: async function(repository, token){
        const prioritizer = Prioritizer.createNew(repository)
        let serverUrl = undefined
        let bot
        return {
            setTelegramServerURL: function(url){
                serverUrl = url
            },
            start: async function(){
                const botOptions = {polling: true, baseApiUrl: serverUrl};
                bot = new TelegramBot(token, botOptions);

                async function compareWhichIsMoreImportant(chatId, task1, task2){

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

                bot.on('message', async (msg) => {
                    const chatId = msg.chat.id;
                    if(msg.text == '/version') {
                        bot.sendMessage(chatId, packageJson.version)
                        return
                      }
                    if(msg.text[0] == '/') return
                    let user = await prioritizer.getUser({
                        id: chatId,
                        greaterFunction: compareWhichIsMoreImportant.bind(undefined, chatId)
                      })
                    
                      await user.addTask(msg.text)
                    
                      let tasks = await user.getTasks()
                      let tasksString = "Esta es tu lista ordenada: \n\n"
                      for(let task of tasks){
                        tasksString += task + "\n"
                      }
                    
                      bot.sendMessage(chatId, tasksString);
                  });
            },
            stop: async function(){
                await bot.stopPolling()
            }
        }
    }
}