const { Router } = require('express')
const path = require('path')


const router = Router()


router.get('/', async (req, res) => {
  
  
  

  res.render('realTimeProducts', {                                   // renderizamos la plantilla home.handlebars   http://localhost:8080/realTimeProducts
    title: 'Actualizacion de productos en tiempo Real!',
    //products,
   
    
  })

  

 //res.send("Probando Home")
})



module.exports = router

// traer la informacion en tiempo real con websockets