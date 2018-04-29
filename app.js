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
var actividades = require('./routes/actividadesRoutes');
var salas = require('./routes/salasRoutes');
var contabilidad = require('./routes/contabilidadRoutes');
var ejercicios = require('./routes/ejerciciosRoutes');
var rutinas = require('./routes/rutinasRoutes');

var login = require('./routes/autenticacion');

var engines = require('consolidate');

var app = express();

//Explicar en la documentación y buscar info
var compression = require('compression')
app.use(compression());

//para mysql
var mysql      = require('mysql');


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
app.use(express.static(__dirname + '/views'));

//Solucion al CORS y "Access-Control-Allow-Origin"
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/', index);
app.use('/', admins);
app.use('/',usuarios);
app.use('/',tecnicos);
app.use('/',directores);
app.use('/',centros_deportivos);
app.use('/',pistas_deportivas);
app.use('/',planes);
app.use('/',actividades);
app.use('/',salas);
app.use('/',contabilidad);
app.use('/',ejercicios);
app.use('/',rutinas);

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
