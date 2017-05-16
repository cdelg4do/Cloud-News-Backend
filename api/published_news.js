/**
 * Created by carlos on 27/10/16.
 * 
 * This api allows anonymous users to get the news list (articles already published)
 */

var api = {

    get: function(req, res) {

        // Get the Azure Mobile context and connect to the service database
        var context = req.azureMobile;
        var database = context.data;

        // Execute the search query and send the results back as a json response
        // (results are sorted by publication date, the latest first)
        var query = {   sql: "SELECT id, title, writer, hasImage, imageName, publishedAt FROM News WHERE (status = 'published') ORDER BY publishedAt DESC"    };
        database.execute(query).then( function(result) {

            res.status(200).type("application/json").send(result);
        });
    }

};

// Authentication level required by this api
api.get.access = 'anonymous';

// Export the api
module.exports = api;
