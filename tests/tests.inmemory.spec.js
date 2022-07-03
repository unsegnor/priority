const Priority = require("../index.js")
const prioritizedListTests = require("./prioritizedListTests.js")

describe('InMemoryPrioritizedList', function(){
    beforeEach(async function(){
        this.CreateList = async function(greater){
            return await Priority.createPrioritizedList(greater)
        }
    })

    prioritizedListTests()

})