
const fs = require('fs/promises')
const path = require('path')
const productModel = require('../models/product.model')



class ProductManager {
  

  
 

//Obtener todos los productos

async getAll(query,limite,sort) {

  

  let filter = {};
  let limit = 10

  if (query) {
    filter = { title: query };
  }

  if (limite) {
    limit = limite
  
  }

  const products = await productModel
    .find(filter)
    .sort({ price: sort })
    .limit(limit)
    .lean();
   


    const {totalPages, PrevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, NextLink} = await productModel.paginate({}, { limit:10, page:1, lean: true })
    return { products, totalPages, PrevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, NextLink}
 
    
  }

  


  //Obtener Productos por id

  async getById(id) {

    try {
      const products = await productModel.findById(id)
      return products  // regresa el primero de la lista


    }
    catch (error) {
      console.error("Error al obtener el producto:", error.message);
      return "producto no encontrado"; 
    }
  }

 
  // Agregar Producto
  async create(product) {
    const producto = await productModel.create(product)
    return producto
  }


  // Actualizar producto
  async update(id, product) {

    const result = await productModel.updateOne({ _id: id }, product)

    return result
   
  }


  // Eliminar productos

  async delete(id) {
   
      const result = await productModel.deleteOne({ _id: id })
  
      return result
   
  }

  // paginacion

  getAllPaged(page = 1) {
    return productModel.paginate({}, { limit:10, page, lean: true })
  }



}




module.exports = new ProductManager() // singleton => se exporta la instancia que se usara el otros modulos. Cada modulo no tendrea que instanciar nuevamente