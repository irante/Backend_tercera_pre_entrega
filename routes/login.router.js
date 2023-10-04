const { Router } = require('express')
const passport = require('passport')
const config = require("../config/config")



const userManager = require('../managers/user.manager')
const isAuth = require('../middlewares/auth.middleware')
const { hashPassword, isValidPassword } = require('../utils/password.utils')


const router = Router()



// controladores

        //Signup
const signup = async (req, res) => {
  const user = req.body                                         // obtenemos el usuario
  
  console.log(user)

  const existing = await userManager.getByEmail(user.email)     // chequeamos que el usuario exista

  if (existing) {
    return res.render('signup', {
      error: 'El email ya existe'
    })
  }

  if (user.password !== user.password2) {                 // si los password son diferentes
    return res.render('signup', {
      error: 'Las contraseñas no coinciden'
    })
  }

        // crear al usuario                               // si el usuario no existe y las contraseñas  password y password2 son iguales crear el usuario
  try {
    const newUser = await userManager.create({
      ...user,
      password: hashPassword(user.password)               // Creamos el objeto newUser con los datos del objeto user + actualizacion de propiedad password con el password hasheado (...spread)
    })

    req.session.user = {                                  // Seteamos la session
      name: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }



    req.session.save((err) => {
      res.redirect('/')
    })

  } catch(e) {
    return res.render('signup', {
      error: 'Ocurrio un error. Intentalo mas tarde'
    })
  }
}


        //Login
const login = async (req, res) => {
  const { email, password } = req.body

  try {

    
    const _user = await userManager.getByEmail(email)                     // obtenemos el usuario de la base de datos

    if (!_user) {
      return res.render('login', { error: 'El usuario no existe' })       // si el usuario no existe
    }


    const { password: _password, ...user } = _user                        //Separamos el password del objeto _user. Desestructurando _user guardando la variable password y el resto como objeto user

    if (!password) {                                                      // si se envia formulario sin password
      return res.render('login', { error: 'El password es requerido' })
    }

    if(!isValidPassword(password, _password)) {                           // usamos utils/password.utils.js (pass no encriptado, pass encriptado que viene de la base de datos)
      return res.render('login', { error: 'Contraseña invalida' })
    }

   
      // Seteo de sesion de Usuario
    req.session.user = {          
      name: user.firstname,       //  user de la desestructuracion con spread:  const { password: _password, ...user } = _user
      id: user._id,
      // role: 'Admin'
      ...user
    }

    req.session.save((err) => {
      if(!err) {
        res.redirect('/')
      }
    })
  } catch(e) {
    console.log(e)
    res.render('login', { error: 'Ha ocurrido un error' })
  }

  // guardo la session con la informacion del usuario
}

const logout = (req, res) => {
  const { user } = req.cookies

  // borrar la cookie
  res.clearCookie('user')

  req.session.destroy((err) => {
    if(err) {
      return res.redirect('/error')
    }

    res.render('logout', {
      user: req.user.name
    })

    req.user = null
  })

  // res.render('logout', {
  //   user
  // })
}



// Reseteo de password

const resetpassword = async (req, res) => {
  const { email, password1, password2 } = req.body

  const user = await userManager.getByEmail(email)


  if (!user) {
    return res.render('resetpassword', { error: 'el usuario no existe' })
  }

  if (password1 !== password2) {
    return res.render('resetpassword', { error: 'las contraseñas no coinciden' })
  }

  try {
    await userManager.save(user._id, {          // metodo save de usermanager
      ...user,
      password: hashPassword(password1)
    })


    res.redirect('/login')

  } catch (e) {
    console.log(e)
    return res.render('resetpassword', { error: 'Ha ocurrido un error' })
  }
}


// rutas de login
router.get('/signup', (_, res) => res.render('signup'))
router.get('/login', (_, res) => res.render('login'))
router.get('/resetpassword', (_, res) => res.render('resetpassword'))


//RUTAS PARA GITHUB

router.get("/github", passport.authenticate(config.GITHUB_STRATEGY_NAME),(_, res) => {}     // usa variable de entorno
);

router.get(
  "/githubSessions",

  passport.authenticate(config.GITHUB_STRATEGY_NAME),             // usa variable de entorno

  (req, res) => {
      const user = req.user;

      /**
       * creando la sesion
       */

      req.session.user = {
          id: user.id,
          name: user.firstname,
          role: user?.role ?? "Customer",
          email: user.email,
      };

      res.redirect("/");
  }
);


//

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup'
}))

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.post('/resetpassword', resetpassword)
router.get('/logout', isAuth, (req, res) => {
  const { firstname, lastname } = req.user
  req.logOut((err) => {
    if(!err) {
      res.render('logout', {
        name: `${firstname} ${lastname}`
      })
    }
  })
})

module.exports = router