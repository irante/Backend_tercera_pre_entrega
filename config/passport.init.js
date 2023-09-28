
// A la funcion init() la importara server.js para registrar la estrategia de passport

const passport = require("passport");
const userManager = require("../managers/user.manager");

const { LocalStrategy, signup, login } = require("./passport.local.config.js");
const { GithubStrategy, GitHubAccessConfig, profileGithubController, strategyName} = require("./passport.github.js");

const init = () => {

                        //Estrategia local
  
    /* Comentario
    Passport local siempre requerirá dos cosas: username y password
    Podemos cambiar el campo “username” para que tome el campo que nosotros queramos tomar como identificador
    en este caso a nosotros no nos interesa nuestro username, realmente nos interesa el correo electrónico
    así que podemos alterarlo con {usernameField: ‘email’}
    */

    // middleware de passport. Nombbre: "local-signup"/ comentario arriba                              /funcion que se ejecutara: signup de ("./passport.local.config.js")
    passport.use( "local-signup", new LocalStrategy({ usernameField: "email", passReqToCallback: true },signup)
    );

    // middleware de passport. Nombbre: "local-login"/ comentario arriba       /funcion que se ejecutara: login de ("./passport.local.config.js")
    passport.use( "local-login", new LocalStrategy({ usernameField: "email" }, login) 
    );

    
     
                      // Estrategia con github
     

    passport.use(
        strategyName,
        new GithubStrategy(GitHubAccessConfig, profileGithubController)
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getById(id);

        // TODO: borrar el password
        done(null, user);
    });
};

module.exports = init;
