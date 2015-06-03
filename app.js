var express = require('express');
var WebSocketServer = require('ws').Server
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/socket-db';
var port = process.env.PORT || 5000


var routes = require('./routes/index');
var users = require('./routes/users');
var presentations = require('./routes/presentations');

var app = express();
var server = http.createServer(app);
server.listen(port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

var clients = [];

wss.on('connection', function(ws){
  console.log('A new user connected!');
  clients.push(ws)
  ws.onmessage = function(event){
    clients.forEach(function(client){
      client.send(event.data);
    });
  }

  ws.on('close', function(){
    console.log("websocket connection closed");
    //remove ws connection from array;
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
