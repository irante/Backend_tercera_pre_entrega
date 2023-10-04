const cartModel = require('../models/cart.model')

class CartManager {

 // Leer Carritos Creados

 async LeerCarritos(){
 const carritos = await cartModel.find()
 return carritos

 }

   
  // obtener los productos del carrito con id especificado

async getProductsByCartId(cartId) {

  // Con manejo de errores try catch 
  
  try {
    const cart = await cartModel.findById(cartId).populate('products.product');
    return cart;

  } catch (error) {
    console.error("Error al obtener productos del carrito:", error.message);
    //return "carrito no encontrado"; 
  }
}



  // Crear Carrito

  async create(carrito) {
    const NewCarrito = await cartModel.create({ user: undefined, products: [] })
    return NewCarrito 


  }

   // Agregar productos al carrito

   /* En este caso como no se crean productos directamente en la base de datos, sino que se agregar productos
      (objetos) a un Array ( el carrito ) hay que buscar el carrito en la base de datos, guardarlo en una 
      variable, pushear el producto al array (carrito) y guardar ese carrito modificado a la base de datos

  */
   
      async AgregarProducto(idcart, idprod) {
    
      const carrito = await cartModel.findById(idcart);
  
      if (!carrito) {
        return "Carrito no encontrado";
      }
  
      // Busca el producto en el carrito por su ID
      const productoExistenteIndex = carrito.products.findIndex(item => item.product.toString() === idprod.toString());
  
     
     // Si el producto ya existe, incrementa la cantidad en 1
      if (productoExistenteIndex !== -1) {
        
        carrito.products[productoExistenteIndex].qty += 1;
      } else {

        // Si el producto no existe, agrégalo al carrito con una cantidad de 1
        carrito.products.push({ product: idprod, qty: 1 });
      }
  
      // Guarda los cambios en la base de datos
      await carrito.save();
  
      return carrito;
    
    
    }

    // Eliminar producto con id especificado  del carrito con id especificado

    async delete_Producto_conIdcart_idpro(idcart, idprod) {
      try {
        const carrito = await cartModel.findById(idcart);
    
        if (!carrito) {
          return "Carrito no encontrado";
        }
    
        // Encuentra el índice del producto en el arreglo 'products'
        const productIndex = carrito.products.findIndex(product => product.product.toString() === idprod);
    
        if (productIndex === -1) {
          return "Producto no encontrado en el carrito";
        }
    
        // Elimina el producto del arreglo usando el índice
        carrito.products.splice(productIndex, 1);
    
        // Guarda los cambios en la base de datos
        await carrito.save();
    
        return carrito;
      } catch (error) {
        console.error("Error al eliminar producto del carrito:", error.message);
        return "Error al eliminar producto del carrito";
      }
    }
    



    // Este codigo no funciono para eliminar producto con id y
    /*
    async delete_Producto_conIdcart_idpro(idcart, idprod) {
      try {
        const carrito = await cartModel.findById(idcart);
    
        if (!carrito) {
          return "Carrito no encontrado";
        }
    
        // Filtrar los productos para mantener solo aquellos que no tienen el ID proporcionado
        carrito.products = carrito.products.filter(product => product._id.toString() !== idprod);
    
        // Guardar los cambios en la base de datos
        await carrito.save();
    
        return carrito;

      } catch (error) {
        console.error("Error al eliminar producto del carrito:", error.message);
        return "Error al eliminar producto del carrito";
      }
    }

*/



    
    // Eliminar Carritos

  async delete(id) {
    try {	
   
    const result = await cartModel.deleteOne({ _id: id })
    return "Carrito eliminado"

    } catch (error) {
      console.error("Error el eliminar el carrito", error.message)
    }
  }


  // Vaciar carrito

  async deleteProductsCart(cid){

    //ID DEL CARRITO
    let cart = await cartModel.findOne({_id: cid})

    cart.products = []

    cart.save()
}







} 
  








  














module.exports = new CartManager()