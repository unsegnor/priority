const TelegramServer = require('telegram-test-api');

module.exports = function(){
    let server, client
    let token = "sampleToken"

    return {
        start: async function(){
            let serverConfig = {port: 9001}
            server = new TelegramServer(serverConfig);
            await server.start()
        },
        getUrl: function(){
            return server.config.apiURL
        },
        getClient: async function(userId){
            return server.getClient(token, {userId, chatId: userId, timeout: 500})
        },
        stop: async function(){
            await server.stop()
        },
        getToken: function(){
            return token
        }
    }
}