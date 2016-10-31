/**
 * Created by carlos on 30/10/16.
 */

var request = require("request");

var api = {

    // Método GET de la api:
    // obtiene un token de acceso a la api graph de facebook

    get: function(req, res) {

        // Obtención del id a buscar
        var facebookUserId = req.query.id;

        // Comprobar que la petición incluye el parámetro newsId
        if(typeof facebookUserId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing id'} );
        }

        else {
            // Obtención del token para acceso a la API graph
            var fbAppId = "297565897303694";
            var fbAppKey = "04b8dbc978f93a47b0200eacb87bed0e";

            // Url para la obtención del token de acceso a la API Graph de Facebook
            // (devuelve una respuesta en texto plano tal que: 'access_token=...' )
            var apiGraphTokenUrl = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + fbAppId + "&client_secret=" + fbAppKey;

            // Consulta
            request(apiGraphTokenUrl, function (error, response, body) {

                if (error || response.statusCode != 200) {
                    res.status(response.statusCode).send("Unable to get an access token");
                }
                else {
                    var tokenString = body.toString();

                    // Url de consulta a la API Graph
                    var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?fields=id,name,email,link&" + tokenString;

                    request(apiGraphQueryUrl, function (error, response, body) {

                        if (error || response.statusCode != 200) {
                            res.status(response.statusCode).send("Unable to get the info from the API Graph");
                        }
                        else {
                            res.status(200).type("application/json").send(body);
                        }
                    });
                }
            });
        }
    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';

// Exportar la api
module.exports = api;
