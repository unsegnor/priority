require("dotenv").config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const {TestRepository} = require('persistent-programming')
const PrioritizerTelegramBot = require('./domain/PrioritizerTelegramBot')
const TimeController = require('./domain/TimeController')

async function init(){
  const timeController = new TimeController()
  let bot = await PrioritizerTelegramBot.createNew(TestRepository(), token, timeController)
  await bot.start()
}

init()

