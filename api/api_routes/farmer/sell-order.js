var express = require('express');
var passport = require('passport');
var router = express.Router();
var createSendToken = require('../../config/jwt.js');

router.post('/order/sell', function (req, res) {
    res.status(200).send({
		order: 'created',
	});
});
module.exports = router;