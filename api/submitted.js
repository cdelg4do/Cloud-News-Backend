/**
 * Created by carlos on 30/10/16.
 */

var api = {

    // Método POST de la api:
    // actualizar el registro de un borrador para que pase a enviado

    "post": function (req, res) {

        // Obtención del id del artículo
        var articleId = req.query.id;

        // Comprobar que la petición incluye el parámetro status y que sea correcto
        if(typeof id == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing or incorrect id'} );
        }

        // Si los parámetros son correctos
        else {

            // Obtención del id de usuario que hace la petición
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;

                    // Conexión a la BBDD del servicio
                    var database = req.azureMobile.data;

                    // Query SQL de envío
                    // (solo tendrá efecto si el usuario es el autor del artículo, y si este está en estado borrador)
                    var query = { sql: "UPDATE News SET status = 'submitted' WHERE (id = '" + articleId + "' AND status = 'draft' AND writer = '" + userId + "')" };

                    console.log("Query de envío de borrador --> " + JSON.stringify(query));

                    // Ejecutar la query y devolver el id del registro actualizado
                    database.execute(query).then( function(result) {

                        console.log("Resultado de la query de envío --> " + JSON.stringify(result));
                        res.status(200).type("application/json").send( { id: articleId} );
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
