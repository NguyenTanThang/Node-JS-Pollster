var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
dotenv.config({path: path.join(__dirname, 'config', "config.env")})
const mongoConnection = require("./config/db")();
require("./config/passport-config");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts")
const authChecker = require("./config/auth-check");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pollsRouter = require("./routes/polls");
var voteRouter = require("./routes/vote");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: true,
  maxAge: 3600 * 1000,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function (req, res, next) {
  res.locals = {
    user: req.user
  };
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/polls', pollsRouter);
app.use('/vote', voteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

console.log("The server is now running on port " + process.env.PORT)

module.exports = app;
