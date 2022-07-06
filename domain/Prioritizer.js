const User = require("./User")

module.exports = function(repository){
    return {
        getUser: async function({id, greaterFunction}){
            return await User.create({id, greaterFunction, repository})
        }
    }
}