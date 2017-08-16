// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts-auto-login-offline.js.
import { name as packageName } from "meteor/meteorich:accounts-auto-login-offline";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts-auto-login-offline - example', function (test) {
  test.equal(packageName, "accounts-auto-login-offline");
});
