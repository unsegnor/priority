process.env.NTBA_FIX_319 = true
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require("dotenv")
dotenv.config()
const RedisState = require('persistent-programming-redis-state')
const Priority = require("./index.js")

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if(msg.text[0] == '/') return

  let list = await Priority.getPersistentPrioritizedList(compareWhichIsMoreImportant.bind(undefined, chatId), chatId, RedisState({databaseId:1}))
  await list.add(msg.text)

  let tasks = await list.toArray()
  let tasksString = "Esta es tu lista ordenada: \n\n"
  for(let task of tasks){
    tasksString += task + "\n"
  }

  bot.sendMessage(chatId, tasksString);
});

async function compareWhichIsMoreImportant(chatId, task1, task2){

  return new Promise(function(accept){
    let responseHanndler = async (query)=>{
      const receivedChatId = query.message.chat.id
      const response = query.data
    
      if(receivedChatId == chatId){
        bot.off('callback_query', responseHanndler) //dejamos de escuchar respuestas ya tenemos la nuestra

        if(response == 1) accept(task1)
        if(response == 2) accept(task2)
        accept()
      }
    }

    bot.on('callback_query', responseHanndler)
    bot.sendMessage(chatId, `¿Cuál va primero?`, {
      reply_markup: {
        inline_keyboard: [[
          {text: task1, callback_data: 1},
          {text: task2, callback_data: 2}
        ]]
      }
    })
  })
}
