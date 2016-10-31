/**
 * Created by carlos on 28/10/16.
 */

var api = {

    // Método GET de la api:
    // Proporciona información sobre la sesión actual del usuario
    // (solo pueden invocarla usuarios autenticados)

    "get": function (req, res) {

        // Identificación del usuario
        req.azureMobile.user.getIdentity("facebook").then( function(data) {

                console.log("** ID **: "  + data.facebook.claims.nameidentifier);
                console.log("** TOKEN **: "  + data.facebook.access_token);

                var userData = {

                    id:         data.facebook.claims.nameidentifier,
                    token:      data.facebook.access_token,
                    firstName:  data.facebook.claims.givenname,
                    fullName:   data.facebook.claims.name,
                    email:      data.facebook.claims.emailaddress,
                    birthday:   data.facebook.claims.dateofbirth,
                    link:       data.facebook.claims.link
                };

                res.status(200).type('application/json').json(userData);
            })
            .catch( function(error) {

                res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
            });
    }

};

// Niveles de autenticación requeridos por esta api
api.get.access = 'authenticated';

// Exportar la api
module.exports = api;
