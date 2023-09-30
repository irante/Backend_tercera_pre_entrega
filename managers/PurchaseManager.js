

const orderModel = require('../models/po.model')

class PurchaseManager {


 

  // Crear Orden

  async create(po) {
    try {
        const NewOrder = await orderModel.create(po)
        return NewOrder 
    }catch (error) {
      console.error("Error al crear la orden", error.message)
    }
    


  }

   






} 
  







module.exports = new PurchaseManager()