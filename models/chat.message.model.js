const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: String,
  text: String,
  datetime: String
})

const chatMessageModel = model('messages', schema)     //(nombre de la coleccion , esquema)

module.exports = chatMessageModel