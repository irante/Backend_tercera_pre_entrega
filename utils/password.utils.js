const bcrypt = require('bcrypt')


// Funcion que crea una password Hasheada a partier de una entrada (password)

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))    // funcion de bcrypt que requiere un password y un salt (string que se genera aleatoriamente ) y ese salt se utiliza como secret del algoritmo que hashea el password. el numero es la cantidad de rondas que hara el algoritmo para generar el secret
}



// Funcion que compara password para ver si coinciden

const isValidPassword = (pwd1, pwd2) => {
  return bcrypt.compareSync(pwd1, pwd2)             // funcion de bcrypt que compara data (pasword) sin encriptar con data (password) encriptado,  devolviendo true / false
}

module.exports = { hashPassword, isValidPassword }