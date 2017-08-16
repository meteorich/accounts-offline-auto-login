export const name = 'accounts-offline-auto-login';

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
