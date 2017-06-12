// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
//var Token = require('../models/token');
var Client = require('../models/client');
var Profile = require('../models/profile');
var Token = require('../models/token');

passport.use(new BasicStrategy(
  function(username, password, callback) {
    console.log('i am in basic startagey to confirm user'+ username + " "+ password);

    Profile.findOne({ profile: username }, function (err, profile) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!profile) { return callback(null, false); }

      // Make sure the password is correct
      profile.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        console.log("succesfull profile confirm!");
        return callback(null, profile);
      });
    });
  }
));
//authenticate clients
//Authorization = basic ... used for auth code grants not for us!
passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    console.log("authorizing" + username);
    Client.findOne({ id: username }, function (err, client) {
      console.log(err);
      if (err) { return callback(err); }
      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

//autheticates clients on behalf of users
//only used when you come with Authorization Bearer token!
passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({ value: accessToken}, function(err, token)
    {
          if (err) return callback(err);
          if (!token) return callback(null, false);
          Profile.findOne( {_id: token.profile}, function(err, profile) {    
                if (!profile) return callback(null, false);
                callback(null, profile, false);
          })
    })
  }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
//exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

