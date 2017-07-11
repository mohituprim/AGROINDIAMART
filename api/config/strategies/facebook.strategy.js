var user = require('../../models/User.js');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
exports.authentication = new FacebookStrategy({
            clientID: '137831740116092',
            clientSecret: '29c46f4148e458f7a78e9c9b1e53c971',
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            passReqToCallback: true
        },
        // facebook will send back the token and profile
        function (req, accessToken, refreshToken, profile, done) {
            user.email = profile.emails[0].value;
            //user.image = profile._json.image.url;
            user.image="";
            user.displayName = profile.displayName;

            user.facebook = {};
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;

            done(null, user);
    });