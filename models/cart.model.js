const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users'},
  products: { 
    type: [{
      product: { type: Schema.Types.ObjectId, ref: 'products' }, // products es el nombre de la coleccion de la que se extraeran los datos. product es la propiedad.
      qty: { type: Number, default: 0 }
    }],
    default: []
  },
  createdDate: { type: Number, default: Date.now() }
})



schema.pre("findOne", function () {
  this.populate({ path: 'user', select: ['email', 'firstname', 'lastname'] })
})


                  
const cartModel = model('carts', schema)    //(nombre de la coleccion , esquema)



module.exports = cartModel