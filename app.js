var express = require('express');
var expressQueryInt = require('express-query-int');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var cors = require('cors');

app.engine('html', require('ejs').renderFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('express-domain-middleware'));
app.use(favicon(path.join(__dirname, './public/dist', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 5000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public/dist')));
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

app.use(cors());

module.exports = app;
