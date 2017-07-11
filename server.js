const   express         = require('express'),
        path            = require('path'),
        bodyParser      = require('body-parser'),
        cookieParser    = require('cookie-parser'),
        logger          = require('morgan'),
        favicon         = require('static-favicon'),
        passport        = require('passport');
        session         = require('express-session');
        router          = require('./api/routes'),
        mongoose        = require('mongoose'),
    // database        = require('./lib/database'),
    // seeder          = require('./lib/dbSeeder'),
        config          = require('./api/config/config'),
        app             = express(),
        port            = 3000;
class Server {

    constructor() {
        this.initViewEngine();
        this.initExpressMiddleWare();
        this.initCustomMiddleware();
        this.initDbSeeder();
        this.initRoutes();
        this.start();
    }

    start() {
        app.listen(port, (err) => {
            console.log('[%s] Listening on http://localhost:%d', process.env.NODE_ENV, port);
        });
    }

    initViewEngine() {
        app.set('view engine', 'ejs'); // set up ejs for templating
        app.set('views', path.join(__dirname, './api/views'));
    }

    initExpressMiddleWare() {
        app.use('/', express.static(__dirname+'/public/dist'));
        // app.use(favicon(__dirname + '/public/images/favicon.ico'));
        app.use(logger('dev')); // log every request to the console
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json()); // get information from html forms
        app.use(cookieParser()); // read cookies (needed for auth)
        app.use(session({secret: 'anything'}));
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', '*');
            // Request headers you wish to allow
            req.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
        require('./api/config/passport')(app);
    }

    initCustomMiddleware() {
        if (process.platform === "win32") {
            require("readline").createInterface({
                input: process.stdin,
                output: process.stdout
            }).on("SIGINT", () => {
                console.log('SIGINT: Closing MongoDB connection');
                database.close();
            });
        }

        process.on('SIGINT', () => {
            console.log('SIGINT: Closing MongoDB connection');
            database.close();
        });
    }

    initDbSeeder() {
        mongoose.connect(config.DB_ConnectionString);
    }

    initRoutes() {
        router.load(app, './controllers');
        app.all('/*', (req, res) => {
            res.sendFile(path.join(__dirname+'/public/dist','index.html'))
        });
        /// catch 404 and forwarding to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        /// error handlers

        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
}
module.exports = app; 
var server = new Server();
