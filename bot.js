process.env.NTBA_FIX_319 = true
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require("dotenv")
dotenv.config()
const RedisState = require('persistent-programming-redis-state')
const Priority = require("./index.js")

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  console.log(msg.text)

  let list = await Priority.getPersistentPrioritizedList(compareWhichIsMoreImportant.bind(undefined, chatId), chatId, RedisState({databaseId:1}))
  await list.add(msg.text)

  let tasks = await list.toArray()
  let tasksString = ""
  for(let task of tasks){
    tasksString += task + "\n"
  }

  // send a message to the chat acknowledging receipt of their message
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
