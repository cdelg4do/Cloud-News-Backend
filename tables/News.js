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
    "status": "string",
    "title": "string",
    "text": "string",
    "image": "string",
    "writer": "string",
    "latitude": "number",
    "longitude": "number",
    "visits": "number"
};

// El esquema será estático
table.dynamicSchema = false;

// Permisos de acceso a la tabla
// (a escoger entre anonymous, authenticated y disabled)
table.read.access = 'anonymous';
table.update.access = 'authenticated';
table.delete.access = 'authenticated';
table.insert.access = 'authenticated';


// Exportar la tabla
module.exports = table;
