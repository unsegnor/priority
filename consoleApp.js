const readline = require('readline');
const RedisState = require('persistent-programming-redis-state')
const Priority = require("./index.js")

module.exports = function(usingRedis){
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    let list;
    
    async function compareWhichIsMoreImportant(task1, task2){
        return new Promise(function(accept){
            rl.question(`What should go first?  ${task1}(1) or ${task2}(2) `, function (selection) {
                if(selection == 1) accept(task1)
                else if(selection == 2) accept(task2)
                else accept()
            });
        })
    }
    
    rl.on('close', async function () {
      console.log('This is your prioritized list:');
      console.log(await list.toArray());
      process.exit(0);
    });
    
    async function init(){
        if(usingRedis) list = await Priority.getPersistentPrioritizedList(compareWhichIsMoreImportant, 'mi lista', RedisState({databaseId:1}))
        else list = await Priority.createPrioritizedList(compareWhichIsMoreImportant)
        
        let go_on = await question((await list.toArray()).length == 0);
        console.log(await list.toArray())

        while(go_on){
            go_on = await question()
            console.log(await list.toArray())
        }
    }
    
    async function question(isFirst){
        return new Promise(function(accept){
            rl.question( isFirst?'Is there anything you want to add to the list? ' : 'Anything else to add to the list? ', async function (task) {
                if(task == ""){
                    rl.close();
                    accept(false)
                } 
                else {
                    await list.add(task)
                    accept(true)
                }
            });
        })
    }
    
    init()
}
