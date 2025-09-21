const User = require("./User")

module.exports = function(repository, timeController){
    return {
        getUser: async function({id, greaterFunction, selectFunction}){
            return User.create({
                id, 
                greaterFunction, 
                repository, 
                selectFunction,
                timeController
            })
        }
    }
}