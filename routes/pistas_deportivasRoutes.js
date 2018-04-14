var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const PistaDeportiva = require('../models/pistas_deportivas');
const Director = require('../models/directores');

/* GET users listing. */
router.get('/pistas',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      PistaDeportiva.getPistasDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/pistas/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      PistaDeportiva.getPista(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando pista ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/pistas',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const pistaData = {
        ID_PISTA   : null,
        NOMBRE : req.body.NOMBRE,
        PRECIO_SIN_LUZ : req.body.PRECIO_SIN_LUZ,
        PRECIO_CON_LUZ : req.body.PRECIO_CON_LUZ,
        HORA_APERTURA : req.body.HORA_APERTURA,
        HORA_CIERRE : req.body.HORA_CIERRE,
        HORA_INICIO_LUZ : req.body.HORA_INICIO_LUZ
      };

      PistaDeportiva.insertPista(pistaData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const existenData = {
            ID_PISTA: data.insertId,
            ID_CENTRO: decoded.directorData.ID_CENTRO
          }
          Director.insertExisten(existenData,(err,datos) => {
            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Pista registrada correctamente',
                data: data
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error'
              })
            }
          })

        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error'
          })
        }
      })
    }
  })
})

router.put('/pistas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const pistaData = {
        ID_PISTA     : req.params.id,
        NOMBRE : req.body.NOMBRE,
        PRECIO_SIN_LUZ : req.body.PRECIO_SIN_LUZ,
        PRECIO_CON_LUZ : req.body.PRECIO_CON_LUZ,
        HORA_APERTURA : req.body.HORA_APERTURA,
        HORA_CIERRE : req.body.HORA_CIERRE,
        HORA_INICIO_LUZ : req.body.HORA_INICIO_LUZ
      };

      PistaDeportiva.updatePista(pistaData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error'
          })
        }

      })

    }
  })
})

router.post('/pistas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      PistaDeportiva.deletePista(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting pista deportiva'
          })
        }
      })
    }
  })
});

//RESERVAS
router.post('/pistas/:id/reservar',ensureToken,(req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const reservaData = {
        ID_USUARIO : decoded.usuarioData.ID_USUARIO,
        ID_PISTA: req.params.id,
        FECHA: req.body.fecha,
        HORA_INICIO: req.body.hora_inicio,
        HORA_FIN: req.body.hora_fin
      }

      PistaDeportiva.crearReserva(reservaData, (err,data) =>{
        if(data){
          res.status(200).json({
            success: true,
            mensaje: 'Reserva efectuada con exito'
          });
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error creando reserva'
          })
        }
      })
    }
  })
});

router.post('/pistas/:id/reservas/buscar',ensureToken,(req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const buscarReservasData = {
        ID_PISTA: req.params.id,
        FECHA: req.body.fecha
      }

      PistaDeportiva.buscarReservas(buscarReservasData, (err,data) =>{
        if(data){
          res.status(200).json({
            success: true,
            data
          });
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando reservas'
          })
        }
      })
    }
  })
});

router.post('/pistas/:id/reserva',ensureToken,(req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const reservaData = {
        ID_USUARIO: decoded.usuarioData.ID_USUARIO ,
        ID_PISTA  : req.params.id,
        FECHA     : req.body.fecha,
        HORA_INICIO: req.body.hora_inicio
      }

      PistaDeportiva.deleteReserva(reservaData, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting pista deportiva'
          })
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
