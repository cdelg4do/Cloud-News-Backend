/**
 * Created by carlos on 29/10/16.
 * 
 * This api allows authenticated users to get all articles of a given type.
 */

var api = {

    "get": function (req, res) {

        // Get the article type to search for
        var status = req.query.status;

        if( typeof status == 'undefined' || (status != 'draft' && status != 'submitted' && status != 'published') ) {

            res.status(400).type("application/json").send( {status:400, message: 'missing or incorrect status'} );
        }

        else {

            // Get the user Id
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;

                    // Connection to the service database
                    var database = req.azureMobile.data;

                    // Search query (different depending on the article type we are looking for)
                    var query = {};
                    
                    if (status == 'published') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits, publishedAt as date FROM News WHERE (status = 'published' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }
                    else if (status == 'submitted') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits = 0, updatedAt as date FROM News WHERE (status = 'submitted' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }
                    else if (status == 'draft') {
                        query = {   sql: "SELECT id, title, hasImage, imageName, visits = 0, updatedAt as date FROM News WHERE (status = 'draft' AND writer = '"+ userId +"') ORDER BY date DESC"    };
                    }

                    console.log("FINAL query for '" + status +"' articles from user " + userId + " --> " + JSON.stringify(query));

                    // Execute the query and send the results back in a json response
                    database.execute(query).then( function(result) {

                        res.status(200).type("application/json").send(result);
                    });

                })
                .catch( function(error) {

                    res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
                });
        }
    }

};

// Authentication level required by this api
api.get.access = 'authenticated';

// Export the api
module.exports = api;
