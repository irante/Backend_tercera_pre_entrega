// IIFE Immediate Invoke Function Expression
(async () => {


// Variables de Entorno con dotenv: dotenv busca el archivo .env y guarda las variables de entorno en process.env => dotenv.config() => linea 8
// luego en config/config.js  se toman esas variables guardadas en process.env y las exporta para su posterior uso
const dotenv = require('dotenv');
dotenv.config()                     // En la misma rama donde se esta ejecutando dotenv( en este caso el server.js) busca el archivo .env y guarda las variables de entorno en procees.env
//


const http = require ('http')     // requerido para websockets
const path = require('path')

const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require ("socket.io") // requerido para websockets
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
//const fileStore = require('session-file-store')   // para guardar sesion en forma local
const MongoStore = require('connect-mongo')
const passport = require('passport')                // Core de passport

const config = require ("./config/config")          // importa las variables de entorno

const routes = require ('./routes/index.js') 

const socketManager = require('./websocket')
//const initPassportLocal = require('./config/passport.local.config.js')   // importamos estrategia local del passport

const initPassportLocal = require('./config/passport.init.js')



try {
  // conectar la base de datos antes de levantar el server => Mongo Atlas: mongodb+srv://USUARIO:CONTRASEÑA@cluster0.ewuqtys.mongodb.net/BASE_DE_DATOS?retryWrites=true&w=majority
                                                                  //Local: mongodb://localhost:27017/ecommerce
  
  
 // await mongoose.connect("mongodb+srv://irante:flame360@cluster0.8qme5x7.mongodb.net/ecommerce?retryWrites=true&w=majority")

 await mongoose.connect(config.MONGO_URL)       // usa variable de entorno para la URI de mongo

  
const app = express()         //app express

const server = http.createServer(app)     // server http montado con express. se embebe la app de express en createserver (websockets)
const io = new Server(server)             // websockets montado en el http

 //const FileStore = fileStore(session)    // guardar sesion en forma local. session es lo que exporta const session = require('express-session')

app.engine('handlebars', handlebars.engine()) // registramos handlebars como motor de plantillas
app.set('views', path.join(__dirname, '/views')) // el setting 'views' = directorio de vistas
app.set('view engine', 'handlebars') // setear handlebars como motor de plantillas


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/static', express.static(path.join(__dirname + '/public'))) // convertimos a la carpeta public en recurso estatico para alojar imagenes/css
app.use(cookieParser('esunsecreto')) // la palabra es una validacion para poder modificar la cookie guardada en el cliente



app.use(session({
  secret: 'esunsecreto',  // la sesion tiene que estar codificada
  resave: true,           // permite mantener la sesion activa en caso de que la sesion se mantenga inactiva
  saveUninitialized: true,  // permite guardar cualquier sesion aun cuando el objeto de sesion no tenga nada por contener
  //store: new FileStore({ path: './sessions', ttl: 100, retries: 0 }), // indico donde s guarda la sesion en forma local / tiempo / intentos que va a haver para leer el archivo


  //guardar la sesion en mongo atlas
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://irante:flame360@cluster0.8qme5x7.mongodb.net/ecommerce?retryWrites=true&w=majority',   // coneccion a mongo atlas para guardar la sesion
    ttl: 60 * 60        // tiempo que permanecera guardada
  })


}))


 //Registro de los middlewares de passport
initPassportLocal()
    
app.use(passport.initialize())
app.use(passport.session())  //Si se están utilizando sesiones y se ha establecido una sesión de inicio de sesión, este middleware completará req.user con el usuario actual.




 //middlware GLOBAL
 app.use((req, res, next) => {

  //console.log(req.session, req.user)
  console.log(req.user)
      next()

 })



 
  

// hacer que todas las rutas /api usen routes (index.js de api que a su vez contiene las rutas de usuarios, productos,etc)  ********
app.use('/', routes)    


// web socket
io.on('connection', socketManager)


const port = config.PORT  // se obtiene de las variables de entorno .env

server.listen(port, () => {
  console.log(`Express Server listening at http://localhost:${port}`)
})

console.log('se ha conectado a la base de datos')
} catch(e) {
  console.log('no se ha podido conectar a la base de datos')
  console.log(e)
}
})()
