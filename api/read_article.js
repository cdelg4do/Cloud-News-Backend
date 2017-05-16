/**
 * Created by carlos on 28/10/16.
 * 
 * This api allows authenticated users to get the contents of a given article.
 * (this request must be done by the article author, and does not modify the view counter)
 */

var request = require("request");

var api = {

    get: function(req, res) {

        // Get the article id to search for
        var newsId = req.query.newsId;

        if(typeof newsId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing newsId'} );
        }

        else {
            // Get the id and the access of the user that performs the request
            req.azureMobile.user.getIdentity("facebook").then( function(data) {

                    var userId = data.facebook.claims.nameidentifier;
                    var token = data.facebook.access_token;

                    // Get the Azure Mobile context and connect to the service database 
                    var context = req.azureMobile;
                    var database = context.data;

                    // Query to retrieve the article data
                    // (if the article is already published, the 'date' field is the publication date. Otherwise, 'date' is the last update date)
                    var query = {   sql: "SELECT title, writer, COALESCE(NULLIF(publishedAt,''), updatedAt) as date, visits, hasImage, imageName, latitude, longitude, text FROM News WHERE (id ='" + newsId + "' AND writer = '" + userId + "')"    };
                    
                    database.execute(query).then( function(result) {

                        if (result.length > 0) {

                            // Build the URL to query the Facebook API Graph to get the author's name
                            // (using the author's id and the access token)
                            var facebookUserId = result[0].writer;
                            var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?access_token=" + token;
                            
                            request(apiGraphQueryUrl, function (error, response, body) {

                                if (!error && response.statusCode == 200) {
                                    
                                    // Replace the author's id returned by the database, use the author's name instead
                                    var facebookUserName = JSON.parse(body).name;
                                    var editedResult = result;
                                    editedResult[0].writer = facebookUserName;

                                    res.status(200).type("application/json").send(editedResult);
                                }
                                else {
                                    res.status(200).type("application/json").send(result);
                                }
                            });

                        }
                        else {
                            res.status(200).type("application/json").send(result);
                        }
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
