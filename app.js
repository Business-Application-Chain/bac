var express = require('express');
var expressQueryInt = require('express-query-int');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var config = require('./config.json');

var index = require('./routes/index');

var app = express();

app.engine('html', require('ejs').renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('express-domain-middleware'));
app.use(favicon(path.join(__dirname, 'public', 'entu.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 5000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());

var ignorelist = ['id', 'publicKey', 'address', 'timestamp', 'bits', 'hash', 'previoushash'];
app.use(expressQueryInt({
    parser: function (value, redix, name) {
      if (ignorelist.indexOf(name) >= 0) {
        return value;
      }

      if (isNaN(value) || parseInt(value) != value || isNan(parseInt(value, radix))) {
        return value;
      }

      return parseInt(value);
    }
}));

// checking blank list
app.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (config.peers.blankList.length && config.peers.blankList.indexOf(ip) >= 0) {
        if (req.method == 'POST' && req.body.method.substring(0, 5) == 'peer_') {
            var err = new Error('Forbidden');
            err.status = 403;
            next(err);
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.DEBUG && process.env.DEBUG.toUpperCase() == 'TRUE' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('404');
});

module.exports = app;
