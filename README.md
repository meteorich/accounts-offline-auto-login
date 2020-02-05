# accounts-offline-auto-login

Stores the logged in user document in localStorage to allow Meteor.user() to work when starting up with no connection.

- This package does not allow offline login - it only simulates autologin when starting up with no connection
- Client-side user doc is held in localStorage (in a similar way to auto-login token and userId).
- If user logs out, stored user document will be cleared

***
```meteor add meteorich:accounts-offline-auto-login```
