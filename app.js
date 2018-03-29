var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var log15 = require('./src/utils/log15.js');

var log = new log15({echo: 'Trace', recLevel: 'Warn'});

log.Info('Maximum peer count', 'ETH', 25, 'LES', 0, 'total', 25);
log.Info('Starting peer-to-peer node', 'instance', 'Geth/v1.8.2-stable-b8b9f7f4/darwin-amd64/go1.9.4');
log.Info('Allocated cache and file handles', 'database', '/Users/xiongzhend/Library/Ethereum/geth/chaindata cache=768 handles=1024');
log.Warn("Disk storage enabled for ethash DAGs", "dir", "/Users/xiongzhend/.ethash count=2");

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
