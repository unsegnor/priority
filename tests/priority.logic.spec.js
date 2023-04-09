const { expect } = require("chai")
const Prioritizer = require('../index.js')
const {TestRepository} = require('persistent-programming')
const PrioritizerTestUser = require('./PrioritizerTestUser')
const PriorityTests = require('./priorityTests')

describe('Logic tests', function(){
    let prioritizer, testRepository

    beforeEach(async function(){
        testRepository = TestRepository()

        prioritizer = Prioritizer.createNew(testRepository)

        this.getUser = async function(id, greaterFunction, selectFunction, receiveLog){
            return PrioritizerTestUser({
                prioritizer,
                id,
                greaterFunction,
                selectFunction,
                receiveLog
            })
        }

        this.restart = async function(){
            prioritizer = Prioritizer.createNew(testRepository)
        }
    }) 

    PriorityTests()

})