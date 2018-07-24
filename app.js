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
app.use(favicon(path.join(__dirname, 'bac-wallet/public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 5000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'bac-wallet/dist')));
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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method==="OPTIONS") {
        /*让options请求快速返回*/
        res.send(200);
    } else {
        next();
    }
});

module.exports = app;
