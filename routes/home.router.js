const { Router } = require('express')

const productManager = require('../managers/ProductManager')

const isAuth = require('../middlewares/auth.middleware')


const router = Router()


//   Acceder al home               http://localhost:8080/
//   Acceder a una pagina         http://localhost:8080/?page=2


// Router de home http://localhost:8080

router.get('/', async (req, res) => {
  let page = req.query.page
  const { docs: products, ...pageInfo } = await productManager.getAllPaged(page)
  pageInfo.prevLink = pageInfo.hasPrevPage ? `http://localhost:8080/?page=${pageInfo.prevPage}` : ''
  pageInfo.nextLink = pageInfo.hasNextPage ? `http://localhost:8080/?page=${pageInfo.nextPage}` : ''

  
  

  res.render('home', {                  // renderizamos la plantilla home.handlebars como inicio.  http://localhost:8080/
    title: 'Bienvenido a la Tienda!',
    products,
    pageInfo,
    user: req.user ?  {           // toma dato del midleware global que esta en server.js
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
    style: 'home'
   
    
  })
})

// Ruta de Perfil

router.get('/profile', isAuth, (req, res) => {
  res.render('profile', {
    user: req.user ?  {
      ...req.user,
      isAdmin: req.user?.role == 'admin',
    } : null,
  })
})



module.exports = router