// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See accounts-auto-login-offline-tests.js for an example of importing.
export const name = 'accounts-auto-login-offline';

import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson'
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

const USER_DOC_KEY = 'Meteor.user';

// save references to functions to be overriden
const __storeLoginToken = Accounts._storeLoginToken;
const __unstoreLoginToken = Accounts._unstoreLoginToken;

Accounts._storeLoginToken = function (userId, token, tokenExpires) {
    __storeLoginToken.call(Accounts, userId, token, tokenExpires);
    let user = Meteor.users.findOne(userId);
    if (user) Meteor._localStorage.setItem( USER_DOC_KEY, EJSON.stringify(user) );
};

Accounts._unstoreLoginToken = function() {
    __unstoreLoginToken.call(Accounts);
    Meteor._localStorage.removeItem(USER_DOC_KEY);
};

const _user = Accounts.user;
let userRV = new ReactiveVar(null);
Accounts.user = function() {
    return userRV.get();
}
Accounts._online_user = _user;

Tracker.autorun(() => {
    console.log('tracker autorun user');

    // check if the normal Accounts.user() returns something, and if so use this (and also update localStorage entry)
    let user = _user.call(Accounts);
    if (user) {
        userRV.set( user );
        Meteor._localStorage.setItem( USER_DOC_KEY, EJSON.stringify(user) );

    // if not, check for a localStorage entry and use this if present
    } else if ( userStr = Meteor._localStorage.getItem(USER_DOC_KEY) ) {
        userRV.set( EJSON.parse(userStr) )

    // otherwise, use null (i.e. not logged in)
    } else {
        userRV.set( null );
    }
});

const _loggingIn = Accounts.loggingIn;
let loggingInRV = new ReactiveVar(null);
Accounts.loggingIn = function() {
    return loggingInRV.get();
}
Accounts._online_loggingIn = _loggingIn;

Tracker.autorun(() => {
    console.log('tracker autorun loggingIn');
    let loggingIn = _loggingIn.call(Accounts);      // this triggers autorun

    // check if we have a localStorage entry - if so, loggingIn should always be false
    if ( Meteor._localStorage.getItem(USER_DOC_KEY) ) {
        loggingInRV.set( false );

    // if not, use normal Accounts.loggingIn() return value
    } else {
        loggingInRV.set( loggingIn );
    }
});

return;

// import { Tracker } from 'meteor/tracker';
// import localforage from 'localforage';

// save reference to Accounts userId and user functions
Accounts._online_userId = Accounts.userId;
Accounts._online_user = Accounts.user;
Accounts._online_logout = Accounts.logout;

// set up localforage
let storage = localforage.createInstance({
    name: name,
    version: 1.0
});

let cached = {
    userId: null,
    user: null
};
// check for user information cache in local storage on startup
Meteor.startup(function() {

});

Tracker.autorun(() => {
    console.log('tracker autorun userId');
    let _online_userId = Accounts._online_userId();
    // if ( _online_userId ) storage.setItem('userId', _online_userId);
});

Tracker.autorun(() => {
    console.log('tracker autorun user');
    let _online_user = Accounts._online_user();
    // if ( _online_user ) storage.setItem('user', _online_user);
});

// override Accounts userId and user functions
Accounts.userId = function() {
    console.log('userId');
    return Accounts._online_userId()// || storage.getItem('userId') || null;
};

Accounts.user = function() {
    console.log('user');
    return Accounts._online_user()// || storage.getItem('user') || null;
};

Accounts.logout = function(callback) {
    console.log('removing forage userId and user');
    storage.removeItem('userId');
    storage.removeItem('user');
    Accounts._online_logout(callback);
}