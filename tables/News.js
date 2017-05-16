/**
 * Created by carlos on 27/10/16.
 * 
 * This file describes the scheme, triggers and access permissions
 * for the database table that stores the articles.
 */

// Dependencies
var azureMobileApps = require("azure-mobile-apps");

// Table creation
var table = azureMobileApps.table();

// Table scheme (allowed field types: string, number, date, boolean)
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

// This table will use a static scheme
table.dynamicSchema = false;

// Triggers for insertions
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

// Access permissions for this table (anonymous, authenticated or disabled)
table.read.access = 'authenticated';
table.update.access = 'authenticated';
table.delete.access = 'authenticated';
table.insert.access = 'authenticated';


// Export the table
module.exports = table;
