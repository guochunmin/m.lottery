var createError = require('http-errors');
var express = require('express');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var routers = require('./server/routers');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'dist/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /dist/images
app.use(favicon(path.join(__dirname, 'dist/images','favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
routers(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
	res.render('404');
//next(createError(404));
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
var port = 3000;
var server = app.listen(port,onStart);

function onStart(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://', host, port);
}
