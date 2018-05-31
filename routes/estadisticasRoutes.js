var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Estadistica = require('../models/estadistica');

router.get('/estadisticas/actividad/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;

      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getActividad(id, decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadistica de Actividad'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/actividades/genero',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getActividadesPorGenero(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadisticas'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/financieras',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getEstadisticasFinancieras(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadisticas'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/usuarios',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getEstadisticasUsuarios(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadisticas'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/usuarios/edades',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getEstadisticasUsuariosEdades(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadisticas'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/rutinas',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getEstadisticasRutinas(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadisticas'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/estadisticas/pista/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;

      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Estadistica.getPista(id, decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo estadistica de Pista'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

//Middleware que nos comprueba que un administrador ya ha iniciado sesión
function ensureToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  //Si la cabecera contiene algún dato
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else{
    res.sendStatus(403);
  }

}


module.exports = router;
