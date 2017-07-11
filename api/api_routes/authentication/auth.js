var express = require('express');
var passport = require('passport');
var router = express.Router();
var createSendToken = require('../../config/jwt.js');

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        // process the login form
        router.post('/login', passport.authenticate('local-login'), function (req, res) {
            createSendToken(req.body.userName, res);
        });
        // SIGNUP =================================
        // show the signup form
        // process the signup form
        router.post('/register', passport.authenticate('local-register'), function (req, res) {
            //emailVerification.send(req.user.email);
            createSendToken(req.body.email, res);
        });
    // facebook -------------------------------
        // send to facebook to do the authentication
        router.route('/facebook')
            .get(passport.authenticate('facebook', {
                scope: ['email']
        }));
        // handle the callback after facebook has authenticated the user
        router.route('/facebook/callback')
            .get(passport.authenticate('facebook', {
                successRedirect: '/index/',
                failureRedirect: '/error/'
        }));
    // google ---------------------------------
        // send to google to do the authentication
        router.route('/google')
            .get(passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email']
        }));
        // the callback after google has authenticated the user
        router.route('/google/callback')
            .get(passport.authenticate('google', {
                successRedirect: '/index/',
                failure: '/error/'
        }));
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
module.exports = router;