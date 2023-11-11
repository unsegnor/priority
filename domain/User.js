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
            completeRecurrentTask,
            removeRecurrentTask
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
            let task = await repository.getNew()
            task.set('name', name)
            task.set('creation time', new Date().toISOString())
            await user.add('recurrent tasks', task)
        }

        async function getRecurrentTasks(){
            let tasks = await user.get('recurrent tasks')
            if(!tasks) return []
            let notRemovedTasks = []
            for(let task of tasks){
                if(await task.get('status') != 'removed'){
                    let creationTime = await task.get('creation time')
                    let difference = obtenerDiferenciaEnFormatoLegible(new Date(creationTime), new Date())
                    await task.set('time since last completion', difference)
                    notRemovedTasks.push(task)
                }
            }
            return notRemovedTasks
        }

        async function completeRecurrentTask(name){
            let tasks = await user.get('recurrent tasks')
            if(!tasks) return
            for(let task of tasks){
                if(await task.get('name') == name) await task.set('creation time', new Date().toISOString())
            }
        }

        async function removeRecurrentTask(name){
            let tasks = await user.get('recurrent tasks')
            if(!tasks) return
            for(let task of tasks){
                if(await task.get('name') == name) await task.set('status', 'removed')
            }
        }

        function obtenerDiferenciaEnFormatoLegible(fecha1, fecha2) {
            let diferenciaEnMilisegundos = Math.abs(fecha2 - fecha1);
          
            let segundos = Math.floor(diferenciaEnMilisegundos / 1000);
            let minutos = Math.floor(segundos / 60);
            let horas = Math.floor(minutos / 60);
            let dias = Math.floor(horas / 24);
          
            let tiempoRestante = '';
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