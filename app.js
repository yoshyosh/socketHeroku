var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/socket-db';


var routes = require('./routes/index');
var users = require('./routes/users');
var presentations = require('./routes/presentations');

var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
    console.log('A new user connected!');
    socket.on('live update', function(msg){
      io.emit('live update', msg);
    });
});

MongoClient.connect(url, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to the db");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  req.db = MongoClient;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/presentations', presentations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

console.log("Express server listening on port 3000");


module.exports = app;
