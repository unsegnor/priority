const { expect } = require("chai")

module.exports = function(){
    describe('priority tests', function(){
        let user, selectedText

        beforeEach(async function(){
            selectedText = undefined
            async function greaterFunction(task1, task2){
                if (task1 > task2) return task1;
                if (task2 > task1) return task2;
            }

            async function selectFunction(task){
                return (task.includes(selectedText))
            }
            user = await this.getUser(greaterFunction, selectFunction)
        })


        describe('Introducing tasks', async function(){
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

        describe('complete a task', function(){
            it('complete the task in the middle of the list', async function(){
                this.timeout(10000)
                await user.addTask('1 go shopping')
                await user.addTask('2 fix the car')
                await user.addTask('3 clean up')
                selectedText = '2 fix the car'
                await user.completeTask()
                let tasks = await user.getTasks()
        
                expect(tasks.length).to.equal(2)
                expect(tasks[0]).to.equal('3 clean up')
                expect(tasks[1]).to.equal('1 go shopping')
            })
        })

          describe('statistics', function(){
            it('introducing a task should increase the number of introduced tasks', async function(){
                await user.addTask('any task')
                let statistics = await user.getStatistics()

                expect(statistics.createdTasks).to.equal(1)
            })
        })
    })
}
