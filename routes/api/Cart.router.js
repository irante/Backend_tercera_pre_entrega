//CAPA DE ROUTER

const { Router } = require('express')
const router = Router()

const cartManager = require('../../managers/CartManager.js')
const productManager = require('../../managers/ProductManager.js')
const PurchaseOrderManager = require('../../managers/PurchaseManager.js')
const { policiesCustomer } = require('../../middlewares/policies.middleware.js')
const mailSenderService = require('../../services/mail.sender.service.js')

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
router.post('/:idcart/products/:idprod', /*policiesCustomer,*/ AgregarProducto)



// Eliminar  producto especificado por id al carrito  PUT http://localhost:8080/api/carts/64dcb28e854655c9d7eead3a/products/64d03838f0cbca770cd84709
router.put('/:idcart/products/:idprod', delete_Producto_conIdcart_idpro) 



// Eliminar Carrito   ==> Delete http://localhost:8080/api/carts/64dd55304b09a400aff95e96
router.delete('/:id', deleteById) 






// Orden de compra  ==>    http://localhost:8080/api/carts/651da696523f6d04453c02f7/purchase



router.get('/:idcart/purchase', async (req, res) => {
    let cartId = req.params.idcart

      
      // obtengo el carrito por el id
      let cart = await cartManager.getProductsByCartId(cartId)


      // si el carrito no existe manda status 404
      if (!cart) {
         res.sendStatus(404)
        return;
      }

      console.log(cart)
      // obtengo solo los productos del carrito
      
  
      

      const { products: productsInCart } = cart     // desestructura el carrito obteniendo solo la propiedad products al que le da el alias productsInCart 
      const products = [] 
      const productsDelete = []
     
      //console.log(productsInCart) (ok)

      
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

        // Array de productos que no pudieron comprarse
        if(qty > p.stock){
          productsDelete.push({
              id: p._id,
              unPurchasedQuantity: quantity - p.stock
          })
      } 

          // Actualizacion del carrito de compras
          if(p.stock > qty){
            await cartManager.deleteProductsCart(cartId)
        }


        /// actualizar el stock del producto en db de productos
        p.stock = p.stock - toBuy

        await p.save()  // guarda el producto (db de productos) con el stock actualizado 

       
      }

       // Dejar el carrito de compras con los productos que no pudieron comprarse. 
       for(const { id, unPurchasedQuantity } of productsDelete) {
        await cartManager.addProductCart(cartId, id)
        await cartManager.updateProductCart(cartId, {quantity: unPurchasedQuantity}, id)
    }

   // cart = await cart.populate({ path: 'user', select: [ 'email', 'first_name', 'last_name' ] })


      
      


        // purchase Order (orden de compra)
      const po = {                                    
        user: cart.user,
        code: Date.now(),
        total: products.reduce((total, { price, qty}) => (price * qty) + total, 0), // calcular el total de los productos
        products: products.map(({ id, qty}) =>  {
          return {
            product: id,
            qty
          }
        })
      }

      
    

     
  
      //crear orden
     const orden = await PurchaseOrderManager.create(po)
     res.send(po)
      
      



      // Envio de Ticket al mail

      const mensaje = `
      
      <h2 style="text-align: center;">RESUMEN DE TU COMPRA :</h2>
      <br>
      <div style="border: solid 1px rgb(90, 37, 222); width: 400px; margin: auto;">
          <h3 style="font-weight: bold; color: black; text-align: center;">Comprobante de Compra</h3>
          <ul style="color: black; font-weight: 500;">
              
              <li>Codigo: ${po.code}</li>
              <li>Catidad de Productos Comprados: ${po.products.length}</li>
              <li>Total: $ ${po.total}</li>
              
          </ul>
      </div>

    
  `

  mailSenderService.send("irante@hotmail.com", mensaje)  // destinatario ,  cuerpo del mensaje

  
      
     
    }
    
    
  )












module.exports = router