// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var path            = require('path');
//var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect('mongodb://localhost/passporttest'); // connect to our database

require('./passportTest/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, './passportTest'));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./passportTest/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// uncomment this line
//require('./passportTest/passport')(passport); // pass passport for configuration

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
