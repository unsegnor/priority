const PrioritizedList = require("../domain/PrioritizedList.js")
const prioritizedListTests = require("./prioritizedListTests.js")

describe('InMemoryPrioritizedList', function(){
    beforeEach(async function(){
        this.CreateList = async function(greater){
            return PrioritizedList.createPrioritizedList(greater)
        }
    })

    prioritizedListTests()

})