var User = require('../../models/User.js');
var LocalStrategy = require('passport-local').Strategy;

var logInStrategyOptions = {
	usernameField: 'userName'
};

exports.login = new LocalStrategy(logInStrategyOptions, function (email, password, done) {
	var searchUser = {
	'local.email': email
	};
	// find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
	User.findOne(searchUser, function (err, user) {
		if (err) return done(err);

		// if no user is found, return the message
		if (!user) return done(null, false, {
			message: 'Wrong email/password'
		});

		if (!user.validPassword(password)) return done(null, false, {
			message: 'Wrong email/password'
		});

		return done(null, user);
	})
});
exports.register = new LocalStrategy({usernameField : 'email'}, function (email, password, done) {
	var searchUser = {
	'local.email': email
	};
	User.findOne(searchUser, function (err, user) {
		if (err) return done(err);

		// check to see if theres already a user with that email
		if (user) return done(null, false, {
			message: 'email already exists'
		});

		// if there is no user with that email
        // create the user
		var newUser = new User();
		newUser.local.email = email;
		newUser.local.password = newUser.generateHash(password);

		newUser.save(function (err) {
			return done(null, newUser);
		});
	});
});