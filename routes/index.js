var express = require('express');
var router = express.Router();
var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Entu ' + config.version });
});

module.exports = router;
