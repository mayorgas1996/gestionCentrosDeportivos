var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admins = require('./routes/adminRoutes');
var usuarios = require('./routes/usuariosRoutes');
var tecnicos = require('./routes/tecnicosRoutes');
var directores = require('./routes/directoresRoutes');
var centros_deportivos = require('./routes/centros_deportivosRoutes');
var pistas_deportivas = require('./routes/pistas_deportivasRoutes');
var planes = require('./routes/planesRoutes');
var login = require('./routes/autenticacion');

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
app.use('/',tecnicos);
app.use('/',directores);
app.use('/',centros_deportivos);
app.use('/',pistas_deportivas);
app.use('/',planes);
app.use('/',login);

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
