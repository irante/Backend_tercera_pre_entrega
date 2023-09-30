//CAPA DE ROUTER

const { Router } = require('express')
const router = Router()

const cartManager = require('../../managers/CartManager.js')
const productManager = require('../../managers/ProductManager.js')
const PurchaseOrderManager = require('../../managers/PurchaseManager.js')



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
router.get('/:idcart', getProductsByCartId)




// Crear carrito con id autogenerado      POST http://localhost:8080/api/carts/
router.post('/', create) 




// Agregar productos al carrito  Post http://localhost:8080/api/carts/64dbe954c4f38dedc23e6b02/products/64d03838f0cbca770cd84712
router.post('/:idcart/products/:idprod', AgregarProducto)



// Eliminar  producto especificado por id al carrito  PUT http://localhost:8080/api/carts/64dcb28e854655c9d7eead3a/products/64d03838f0cbca770cd84709
router.put('/:idcart/products/:idprod', delete_Producto_conIdcart_idpro) 



// Eliminar Carrito   ==> Delete http://localhost:8080/api/carts/64dd55304b09a400aff95e96
router.delete('/:id', deleteById) 


//------------------------------------------------------------------------


// Orden de compra



router.get('/:idcart/purchase', async (req, res) => {
    let cartId = req.params.idcart

      
      // obtengo el carrito por el id
      const cart = await cartManager.getProductsByCartId(cartId)


      // si el carrito no existe manda status 404
      if (!cart) {
        return res.sendStatus(404)
      }

      
      // obtengo solo los productos del carrito
      
      //=========************************* no puedo obtener products del carrito*******************
      // si hago console.log(cart) ver que el carrito es: [{product{title,precio,etc}}, {title,precio,etc}]  No se ve la propiedad products
      

      const { products: productsInCart } = cart     // desestructura el carrito obteniendo solo la propiedad products al que le da el alias productsInCart 
      //const products = [] // dto
      
      console.log(cart)
     
      
      
      //por cada producto en productsInCart: 1) obtiene el producto del carrido ( es un id -populate) y le da el alias de (renombra como) id, hace lo mismo con qty
      // 2) busca el producto con productManager de acuerdo a su id y lo guarda en la constante p
      for (const { product: id, qty } of productsInCart) {          
        

        const p = await productManager.getById(id)     // objengo el producto por su id en la base de productos             
  
        
        // regresa si no hay stock del producto
        if (!p.stock) {                                         
          return
        }


        //cantidad a comprar: 
        //si stock del producto es mayoy o igual  que la cantidad en el carrito: deja comprar la cantidad del carrito
        //sino : deja comprar el stock
        const toBuy = p.stock >= qty ? qty : p.stock

        products.push({
          id: p._id,
          price: p.price,
          qty: toBuy
        })

        
        
        /// actualizar el stock del producto en db de productos
        p.stock = p.stock - toBuy

        await p.save()  // guarda el producto (db de productos) con el stock actualizado 

       
      }



        // purchase Order (orden de compra)
      const po = {                                    
        user: null, // agarrar el user de la sesion
        code: null, // generarlo automaticamente
        total: products.reduce((total, { price, qty}) => (price * qty) + total, 0), // calcular el total de los productos
        products: products.map(({ id, qty}) =>  {
          return {
            product: id,
            qty
          }
        })
      }

      console.log(po)

     
      res.send(po)



      //crear orden???
     //const orden = await PurchaseOrderManager.create(po)
     //res.send(orden)
      
     

      
     
    }
    
  )












module.exports = router