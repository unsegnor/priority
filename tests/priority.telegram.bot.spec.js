const { expect } = require("chai")
const {TestRepository} = require('persistent-programming')
const PriorityTests = require('./priorityTests')
const PrioritizerTelegramBot = require('../domain/PrioritizerTelegramBot')
const TelegramBotTestUser = require('./TelegramBotTestUser')
const FakeTelegramServer = require('./FakeTelegramServer')
const packageJson = require('../package.json')
const timeController = require('../domain/TimeController')

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
        
        // Deshabilitar time travelling para tests del bot de Telegram
        // Los tests del bot necesitan timing real para la comunicación simulada
        timeController.disableTimeTravel()
    })

    afterEach(async function(){
        await bot.stop()
        await telegramServer.stop()
    })

    PriorityTests()

    it('getting the version of the bot', async function(){
        let user = await this.getUser('1')
        let version = await user.getBotVersion()
        expect(version).to.equal(packageJson.version)
    })
})