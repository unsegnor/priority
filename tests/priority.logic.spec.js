const { expect } = require("chai")
const Prioritizer = require('../index.js')
const {TestRepository} = require('persistent-programming')
const User = require('../domain/User')
const PriorityTests = require('./priorityTests')

describe('Logic tests', function(){
    let prioritizer

    beforeEach(function(){
        prioritizer = Prioritizer.createNew(TestRepository())

        this.getUser = async function(greaterFunction, selectFunction){
            return prioritizer.getUser({
                id:'1',
                greaterFunction,
                selectFunction
            })
        }
    }) 

    PriorityTests()

})