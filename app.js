var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admins = require('./routes/adminRoutes');
var usuarios = require('./routes/usuariosRoutes');

var engines = require('consolidate');

var app = express();


//para mysql
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

console.log("Intentamos realizar la conexión con la base de datos.");
startConnection();

console.log("Intentamos realizar query.");

connection.query("SELECT * FROM administrador", function (err, result) {
  if (err) throw err;
  var rows = JSON.parse(JSON.stringify(result[0]));

  console.log("Resultado: " + rows.NOMBRE + " | " + rows.EMAIL );
});

console.log("Intentamos finalizar la conexión con la base de datos");
endConnection();

function startConnection(){
  connection.connect(function(err){
    if(err) throw err;
    console.log("Conectado a la base de datos.");
  })
}

function endConnection(){
  connection.end(function(err){
    if(err) throw err;
    console.log("Finalizada la conexión.");
  });

};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',engines.mustache);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', admins);
app.use('/',usuarios);

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