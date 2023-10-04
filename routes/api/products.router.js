// CAPA DE ROUTER


// Genero el Router


    const { Router } = require('express')     // importo la funcion Router. se usa la desestructuracion porque express exporta un objeto grande entre lo que tiene la funcion router que es lo que queremos usar. se guarda la clase en la constante

    const router = Router()     // Aca se crea el router. se llama a la funcion guardandola en la constante router/
    const { policiesAdmin } = require('../../middlewares/policies.middleware')

// importo la clase ProductManager, ya no necesito  instanciar 

  //const productManager = require('../../managers/ProductManager') // no se usa la extension del archivo en el require

 const {
    getAll,
    getById,
    create,
    update,
    deleteById
  } = require("../../controllers/products.controller") 
   



//Obtener Todos los productos  ==> Get http://localhost:8080/api/products/
//Obtener productos con limite ==> Get http://localhost:8080/api/products?limit=3
//Obtener productos con limite y sort ==> Get http://localhost:8080/api/products?limit=1&sort=1
//Obtener productos por titulo            http://localhost:8080/api/products?query=mouse
router.get('/', getAll) 




// Obtener productos por id ==> Get http://localhost:8080/api/products/64d03838f0cbca770cd84719
router.get('/:id', getById) 



// Agregar productos  ==> Post http://localhost:8080/api/products/
router.post('/', policiesAdmin, create) 



// Actualizar Productos   ==> Put http://localhost:8080/api/products/14
router.put('/:id',policiesAdmin, update) 
 

// Eliminar Productos   ==> Delete http://localhost:8080/api/products/2
router.delete('/:id',policiesAdmin, deleteById) 




module.exports = router   // exporto el objeto router