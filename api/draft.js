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
                    console.log(query)

                    database.execute(query).then( function(result) {

                        res.status(200).type("application/json").send(result);
                    });

                })
                .catch( function(error) {

                    res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
                });
        }
    }

/*
    ,


    // Método POST de la api:
    // crear o actualizar el registro de un borrador con nuevos datos

    post: function (req, res) {

        // Parámetros de la petición (en el body)
        var draftId = req.body.id;
        var draftTitle = req.body.title;
        var draftHasImage = req.body.hasImage;
        var draftImageName = req.body.imageName;
        var draftText = req.body.text;
        var draftLat = req.body.lat;
        var draftLong = req.body.long;

        console.log("draftId: " + draftId);
        console.log("draftTitle: " + draftTitle);
        console.log("draftHasImage: " + draftHasImage);
        console.log("draftImageName: " + draftImageName);
        console.log("draftText: " + draftText);
        console.log("draftLat: " + draftLat);
        console.log("draftLong: " + draftLong);


        var isNewArticle = (draftId != 'undefined' && draftId == 'new_article');


        // Comprobar que se incluyen todos los parámetros necesarios correctamente
        if (
            typeof draftId == 'undefined'
            || typeof draftTitle == 'undefined'
            || typeof draftHasImage == 'undefined'
            || typeof draftImageName == 'undefined'
            || typeof draftText == 'undefined'
        ) {

            res.status(400).type("application/json").send( {status:400, message: 'missing body argument(s)'} );
        }

        // Si los parámetros son correctos
        else {

            // Obtención del id de usuario que hace la petición
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;

                    // Conexión a la BBDD del servicio
                    var database = req.azureMobile.data;

                    // Query SQL
                    var query;

                    if (isNewArticle) {
                        query =  "INSERT INTO News (title,text,hasImage,imageName,writer,latitude,longitude) ";
                        query += "VALUES ('"+draftTitle+"','"+draftText+"','"+draftHasImage+"','"+draftImageName+"','"+userId+"','"+draftLat+"','"+draftLong+"')";
                    }
                    else {
                        query =  "UPDATE News SET title='draftTitle', text='draftText', latitude='draftLat', longitude='draftLong' ";
                        query += "WHERE (id='"+draftId+"' AND status='draft' AND writer='"+userId+"')";
                    }

                    console.log("QUERY: " + query);

                    // Ejecutar la query y devolver el resultado
                    database.execute(query).then( function(results) {

                        //res.status(200).type("application/json").send( { id: articleId} );
                        res.json(results);
                    });

                })
                .catch( function(error) {

                    res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
                });
        }
    }
*/

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'authenticated';
//api.post.access = 'authenticated';

// Exportar la api
module.exports = api;
