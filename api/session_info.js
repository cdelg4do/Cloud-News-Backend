/**
 * Created by carlos on 28/10/16.
 * 
 * This api allows authenticated users to get info about their current Facebook session.
 */

var api = {

    "get": function (req, res) {

        // Get the user data fetched from Facebook and send the results as a json response
        req.azureMobile.user.getIdentity("facebook").then( function(data) {

                console.log("** ID **: "  + data.facebook.claims.nameidentifier);
                console.log("** TOKEN **: "  + data.facebook.access_token);

                var userData = {

                    id:         data.facebook.claims.nameidentifier,
                    token:      data.facebook.access_token,
                    firstName:  data.facebook.claims.givenname,
                    fullName:   data.facebook.claims.name,
                    email:      data.facebook.claims.emailaddress,
                    birthday:   data.facebook.claims.dateofbirth,
                    link:       data.facebook.claims.link
                };

                res.status(200).type('application/json').json(userData);
            })
            .catch( function(error) {

                res.status(401).type("application/json").send( {status: 401, message: JSON.stringify(error)} );
            });
    }

};

// Authentication level required by this api
api.get.access = 'authenticated';

// Export the api
module.exports = api;
