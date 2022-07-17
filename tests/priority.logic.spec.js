const { expect } = require("chai")
const Prioritizer = require('../index.js')
const {TestRepository} = require('persistent-programming')
const PrioritizerTestUser = require('./PrioritizerTestUser')
const PriorityTests = require('./priorityTests')

describe('Logic tests', function(){
    let prioritizer

    beforeEach(async function(){
        prioritizer = Prioritizer.createNew(TestRepository())

        this.getUser = async function(id, greaterFunction, selectFunction, receiveLog){
            return PrioritizerTestUser({
                prioritizer,
                id,
                greaterFunction,
                selectFunction,
                receiveLog
            })
        }
    }) 

    PriorityTests()

})