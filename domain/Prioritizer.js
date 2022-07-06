const User = require("./User")

module.exports = function(repository){
    return {
        getUser: async function({id, greaterFunction}){
            return User.create({id, greaterFunction, repository})
        }
    }
}