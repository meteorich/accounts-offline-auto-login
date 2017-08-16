Package.describe({
  name: 'meteorich:accounts-offline-auto-login',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Persists logged in user information - i.e Meteor.user() and Meteor.userId() - when starting up offline.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  localforage: '1.4.0',
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.3');
  api.use('ecmascript');
  api.use('accounts-base');
  api.mainModule('accounts-offline-auto-login.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('meteorich:accounts-offline-auto-login', 'client');
  api.mainModule('accounts-offline-auto-login-tests.js', 'client');
});
