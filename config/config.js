// dotenv busca el archivo . env y guarda las variables de entorno en procees.env
// Aqui se toman esas variables de process.env y las exporta para su posterior uso



module.exports = {  
                        
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    USER: process.env.USER,
    MONGO_PWD: process.env.MONGO_PWD,
    MONGO_DB: process.env.MONGO_DB,
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_STRATEGY_NAME: process.env.GITHUB_STRATEGY_NAME,
  
    mail: {
        GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
        GMAIL_PWD: process.env.GMAIL_PWD
    }
};
