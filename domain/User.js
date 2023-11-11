const PrioritizedList = require("./PrioritizedList")

module.exports = {
    create: async function({id, greaterFunction, repository, selectFunction}){
        let user = await repository.getRoot(`user-${id}`)
        let list = await PrioritizedList.getPersistentPrioritizedList(greaterFunction, id, repository)
        return {
            addTask,
            getTasks,
            completeTask,
            addRecurrentTask,
            getRecurrentTasks,
            completeRecurrentTask
        }

        async function addTask(task){
            await list.add(task)
        }

        async function getTasks(){
            return list.toArray()
        }

        async function completeTask(){
            let tasks = await getTasks()
            let selectedTask = undefined
            let currentTask = 0
            while(!selectedTask && currentTask < tasks.length){
                if(await selectFunction(tasks[currentTask])){
                    selectedTask = tasks[currentTask]
                    await list.remove(selectedTask)
                    break
                }
                currentTask++
            }
        }

        async function addRecurrentTask(name){
            var task = await repository.getNew()
            task.set('name', name)
            task.set('creation time', new Date().toISOString())
            await user.add('recurrent tasks', task)
        }

        async function getRecurrentTasks(){
            var tasks = await user.get('recurrent tasks')
            if(!tasks) return []
            for(var task of tasks){
                var creationTime = await task.get('creation time')
                let difference = obtenerDiferenciaEnFormatoLegible(new Date(creationTime), new Date())
                let timeSinceLastCompletion = (new Date(new Date() - new Date(creationTime))).toISOString()
                //console.log(`now ${new Date().toISOString()}`,`creation time ${creationTime}` ,`time since last completion ${timeSinceLastCompletion}`, `difference ${difference}`)
                //console.log(await task.get('creation time'))
                await task.set('time since last completion', difference)
            }
            return tasks
        }

        async function completeRecurrentTask(name){
            var tasks = await user.get('recurrent tasks')
            if(!tasks) return
            for(var task of tasks){
                if(await task.get('name') == name) await task.set('creation time', new Date().toISOString())
            }
        }

        function obtenerDiferenciaEnFormatoLegible(fecha1, fecha2) {
            var diferenciaEnMilisegundos = Math.abs(fecha2 - fecha1);
          
            var segundos = Math.floor(diferenciaEnMilisegundos / 1000);
            var minutos = Math.floor(segundos / 60);
            var horas = Math.floor(minutos / 60);
            var dias = Math.floor(horas / 24);
          
            var tiempoRestante = '';
            if (dias > 0) {
              tiempoRestante += dias + ' días ';
              horas %= 24;
            }
            if (horas > 0) {
              tiempoRestante += horas + ' horas ';
              minutos %= 60;
            }
            if (minutos > 0) {
              tiempoRestante += minutos + ' minutos ';
              segundos %= 60;
            }
            if (segundos > 0) {
              tiempoRestante += segundos + ' segundos ';
            }

            if(diferenciaEnMilisegundos < 1000) return '0 segundos'
          
            return tiempoRestante.trim();
          }
    }
}