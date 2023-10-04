

function isAuth(req, res, next) {
  if (req.isAuthenticated) {         // si usuario existe
    next()                          // continuar
    return
  }

  res.redirect('/login')             // si no existe envio a pantalla de login
}

module.exports = isAuth





/*

function isAuth(req, res, next) {
  if (req.user) {
    next()
    return
  }

  res.redirect('/login')
}

module.exports = isAuth

*/