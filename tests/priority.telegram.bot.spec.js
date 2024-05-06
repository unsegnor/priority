const { expect } = require("chai")
const {TestRepository} = require('persistent-programming')
const PriorityTests = require('./priorityTests')
const PrioritizerTelegramBot = require('../domain/PrioritizerTelegramBot')
const TelegramBotTestUser = require('./TelegramBotTestUser')
const FakeTelegramServer = require('./FakeTelegramServer')
const packageJson = require('../package.json')

describe('Telegram bot tests', function(){
    let telegramServer, bot

    beforeEach(async function(){
        telegramServer = FakeTelegramServer()
        await telegramServer.start()

        bot = await PrioritizerTelegramBot.createNew(TestRepository(), telegramServer.getToken())
        bot.setTelegramServerURL(telegramServer.getUrl())
        await bot.start()

        this.getUser = async function(greaterFunction, selectFunction){
            return TelegramBotTestUser({
                client: telegramServer.getClient(),
                greaterFunction,
                selectFunction
            })
        }
    })

    afterEach(async function(){
        await bot.stop()
        await telegramServer.stop()
    })

    PriorityTests({fastSetup: false})

    it('getting the version of the bot', async function(){
        let user = await this.getUser('1')
        let version = await user.getBotVersion()
        expect(version).to.equal(packageJson.version)
    })
})