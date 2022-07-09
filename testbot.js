require("dotenv").config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const {TestRepository} = require('persistent-programming')
const PrioritizerTelegramBot = require('./domain/PrioritizerTelegramBot')

async function init(){
  let bot = await PrioritizerTelegramBot.createNew(TestRepository(), token)
  await bot.start()
}

init()

