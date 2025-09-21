require("dotenv").config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const RedisRepository = require('persistent-programming-redis-state')
const PrioritizerTelegramBot = require('./domain/PrioritizerTelegramBot')
const TimeController = require('./domain/TimeController')

async function init(){
  const timeController = new TimeController()
  let bot = await PrioritizerTelegramBot.createNew(RedisRepository({databaseId:1}), token, timeController)
  await bot.start()
}

init()

