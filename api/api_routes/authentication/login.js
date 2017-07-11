var express = require('express');
var passport = require('passport');
var router = express.Router();
var createSendToken = require('../../config/jwt.js');

// show the login form
router.get('/', function(req, res) {
	// render the page and pass in any flash data if it exists
	//res.render('login.ejs'); 
	console.log('Working');
	return true;
});

router.post('/', passport.authenticate('local-login'), function (req, res) {
	console.log(req.user);
	console.log('loged-in');
	createSendToken(req.user, res);
});

module.exports = router;