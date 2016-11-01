/**
 * Created by carlos on 27/10/16.
 */

var api = {

    // Método GET de la api:
    // buscar todos los registros publicados de la tabla News,
    // ordenados por fecha de modificación (primero los más recientes)

    get: function(req, res) {

        // Obtención del contexto de Azure Mobile
        var context = req.azureMobile;

        // Conexión a la BBDD del servicio
        var database = context.data;

        // Query SQL de búsqueda
        var query = {   sql: "SELECT id, title, writer, hasImage, imageName, publishedAt FROM News WHERE (status = 'published') ORDER BY publishedAt DESC"    };

        // Ejecutar la query y devolver los resultados en un json
        database.execute(query).then( function(result) {

            res.status(200).type("application/json").send(result);
        });
    }

};

// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';

// Exportar la api
module.exports = api;
