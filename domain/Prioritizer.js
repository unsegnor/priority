const User = require("./User")

module.exports = function(repository){
    return {
        getUser: async function({id, greaterFunction, selectFunction}){
            return User.create({id, greaterFunction, repository, selectFunction})
        }
    }
}