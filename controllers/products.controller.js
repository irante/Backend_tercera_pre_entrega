// CAPA DE CONTROLLER

const productManager = require('../managers/ProductManager') // no se usa la extension del archivo en el require



//Obtener Todos los productos  ==> Get http://localhost:8080/api/products/
//Obtener productos con limite ==> Get http://localhost:8080/api/products?limit=3
//Obtener productos con limite y sort ==> Get http://localhost:8080/api/products?limit=1&sort=1
//Obtener productos por titulo            http://localhost:8080/api/products?query=mouse

const getAll = async (req, res) => {
    let query = req.query.query
    let limite = req.query.limit
     let sort = req.query.sort
     
      const {products, totalPages, PrevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, NextLink } = await productManager.getAll(query,limite, sort)
    
     const info = {
      totalPages: totalPages,
      PrevPage: PrevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink:prevLink,
      nextlink: NextLink
    }
     
  
       res.send({
        status : 'success',
        payload: products,
        info});
        

        
    
  }
  




  // Obtener productos por id ==> Get http://localhost:8080/api/products/64d03838f0cbca770cd84719


const getById = async (req, res) => {
    let id = req.params.id
  
    try {
      const product = await productManager.getById(id)
  
      if (!product) {
        res.sendStatus(404)
        return
      }
  
      res.send(product)
    } catch(e) {
      console.log(e)        // imprimo el error
      res.sendStatus(500)
      return
    }
  }
  



  // Agregar productos  ==> Post http://localhost:8080/api/products/

const create = async (req, res) =>  {
    let body = req.body
  
    if(!body.title || !body.descripcion || !body.price || !body.code || !body.stock || !body.status || !body.category){
      res.status(400).send("Debe enviar todos los campos")
    } else{
    const product = await productManager.create(body)
  
    res.status(201).send(product)                     // envia al cliente el producto agregado
   
  
    } 
  
  }



  // Actualizar Productos   ==> Put http://localhost:8080/api/products/14

const update = async (req, res) => {
    const { id } = req.params
    const { body } = req
    try {
      const result = await productManager.update(id, body)
  
      console.log(result)
      if (result.matchedCount >= 1) {
        res.sendStatus(202)
        return
      }
  
      res.sendStatus(404)
      
    } catch(e) {
      res.status(500).send({
        message: "Ha ocurrido un error en el servidor",
        exception: e.stack
      })
    }  
  }


  // Eliminar Productos   ==> Delete http://localhost:8080/api/products/2
const deleteById = async (req, res) => {
    const { id } = req.params
  
  
    const result = await productManager.delete(id)
    console.log(result)
  
    if (result.deletedCount >= 1) {
      res.sendStatus(200)
      return
    }
  
    res.sendStatus(404)
  }



  module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById
  }