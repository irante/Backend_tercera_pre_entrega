const productManager = require('../managers/ProductManager.js')
const chatMessageManager = require('../managers/chat.message.manager.js')


async function socketManager(socket) {
  console.log(`user has connected: ${socket.id}`)

  socket.on('disconnect', () => {
    //console.log('user disconnected')
  })

  setTimeout( async () => {
    const product = await productManager.getAll()
    socket.emit('event', product)                       // el evento recibido y enviado tienen que tener el mismo nombre
  }, 700)




   

  // obtener todos los mensajes de la base de datos
  const messages = await chatMessageManager.getAll()
 // console.log(messages)
  socket.emit('chat-messages', messages)   // cuando el usuario se conecta obtiene todos los mensajes de la base de datos

  socket.on('chat-message', async (msg) => {

    // guardar el mensaje en la Base de Datos
    console.log(msg)
    await chatMessageManager.create(msg)       // cuando el usuario manda un mensaje  se guarda en la base de datos.
    socket.broadcast.emit('chat-message', msg)
  })






}

module.exports = socketManager