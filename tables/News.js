/**
 * Created by carlos on 27/10/16.
 */

// Dependencias
var azureMobileApps = require("azure-mobile-apps");

// Crear la tabla
var table = azureMobileApps.table();

// Esquema de la tabla
// (tipos permitidos: string, number, date, boolean)
table.columns = {
    "title": "string",
    "status": "string",
    "publishedAt": "date",
    "writer": "string",
    "latitude": "number",
    "longitude": "number",
    "visits": "number",
    "text": "string",
    "hasImage": "boolean",
    "imageName": "string"
};

// El esquema será estático
table.dynamicSchema = false;

// Triggers para inserciones:
table.insert( function(context) {

/*
     context.user.getIdentity("facebook").then( function(data) {
        
        context.item.writer = data.facebook.claims.nameidentifier;
        return context.execute();
     })
     .catch( function(error) {

        return(error);
     });
*/

    return context.execute();
});

// Permisos de acceso a la tabla
// (a escoger entre anonymous, authenticated y disabled)
table.read.access = 'authenticated';
table.update.access = 'authenticated';
table.delete.access = 'authenticated';
table.insert.access = 'authenticated';


// Exportar la tabla
module.exports = table;
