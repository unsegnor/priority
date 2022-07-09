const TelegramServer = require('telegram-test-api');

module.exports = function(){
    let server, client
    let token = "sampleToken"

    return {
        start: async function(){
            let serverConfig = {port: 9001}
            server = new TelegramServer(serverConfig);
            await server.start()
            client = server.getClient(token)
        },
        getUrl: function(){
            return server.config.apiURL
        },
        getClient: function(){
            return client
        },
        stop: async function(){
            await server.stop()
        },
        getToken: function(){
            return token
        }
    }
}