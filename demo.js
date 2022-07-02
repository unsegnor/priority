const Priority = require("./index.js")
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var list;

async function compareWhichIsMoreImportant(task1, task2){
    console.log("vamos a comparar")
    return new Promise(function(accept){
        rl.question(`What would yo do first?  ${task1}(1) or ${task2}(2) `, function (selection) {
            if(selection == 1) accept(task1)
            else if(selection == 2) accept(task2)
            else accept()
        });
    })
}

rl.on('close', function () {
  console.log('Bye!');
  process.exit(0);
});

async function init(){
    list = await Priority.createPrioritizedList(compareWhichIsMoreImportant)
    var goOn = true;
    while(goOn){
        goOn = await question()
        console.log(await list.toArray())
    }
}

async function question(){
    return new Promise(function(accept){
        rl.question('What do you have to do? ', async function (task) {
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