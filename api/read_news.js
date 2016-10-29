/**
 * Created by carlos on 28/10/16.
 */

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

        // Si los parámetros son correctos, se realiza la búsqueda
        else {

            // Obtención del contexto de Azure Mobile
            var context = req.azureMobile;

            // Conexión a la BBDD del servicio
            var database = context.data;

            // Query de SQL
            var query = {   sql: "SELECT title, writer, updatedAt, visits, image, latitude, longitude, text FROM News WHERE (id =" + newsId + " AND status = 'published')"    };

            // Ejecutar la query y devolver los resultados en un json
            database.execute(query).then( function(result) {

                res.status(200).type("application/json").send(result);
            });
        }


    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';


// Exportar la api
module.exports = api;
