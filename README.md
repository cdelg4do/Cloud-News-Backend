# Cloud News (Backend)

This is a *Node.js* / *Express* backend for **Cloud News**, a simple news aggregator for iOS.

This backend is intended to be deployed on the Microsoft Azure service platform.
The source code for the iOS client is available <a href="https://github.com/cdelg4do/Cloud-News-Client">here</a>.

#### Additional considerations:

- For user authentication (necessary to write and submitt articles) the app uses *Facebook* as identity provider, so it is mandatory to have a Facebook account. This service is enabled by registering the mobile app at the <a href="https://developers.facebook.com/apps/">Facebook For Developers site</a>. Since this is just a prototype, the app is not registered as public and to use it with specific users they must be added manually.

- On the other hand, if a developer wants to use their own Facebook application to test this backend and the client, he can register it at the Facebook For Developers site, then add the desired Facebook users under the *Roles* section and replace the values for "Facebook App ID" & "Facebook App Key" in the **/api/fbapigraph_query.js** file with the ones in the *Basic Settings* section.
