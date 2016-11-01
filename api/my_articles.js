/**
 * Created by carlos on 29/10/16.
 */

var api = {

    "get": function (req, res) {

        // Obtención del tipo de artículos a buscar
        var status = req.query.status;

        // Comprobar que la petición incluye el parámetro status y que sea correcto
        if( typeof status == 'undefined' || (status != 'draft' && status != 'submitted' && status != 'published') ) {

            res.status(400).type("application/json").send( {status:400, message: 'missing or incorrect status'} );
        }

        // Si los parámetros son correctos
        else {

            // Obtención del id de usuario
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;

                    // Conexión a la BBDD del servicio
                    var database = req.azureMobile.data;

                    // Query SQL de búsqueda
                    var query = {};

                    // La query varía en función del tipo de artículo (published/submitted/draft)
                    if (status == 'published') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits, publishedAt as date FROM News WHERE (status = 'published' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }
                    else if (status == 'submitted') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits = 0, updatedAt as date FROM News WHERE (status = 'submitted' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }
                    else if (status == 'draft') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits = 0, updatedAt as date FROM News WHERE (status = 'draft' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }

                    console.log("Query FINAL artículos '" + status +"' del usuario " + userId + " --> " + JSON.stringify(query));

                    // Ejecutar la query y devolver los resultados en un json
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
