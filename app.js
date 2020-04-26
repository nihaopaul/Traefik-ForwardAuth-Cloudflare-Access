var express = require('express');

var cookieParser = require('cookie-parser');
var auth = require('./routes/auth');

var app = express();
app.use(cookieParser())
app.use('/auth', auth);

module.exports = app;
