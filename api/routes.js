const fs = require('fs'),
    path = require('path'),
    express = require('express');
index = require('./api_routes/authentication/index');
users = require('./api_routes/authentication/users');
auth = require('./api_routes/authentication/auth');
register = require('./api_routes/authentication/register');
login = require('./api_routes/authentication/login');
farmer = require('./api_routes/farmer/farmers.controller');

class Router {

    constructor() {
        this.startFolder = null;
    }

    //Called once during initial server startup
    load(app, folderName) {
        const router = express.Router();
        app.use('/home', index);
        app.use('/users', users);
        app.use('/auth', auth);

        const controller = new farmer(router);
        app.use('/farmer', router);
    }
}
module.exports = new Router();