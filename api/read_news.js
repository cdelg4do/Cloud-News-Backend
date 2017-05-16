/**
 * Created by carlos on 28/10/16.
 * 
 * This api allows anonymous users to get the contents of a given article.
 * (as long as it is already published) 
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

            // Facebook App ID & Facebook App Key (from the Facebook develper site)
            var fbAppId = "297565897303694";
            var fbAppKey = "04b8dbc978f93a47b0200eacb87bed0e";

            // Url to request the access token
            // (returns a plain text response like 'access_token=...')
            var apiGraphTokenUrl = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + fbAppId + "&client_secret=" + fbAppKey;

            // Launch the request and wait for results
            var tokenString = "";
            request(apiGraphTokenUrl, function (error, response, body) {

                if (!error && response.statusCode == 200) {
                    tokenString = body.toString();
                }

                // Get the Azure Mobile context and connect to the service database
                var context = req.azureMobile;
                var database = context.data;

                // Query to retrieve the article data
                var query1 = {   sql: "SELECT title, writer, publishedAt as date, visits, hasImage, imageName, latitude, longitude, text FROM News WHERE (id ='" + newsId + "' AND status = 'published')"    };
                database.execute(query1).then( function(result) {

                    if (result.length > 0) {

                        // If the article was found in the database, launch a second query to update the visit counter (+1)
                        var query2 = {   sql: "UPDATE News SET visits = visits + 1 WHERE (id = '" + newsId + "')"    };
                        database.execute(query2);

                        // If we got an access token from the Facebook Graph api, launch a second request to get the author's name
                        if (tokenString != "") {

                            var facebookUserId = result[0].writer;
                            var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?" + tokenString;

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
                    }
                    else {
                        res.status(200).type("application/json").send(result);
                    }
                });

            });

        }
    }

};


// Niveles de autenticación requeridos por esta api
api.get.access = 'anonymous';

// Exportar la api
module.exports = api;
