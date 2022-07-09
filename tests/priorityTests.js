const { expect } = require("chai")

module.exports = function(){
    describe('priority tests', function(){
        let user

        beforeEach(async function(){
            async function greaterFunction(task1, task2){
                if (task1 > task2) return task1;
                if (task2 > task1) return task2;
            }
            user = await this.getUser('1', greaterFunction)
        })

        it('introducing a task', async function(){
            await user.addTask('go shopping')
            let tasks = await user.getTasks()
    
            expect(tasks.length).to.equal(1)
            expect(tasks[0]).to.equal('go shopping')
        })
    
        it('introducing several tasks should order them', async function(){
            await user.addTask('1 go shopping')
            await user.addTask('2 fix the car')
            let tasks = await user.getTasks()
    
            expect(tasks.length).to.equal(2)
            expect(tasks[0]).to.equal('2 fix the car')
        })

        it('introducing a task that goes in the middle', async function(){
            await user.addTask('1 go shopping')
            await user.addTask('3 clean up')
            await user.addTask('2 fix the car')
            let tasks = await user.getTasks()
    
            expect(tasks.length).to.equal(3)
            expect(tasks[1]).to.equal('2 fix the car')
        })
    })
}
