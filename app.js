/**
 * Created by carlos on 27/10/16.
 */

// Dependencias
var express = require("express");
var azuremobileapps = require("azure-mobile-apps");

// Variables
var app = express();
var mobile = azuremobileapps();

// Configuración de Azure Mobile Apps: path de las tablas y de la api
mobile.api.import("./api");
mobile.tables.import("./tables");

// Inicializar la base de datos antes de escuchar peticiones
// (se inicializa de forma asíncrona, y después se ejecuta la clausura siguiente)
mobile.tables.initialize().then(function () {

    // Registrar el middleware Azure Mobile Apps
    app.use(mobile);

    // Escuchar peticiones
    app.listen(process.env.PORT || 3000);
});
