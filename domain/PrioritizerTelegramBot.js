// Stryker disable next-line all : next line is there to fix a bug from telegram bot package
process.env.NTBA_FIX_319 = true

const TelegramBot = require('node-telegram-bot-api');
const Prioritizer = require("../index.js")
const { nanoid } = require('nanoid');
const packageJson = require('../package.json')

module.exports = {
    createNew: async function(repository, token){
        const prioritizer = Prioritizer.createNew(repository)
        let serverUrl = undefined
        let bot
        return {
            setTelegramServerURL: function(url){
                serverUrl = url
            },
            start,
            stop: async function(){
                await bot.stopPolling()
            }
        }

        async function compareWhichTaskIsMoreImportant(chatId, task1, task2){
            return new Promise(function(accept){
              let query_id = nanoid();
              let responseHanndler = async (query)=>{
                const data = JSON.parse(query.data)
                const receivedQueryId = data.query_id
                const response = data.response
              
                if(receivedQueryId == query_id){
                  bot.off('callback_query', responseHanndler)
          
                  if(response == 1) accept(task1)
                  if(response == 2) accept(task2)
                  accept()
                }
              }
          
              bot.on('callback_query', responseHanndler)
              bot.sendMessage(chatId, `¿Cuál va primero?`, {
                reply_markup: {
                  inline_keyboard: [
                    [{text: task1, callback_data: JSON.stringify({query_id, response: 1})}],
                    [{text: task2, callback_data: JSON.stringify({query_id, response: 2})}]
                  ]
                }
              })
            })
          }

          async function selectTask(chatId, task){
            return new Promise(function(accept){
              let query_id = nanoid();
              let responseHanndler = async (query)=>{
                const data = JSON.parse(query.data)
                const receivedQueryId = data.query_id
                const response = data.response
              
                if(receivedQueryId == query_id){
                  bot.off('callback_query', responseHanndler)
          
                  if(response == 1) accept(true)
                  if(response == 2) accept(false)
                  accept()
                }
              }
          
              bot.on('callback_query', responseHanndler)
              bot.sendMessage(chatId, `¿Has terminado ${task}?`, {
                reply_markup: {
                  inline_keyboard: [[
                    {text: "Sí", callback_data: JSON.stringify({query_id, response: 1})},
                    {text: "No", callback_data: JSON.stringify({query_id, response: 2})}
                  ]]
                }
              })
            })
          }

          async function sendLog(chatId, message){
            bot.sendMessage(chatId, message)
          }

        async function start(){
            const botOptions = {polling: true, baseApiUrl: serverUrl};
            bot = new TelegramBot(token, botOptions);

            bot.on('message', async (msg) => {
                const chatId = msg.chat.id;
                if(msg.text.startsWith('/version')) {
                    bot.sendMessage(chatId, packageJson.version)
                    return
                }

                if(msg.text.startsWith('/start')) return
                
//TODO creo que el problema es que las instancias son dieferentes, el estado no se mantiene entre llamadas, tampoco las suscripciones a eventos, estamos creando un usuario nuevo por cada llamada
//tendríamos que hacer un event emitter que se mantenga entre llamadas
//o volver a establecer los enlaces cuando cargamos un usuario, pero claro, aún así se podrían duplicar...
//queremos que el usario se cargue con todo, si estaba escuchando a un evento, esa propiedad, de estar escuchando, tiene que consultarse en el usuario, cada vez
//claro que cómo hacemos eso? tenemos un objeto globalevents que persiste, y cuando sucede un evento... qué?
//por ejemplo, no estamos almacenando el estado de si un usuario tiene o no los logs activados
//por eso podríamos activarlo más de una vez y se crearían dos subscripciones al evento

//o bien mantener a los usuarios cargados en memoria, los mismos todo el rato, las mismas instancias
//aún así en algún momento se recargarán?
//el problema es que persistent programing de momento no permite almacenar referencias a funciones
//que luego se puedan ejecutar

//quizá el mecanismo de los eventos deba estar más integrado en persistent programming
//tenemos que hacer un persisten-event-manager?
//de modo que si se establece una suscripción a un evento de un objeto
//entonces el código de la función se tiene que ejecutar siempre y sólo una vez
//independientemente del número de instancias en memoria de ese objeto
//porque en principio responden al mismo objeto persistente y cada vez que se solicite información de éste
//será la misma en cualquier instancia

//porque el problema actual es que la dessubscripción la intenta hacer una instancia diferente a la que hizo la subscripción
//entonces la referencia a la función handler no es la misma así que no lo borra
//nuestro event manager debería entender lo que queremos hacer independientemente de la instancia concreta que lo pida

//queremos hacer esto? lo que estamos diciendo es que lo que hay en memoria no es la realidad
//que la realidad es sólo los objetos que se crean en el repo, los objetos persistentes
//es que si no lo hacemos así tendríamos que diseñar un mecanismo de inicialización de las subscripciones
//específico para cada aplicación
//mejor tener uno general que ya sea capaz de persistir y recargarse conforme se vaya necesitando
//y utilizar siempre ese

                let user = await prioritizer.getUser({ 
                    id: chatId,
                    greaterFunction: compareWhichTaskIsMoreImportant.bind(undefined, chatId),
                    selectFunction: selectTask.bind(undefined, chatId),
                    receiveLog: sendLog.bind(undefined, chatId)
                  })
                
                if(msg.text.startsWith('/completar')){
                  await user.completeTask()
                }else if(msg.text.startsWith('/enable-logs')){
                  await user.enableGlobalLogs()
                  await bot.sendMessage(chatId, 'Logs activados');
                  return
                }else if(msg.text.startsWith('/disable-logs')){
                  console.log('desactivando logs')
                  await user.disableGlobalLogs()
                  await bot.sendMessage(chatId, 'Logs desactivados');
                  return
                }else{
                  console.log('añadiendo tarea', msg.text)
                  await user.addTask(msg.text)
                }
                
                let tasks = await user.getTasks()
                let tasksString = "Esta es tu lista ordenada: \n\n"
                for(let task of tasks){
                  tasksString += task + "\n"
                }
              
                bot.sendMessage(chatId, tasksString);
              });
        }
    }
}
