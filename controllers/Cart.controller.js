// CAPA DE CONTROLLER - cart.router


const cartManager = require("../managers/CartManager")



// Leer Carritos creados                 Get http://localhost:8080/api/carts/

const LeerCarritos = async (req, res) => {
  const carrito = await cartManager.LeerCarritos()
  console.log(carrito)
  res.send (carrito)
}




//Obtener productos del carrito que tenga el id dado.==> Get http://localhost:8080/api/carts/64dbe954c4f38dedc23e6b02

const getProductsByCartId =  async (req, res) => {
  let id = req.params.idcart
   const products = await cartManager.getProductsByCartId(id)

 
    res.send(products);
 
};


// Crear carrito con id autogenerado      POST http://localhost:8080/api/carts/
const create = async (req, res) => {
   
  const cart = await cartManager.create()

res.send("Carrito Creado")
}


// Agregar productos al carrito  Post http://localhost:8080/api/carts/64dbe954c4f38dedc23e6b02/products/64d03838f0cbca770cd84712

const AgregarProducto = async (req, res) => {
  const {idcart, idprod } = req.params

   const carrito = await cartManager.AgregarProducto(idcart, idprod)

  res.send(carrito)
}


// Eliminar  producto especificado por id al carrito  PUT http://localhost:8080/api/carts/64dcb28e854655c9d7eead3a/products/64d03838f0cbca770cd84709

const delete_Producto_conIdcart_idpro = async (req, res) => {
  const {idcart, idprod } = req.params

   const carrito = await cartManager.delete_Producto_conIdcart_idpro(idcart, idprod)

  res.send(carrito)
}



// Eliminar Carrito   ==> Delete http://localhost:8080/api/carts/64dd55304b09a400aff95e96

const deleteById = async (req, res) => {
  const { id } = req.params


  const result = await cartManager.delete(id)
  res.send(result)

}






module.exports = {
    LeerCarritos,
    getProductsByCartId,
    create,
    AgregarProducto,
    delete_Producto_conIdcart_idpro,
    deleteById
}