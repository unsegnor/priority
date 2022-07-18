const { expect } = require("chai")

module.exports = function(){
    describe('priority tests', function(){
        let user, selectedText

        beforeEach(async function(){
            selectedText = undefined
            this.greaterFunction = async function (task1, task2){
                if (task1 > task2) return task1;
                if (task2 > task1) return task2;
            }

            this.selectFunction = async function(task){
                return (task.includes(selectedText))
            }
            user = await this.getUser('1', this.greaterFunction, this.selectFunction)
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
                this.timeout(10000)
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

        describe.only('logs', function(){
            it('getting logs when task is created', async function(){
                let user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)
                await user2.enableGlobalLogs()

                await user.addTask('any task')

                let logs = await user2.readLogs()
                expect(logs.length).to.equal(1)
                expect(logs[0]).to.contain('tarea creada')
            })

            it('disabling logs', async function(){
                this.timeout(10000)
                let user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)
                await user2.enableGlobalLogs()
                await user2.disableGlobalLogs()

                await user.addTask('any task')

                let logs = await user2.readLogs()
                expect(logs.length).to.equal(0)
            })

            it('disabling should disable any amount of enables', async function(){
                this.timeout(10000)
                let user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)
                await user2.enableGlobalLogs()
                await user2.enableGlobalLogs()
                await user2.enableGlobalLogs()
                await user2.disableGlobalLogs()

                await user.addTask('any task')

                let logs = await user2.readLogs()
                expect(logs.length).to.equal(0)
            })

            it('logs disabled by default', async function(){
                let user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)

                await user.addTask('any task')

                let logs = await user2.readLogs()
                expect(logs.length).to.equal(0)
            })

            // it('logs disabled by default', async function(){
            //     AAA(async () => {
            //         let user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)
            //     },
            //     async () => {
            //         await user.addTask('any task')
            //     },
            //     async () => {
            //         let logs = await user2.readLogs()
            //         expect(logs.length).to.equal(0)
            //     })
            // })

            AAA('logs disabled by default', async () => {
                this.user2 = await this.getUser('2', this.greaterFunction, this.selectFunction)
            },
            async () => {
                await user.addTask('any task')
            },
            async () => {
                let logs = await this.user2.readLogs()
                expect(logs.length).to.equal(0)
            })

            function AAA(testTitle, arrange, act, assert){
                it(testTitle, async function(){
                    await arrange.call(this)
                    await act.call(this)
                    await assert.call(this)
                })
            
                it(testTitle +' with restart', async function(){
                    await arrange.call(this)
                    await restart.call(this)
                    await act.call(this)
                    await assert.call(this)
                })
            }
            
            //TODO test with restart between the arrange and the act and between the act and the assert
            //TODO test with update between the arrange and the act, between the act and the assert and before the arrange
            //or mutate the test adding the restart or the update after every sentence
        })
    })
}
