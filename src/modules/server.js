var util = require('util');
var extend = require('extend');
var async = require('async');
var path = require('path');
var fs = require('fs');
var sandboxHelper = require('../utils/sandbox.js');
var index = require('../../routes/index.js');

// private objects
var modules_loaded, library, self, privated = {}, shared = {};

// constructor
function Server(cb, scope) {
    library = scope;
    self = this;
    self.__private = privated;
    privated.attachApi();

    setImmediate(cb, null, self);
}

// private methods
privated.attachApi = function () {
    library.network.app.use(function(req, res, next) {
        if (modules_loaded) return next();
        res.status(500).send({success: false, error: "Blockchain is loading"});
    });

    library.network.app.use('/', index);

    // catch 404 and forward to error handler
    library.network.app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    library.network.app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = process.env.DEBUG && process.env.DEBUG.toUpperCase() == 'TRUE' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('404');
    });
};

// public methods

// events
Server.prototype.onInit = function (scope) {
    modules_loaded = scope && scope != undefined ? true : false;
};

// export
module.exports = Server;