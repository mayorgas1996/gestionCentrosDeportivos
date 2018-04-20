var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Sala = require('../models/salas');
const Director = require('../models/directores');

/* GET users listing. */
router.get('/salas', ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Sala.getSalasDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })

});

router.get('/salas/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Sala.getSala(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando sala ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/salas',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const salaData = {
        ID_SALA: null,
        NOMBRE : req.body.NOMBRE,
        AFORO  : req.body.AFORO
      };

      Sala.insertSala(salaData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const hayData = {
            ID_SALA   : data.insertId,
            ID_CENTRO : decoded.directorData.ID_CENTRO
          }
          Director.insertHay(hayData,(err,datos) => {

            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Sala registrada correctamente',
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

router.put('/salas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const salaData = {
        ID_SALA: req.params.id,
        NOMBRE : req.body.NOMBRE,
        AFORO  : req.body.AFORO
      };

      Sala.updateSala(salaData,(err,data) => {
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

router.post('/salas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Sala.deleteSala(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting sala'
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
