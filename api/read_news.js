/**
 * Created by carlos on 28/10/16.
 */

var request = require("request");

var api = {

    // Método GET de la api:
    // buscar la noticia publicada con el id indicado en la tabla News

    get: function(req, res) {

        // Obtención del id a buscar
        var newsId = req.query.newsId;

        // Comprobar que la petición incluye el parámetro newsId
        if(typeof newsId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing newsId'} );
        }

        // Si los parámetros son correctos
        else {

            // Obtención del token para acceso a la API graph
            var fbAppId = "297565897303694";
            var fbAppKey = "04b8dbc978f93a47b0200eacb87bed0e";

            // Url para la obtención del token de acceso a la API Graph de Facebook
            // (devuelve una respuesta en texto plano tal que: 'access_token=...' )
            var apiGraphTokenUrl = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + fbAppId + "&client_secret=" + fbAppKey;

            // Consulta
            var tokenString = "";

            request(apiGraphTokenUrl, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    tokenString = body.toString();
                }

                // Obtención del contexto de Azure Mobile y de la conexión a la BBDD
                var context = req.azureMobile;
                var database = context.data;

                // Query de búsqueda
                var query1 = {   sql: "SELECT title, writer, publishedAt as date, visits, hasImage, imageName, latitude, longitude, text FROM News WHERE (id =" + newsId + " AND status = 'published')"    };
                database.execute(query1).then( function(result) {

                    if (result.length > 0) {

                        // Si la consulta devolvió resultados (uno como máximo), actualizamos el contador de visitas
                        var query2 = {   sql: "UPDATE News SET visits = visits + 1 WHERE (id = " + newsId + ")"    };
                        database.execute(query2);

                        // Si obtuvimos un token de la API Graph de Facebook, consultamos el nombre del autor de la noticia
                        if (tokenString != "") {

                            // Id del autor y Url de consulta a la API Graph
                            var facebookUserId = result[0].writer;
                            var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?" + tokenString;

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
                    }
                    else {
                        res.status(200).type("application/json").send(result);
                    }
                });

            });

        }
    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';

// Exportar la api
module.exports = api;
