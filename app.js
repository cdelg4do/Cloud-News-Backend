/**
 * Created by carlos on 27/10/16.
 */

// Dependences
var express = require("express");
var azuremobileapps = require("azure-mobile-apps");

// Variables
var app = express();
var mobile = azuremobileapps();

// Settings for Azure Mobile Apps: path to the tables and to the api
mobile.api.import("./api");
mobile.tables.import("./tables");

// Initialize the database (asynchronously) and then start listening
mobile.tables.initialize().then(function () {

    // Register the Azure Mobile Apps middleware
	app.use(mobile);

    // Listen for requests
    app.listen(process.env.PORT || 3000);
});
