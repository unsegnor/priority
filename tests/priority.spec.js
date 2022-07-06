const { expect } = require("chai")
const Prioritizer = require('../index.js')
const {TestRepository} = require('persistent-programming')
const User = require('../domain/User')

describe('priority tests', function(){
    async function greaterFunction(task1, task2){
        if (task1 > task2) return task1;
        if (task2 > task1) return task2;
    }

    let prioritizer

    this.beforeEach(function(){
        prioritizer = Prioritizer.createNew(TestRepository())
    })

    it('introducing a task', async function(){
        let user = await prioritizer.getUser({
            id: '1',
            greaterFunction
        })
        await user.addTask('go shopping')
        let tasks = await user.getTasks()

        expect(tasks.length).to.equal(1)
        expect(tasks[0]).to.equal('go shopping')
    })

    it('introducing several tasks should order them', async function(){
        let user = await prioritizer.getUser({
            id: '2',
            greaterFunction
        })
        await user.addTask('1 go shopping')
        await user.addTask('2 fix the car')
        let tasks = await user.getTasks()

        expect(tasks.length).to.equal(2)
        expect(tasks[0]).to.equal('2 fix the car')
    })
})