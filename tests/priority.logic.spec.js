const { expect } = require("chai")
const Prioritizer = require('../index.js')
const {TestRepository} = require('persistent-programming')
const TimeController = require('../domain/TimeController')
const PriorityTests = require('./priorityTests')

describe('Logic tests', function(){
    let prioritizer, timeController

    beforeEach(function(){
        timeController = new TimeController()
        prioritizer = Prioritizer.createNew(TestRepository(), timeController)

        // Inyectar timeController en el contexto del test
        this.timeController = timeController
        
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