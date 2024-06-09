const { expect } = require("chai")

//TODO: create a way to start the test in a version and update to the next version during the execution
// we need to decide how to know when to update
//we could make explicit the arrange, act and assert parts of the test and use them
//or we could detect calls to user class and use them

//we also need to set a way to execute code from the previous version in the first part of the test
//could be getting the previous version in a subfolder, or actually changing the source files back and forth as javascript is interpreted

//we could create an UpdateUser that will load both versions of the software then chooses which one to run depending on the state (before or after updating)
//we could have a SpyUser that runs the tests but saves all the calls that are done to user
//or analyze the code of the test looking for calls to any User method
//we need to save information about the tests that will be used in later executions

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

            this.wait = async function (miliseconds){
                return new Promise(function(resolve, reject){
                    setTimeout(resolve,miliseconds)
                })
            }
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

        describe('reucurrent tasks', function(){
            it('creates a recurrent task', async function(){
                await user.addRecurrentTask('do heater maintenance')
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('do heater maintenance')
            })

            it('returns empty array when no recurrent tasks were created', async function(){
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(0)
            })

            it('show time since recurrent task creation', async function(){
                this.timeout(10000)
                await user.addRecurrentTask('do heater maintenance')
                await this.wait(1000)
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('do heater maintenance')
                expect(await tasks[0].get('time since last completion')).to.equal('1 segundos')
            })

            it('show time since recurrent task creation', async function(){
                this.timeout(10000)
                await user.addRecurrentTask('do heater maintenance')
                await this.wait(2000)
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('do heater maintenance')
                expect(await tasks[0].get('time since last completion')).to.equal('2 segundos')
            })

            it('show 0 seconds when was immediately created', async function(){
                await user.addRecurrentTask('do heater maintenance')
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('do heater maintenance')
                expect(await tasks[0].get('time since last completion')).to.equal('0 segundos')
            })

            it('shows hours', async function(){
                //TODO: implement time travel
                // await user.addRecurrentTask('do heater maintenance')
                // await this.wait(2000)
                // let tasks = await user.getRecurrentTasks();
                // expect(tasks.length).to.equal(1)
                // expect(await tasks[0].get('name')).to.equal('do heater maintenance')
                // expect(await tasks[0].get('time since last completion')).to.equal('2 segundos')
            })

            it('add several recurrent tasks', async function(){
                this.timeout(10000)
                await user.addRecurrentTask('heater maintenance')
                await user.addRecurrentTask('review ceil painting looking for defects')
                await user.addRecurrentTask('clean outside walls')
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(3)
                expect(await tasks[0].get('name')).to.equal('heater maintenance')
                expect(await tasks[1].get('name')).to.equal('review ceil painting looking for defects')
                expect(await tasks[2].get('name')).to.equal('clean outside walls')
            })

            it('allow very long recurrent task names', async function(){
                this.timeout(5000)
                await user.addRecurrentTask('review ceil painting looking for defects in all the corners without any exception bla bla bla bla bla bla bla bla')
                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('review ceil painting looking for defects in all the corners without any exception bla bla bla bla bla bla bla bla')
            })

            it('show greater time first')
            it('allow completion of recurrent tasks', async function(){
                this.timeout(5000)
                await user.addRecurrentTask('heater maintenance')
                await this.wait(1500)
                await user.completeRecurrentTask('heater maintenance')
                await this.wait(1500)

                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(1)
                expect(await tasks[0].get('name')).to.equal('heater maintenance')
                expect(await tasks[0].get('time since last completion')).to.equal('1 segundos')
            })

            it('remove recurrent tasks', async function(){
                this.timeout(10000)
                await user.addRecurrentTask('heater maintenance')
                await user.addRecurrentTask('review ceil painting looking for defects')
                await user.addRecurrentTask('clean outside walls')
                
                await user.removeRecurrentTask('review ceil painting looking for defects')

                let tasks = await user.getRecurrentTasks();
                expect(tasks.length).to.equal(2)
                expect(await tasks[0].get('name')).to.equal('heater maintenance')
                expect(await tasks[1].get('name')).to.equal('clean outside walls')
            })
        })
    })
}
