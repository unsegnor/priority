var events = require('events');
const User = require("./User")

module.exports = function(repository){
    let globalEvents = new events.EventEmitter();
    return {
        getUser: async function({id, greaterFunction, selectFunction, receiveLog}){
            return User.create({id, greaterFunction, repository, selectFunction, receiveLog, globalEvents})
        }
    }
}