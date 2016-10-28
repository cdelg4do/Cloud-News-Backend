/**
 * Created by carlos on 28/10/16.
 */

var api = {

    // Método GET de la api:
    // buscar la noticia publicada con el id indicado en la tabla News

    get: function(req, res, next) {

        // Comprobar si la petición trae parámetros
        if (typeof req.params.length < 0) {
            return next();
        }

        // Obtención del id a buscar
        var newsId = req.query.newsId;

        // Obtención del contexto (el objeto que encapsula el servicio de Azure Mobile)
        var context = req.azureMobile;

        // Conexión a la BBDD del servicio
        var database = context.data;

        // Query de SQL
        var query = {   sql: "SELECT title, writer, updatedAt, visits, image, latitude, longitude, text FROM News WHERE (id =" + newsId + " AND status = 'published')"    };

        // Ejecutar la query y devolver los resultados en un json
        database.execute(query).then( function(result) {
            res.json(result);
        });
    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';


// Exportar la api
module.exports = api;
