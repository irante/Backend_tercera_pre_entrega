//CAPA DE ROUTER

const { Router } = require('express')
const router = Router()

//const cartManager = require('../../managers/CartManager.js')


const {
    LeerCarritos,
    getProductsByCartId,
    create,
    AgregarProducto,
    delete_Producto_conIdcart_idpro,
    deleteById
} = require("../../controllers/Cart.controller")



// Leer Carritos creados                 Get http://localhost:8080/api/carts/
router.get('/', LeerCarritos)



//Obtener productos del carrito que tenga el id dado.==> Get http://localhost:8080/api/carts/64dbe954c4f38dedc23e6b02
router.get('/:id', getProductsByCartId)




// Crear carrito con id autogenerado      POST http://localhost:8080/api/carts/
router.post('/', create) 




// Agregar productos al carrito  Post http://localhost:8080/api/carts/64dbe954c4f38dedc23e6b02/products/64d03838f0cbca770cd84712
router.post('/:idcart/products/:idprod', AgregarProducto)



// Eliminar  producto especificado por id al carrito  PUT http://localhost:8080/api/carts/64dcb28e854655c9d7eead3a/products/64d03838f0cbca770cd84709
router.put('/:idcart/products/:idprod', delete_Producto_conIdcart_idpro) 



// Eliminar Carrito   ==> Delete http://localhost:8080/api/carts/64dd55304b09a400aff95e96
router.delete('/:id', deleteById) 








module.exports = router