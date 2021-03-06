var express = require('express');
var app = module.exports = express();

var NODE_ENV = ( process.env.NODE_ENV || 'test' ).toLowerCase();
var _ = require('underscore');

var defaultLocals = {
  env: process.env,
  SERVE_COMPILED: NODE_ENV === 'production' ||
                  NODE_ENV === 'staging',
  ENV: NODE_ENV,
  title: 'Arbiter'
};

var appView = function (req, res) {

  var locals = _.extend({ csrf: req.csrfToken() }, defaultLocals);

  res.render('app', locals);
};

app.get(/^(.*)$/, appView);
