const nodemailer = require('nodemailer')
const { mail } = require('../config/config')


class MailSender {

    constructor() { 
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: mail.GMAIL_ADDRESS,
                pass: mail.GMAIL_PWD
            }
        })
    }


    // Metodo send: (to:  email del destinatario / body: cuerpo del mensaje )   
    async send( to, body ) {
        const response = await this.transporter.sendMail({
            from: "noreply@ecommerce.com",                      //  permite ocultar el mail que envia el mensaje
            subject:'Confirmacion de Compra',                   // asunto
            to,
            html: body                                          // html que viene por parametro (body)
        })
    }   
}

module.exports = new MailSender() // singleton: una sola instancia