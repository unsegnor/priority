require("dotenv").config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const RedisRepository = require('persistent-programming-redis-state')
const PrioritizerTelegramBot = require('./domain/PrioritizerTelegramBot')

async function init(){
  let bot = await PrioritizerTelegramBot.createNew(RedisRepository({databaseId:1}), token)
  await bot.start()
}

init()

