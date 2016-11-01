/**
 * Created by carlos on 30/10/16.
 */

var request = require("request");

var api = {

    // Método GET de la api:
    // buscar el borrador con el id indicado en la tabla News
    // (esta api debe ser invocada por el propio autor del artículo)

    get: function(req, res) {

        // Obtención del id a buscar
        var articleId = req.query.id;

        // Comprobar que la petición incluye el parámetro newsId
        if(typeof articleId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing id'} );
        }

        // Si los parámetros son correctos
        else {
            // Obtención del id y del token de acceso del usuario que hace la petición
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;
                    var token = data.facebook.access_token;

                    // Obtención del contexto de Azure Mobile y de la conexión a la BBDD
                    var context = req.azureMobile;
                    var database = context.data;

                    // Query de búsqueda en la BBDD
                    var query = {   sql: "SELECT title, createdAt, updatedAt, hasImage, imageName, text, latitude, longitude FROM News WHERE (id ='" + articleId + "' AND status = 'draft' AND writer = '" + userId + "')"    };
                    database.execute(query).then( function(result) {

                        res.status(200).type("application/json").send(result);
                    });

                })
                .catch( function(error) {

                    res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
                });
        }
    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'authenticated';

// Exportar la api
module.exports = api;
