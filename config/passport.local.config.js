// generar nuestra estrategia LOCAL de passport usada por config/passport.init.js


const passport = require('passport')
const local = require('passport-local')                     // importamos estrategia de passport
const userManager = require('../managers/user.manager')
const { hashPassword, isValidPassword } = require('../utils/password.utils')


const LocalStrategy = local.Strategy


// Funcion para registro: 

const signup = async (req, email, password, done) => {                                          // funcion asincrona 
  const { email: _email, password: _password, password2: _password2, ...user } = req.body     // obtengo el objeto user libre de las propiedades email, password, etc...

  const _user = await userManager.getByEmail(email)                                         // traigo el usuario desde la base de datos

  if (_user) {
    console.log('usuario ya existe')                                                        // si el usuario ya existe
    return done(null, false)
  }

  try {
    const newUser = await userManager.create({                                              // si el usuario no existe lo crea en la base de datos hasheando el password
      ...user,
      email,                                          /// Modificado
      password: hashPassword(password)
    })

   
    return done(null, {                                                               // passport guarda el usuario en la sesion
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    })

  } catch(e) {
    console.log('ha ocurrido un error')
    done(e, false)
  }
}




//funcion  para Inicio de sesion:

const login = async (email, password, done) => {
  try {
    const _user = await userManager.getByEmail(email)

    if (!_user) {
      console.log('usuario no existe')
      return done(null, false)
    }

    if (!password) {
      return done(null, false)
    }

    if(!isValidPassword(password, _user.password)) {
      console.log('credenciales no coinciden')
      return done(null, false)
    }

    
    done(null, _user)

  } catch(e) {
    console.log('ha ocurrido un error')
    done(e, false)
  }
}





module.exports = {
  LocalStrategy,
  signup,
  login,
};
