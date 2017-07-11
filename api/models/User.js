var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
	// email: String,
	// password: String,
	// googleId: String,
	// facebookId: String,
	// displayName: String,
	// active: Boolean
	
    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        image        : String 
    }
});

UserSchema.methods.toJSON = function () {
	var user = this.toObject();
	delete user.local.password;
	return user;
};

// UserSchema.methods.comparePasswords = function (password, callback) {
// 	console.log(this);
// 	bcrypt.compare(password, this.local.password, callback);
// }

// UserSchema.pre('save', function (next) {
// 	var user = this;

// 	if (!user.local.isModified('password')) return next();

// 	bcrypt.genSalt(10, function (err, salt) {
// 		if (err) return next(err);

// 		bcrypt.hash(user.local.password, salt, null, function (err, hash) {
// 			if (err) return next(err);

// 			user.local.password = hash;
// 			next();
// 		})
// 	})
// })
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('User', UserSchema);