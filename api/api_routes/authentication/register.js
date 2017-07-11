var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jwt-simple');
var createSendToken = require('../../config/jwt.js');
//var emailVerification = require('../../config/emailVerification.js');

router.get('/', function(req, res, next) {
  res.render('register.ejs');
});

router.post('/', passport.authenticate('local-register'), function (req, res) {
    console.log('registered');
	  //emailVerification.send(req.user.email);
	  createSendToken(req.user, res);
});
module.exports = router;