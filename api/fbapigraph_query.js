/**
 * Created by carlos on 30/10/16.
 * 
 * This api allows anonymous users to retrieve info for a given Facebook user
 * (first it will request a token access from the Facebook Graph api)
 */

var request = require("request");

var api = {

    get: function(req, res) {

        // Get the id to search for, from the query string
        var facebookUserId = req.query.id;
        
        if(typeof facebookUserId == 'undefined') {

            res.status(400).type("application/json").send( {status:400, message: 'missing id'} );
        }

        else {
            // Facebook App ID & Facebook App Key (from the Facebook develper site)
            var fbAppId = "297565897303694";
            var fbAppKey = "04b8dbc978f93a47b0200eacb87bed0e";

            // Url to request the access token
            // (returns a plain text response like 'access_token=...')
            var apiGraphTokenUrl = "https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=" + fbAppId + "&client_secret=" + fbAppKey;

            // Launch the request and wait for results
            request(apiGraphTokenUrl, function (error, response, body) {

                if (error || response.statusCode != 200) {
                    res.status(response.statusCode).send("Unable to get an access token");
                }
                
                // In case of success, use the received token to compose a new request to get the user data
                else {
                    var tokenString = body.toString();
                    var apiGraphQueryUrl = "https://graph.facebook.com/v2.8/" + facebookUserId + "?fields=id,name,email,link&" + tokenString;

                    request(apiGraphQueryUrl, function (error, response, body) {

                        if (error || response.statusCode != 200) {
                            res.status(response.statusCode).send("Unable to get the info from the API Graph");
                        }
                        else {
                            res.status(200).type("application/json").send(body);
                        }
                    });
                }
            });
        }
    }

};


// Authentication level required by this api
api.get.access = 'anonymous';

// Export the api
module.exports = api;
