/**
 * Created by carlos on 28/10/16.
 */

var request = require("request");

var api = {

    // Método GET de la api:
    // buscar el artículo con el id indicado en la tabla News (esté en el estado que esté)
    // (a diferencia de la api read_news cuya consulta es anónima,
    // esta api debe ser invocada por el propio autor del artículo, y no incrementa ningún contador de visitas)

    get: function(req, res) {

        // Obtención del id a buscar
        var newsId = req.query.newsId;

        // Comprobar que la petición incluye el parámetro newsId
        if(typeof newsId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing newsId'} );
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
                    var query = {   sql: "SELECT title, writer, COALESCE(NULLIF(publishedAt,''), updatedAt) as date, visits, image, latitude, longitude, text FROM News WHERE (id =" + newsId + " AND writer = '" + userId + "')"    };
                    database.execute(query).then( function(result) {

                        if (result.length > 0) {

                            // Id del autor y Url de consulta a la API Graph
                            var facebookUserId = result[0].writer;
                            var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?access_token=" + token;

                            request(apiGraphQueryUrl, function (error, response, body) {

                                if (!error && response.statusCode == 200) {

                                    var facebookUserName = JSON.parse(body).name;
                                    var editedResult = result;
                                    editedResult[0].writer = facebookUserName;

                                    res.status(200).type("application/json").send(editedResult);
                                }
                                else {
                                    res.status(200).type("application/json").send(result);
                                }
                            });

                        }
                        else {
                            res.status(200).type("application/json").send(result);
                        }
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
