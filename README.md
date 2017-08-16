# accounts-offline-auto-login
[Source code of released version](https://github.com/meteorich/accounts-offline-auto-login)
***

Uses [ground:db (NB version II)](https://github.com/GroundMeteor/db) to ground the logged in user and ensure that Meteor.userId() and Meteor.user() work when starting up with no connection.

- This package does not allow offline login - it only faciliates autologin when starting up with no connection
- If user logs out, grounded data will be cleared
- This package does nothing if Meteor Accounts autologin has been disabled