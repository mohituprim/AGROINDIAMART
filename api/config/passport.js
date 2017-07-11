var passport = require('passport');
var localStrategy = require('./strategies/local.strategy.js');
var googleStrategy = require('./strategies/google.strategy');
var facebookStrategy = require('./strategies/facebook.strategy');

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());  // persistent login sessions

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user)
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.use('local-register', localStrategy.register);
    passport.use('local-login', localStrategy.login);
    passport.use('facebook', facebookStrategy.authentication);
    passport.use('google', googleStrategy.authentication);
    //require('./strategies/google.strategy')();
    //require('./strategies/facebook.strategy')();

};