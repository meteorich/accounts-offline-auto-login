// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts-offline-auto-login.js.
import { name as packageName } from "meteor/meteorich:accounts-offline-auto-login";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts-offline-auto-login - example', function (test) {
  test.equal(packageName, "accounts-offline-auto-login");
});
