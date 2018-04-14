var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Tecnico = require('../models/tecnicos');
const CentroDeportivo = require('../models/centros_deportivos');
const Rutina = require('../models/rutinas');

/* GET users listing. */
router.get('/rutinas',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Rutina.getRutinasDelCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/rutinas/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Rutina.getRutina(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando rutina.'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/rutinas/buscar',ensureToken,(req,res)=> {
  jwt.verify(req.token,'tecnico',(err,data) => {
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const busquedaData = {
        NOMBRE: req.body.NOMBRE
      }


      Rutina.buscarRutinaEnCentro(decoded.tecnicoData.ID_CENTRO, busquedaData,(err,data) =>{
        if(data.length === 0){
          res.status(200).json({
            success: false
          })
        }
        else if(data){
          res.status(200).json({
            success: true,
            resultado: JSON.stringify(data)
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando rutina'
          })
        }
      })
    }
  })

})

//INSERTAR O REGISTRAR UN EJERCICIO
router.post('/rutinas',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const rutinaData = {
        ID_RUTINA   : null,
        NOMBRE : req.body.NOMBRE,
        DIFICULTAD: req.body.DIFICULTAD,
        DIAS: req.body.DIAS
      };

      Rutina.insertRutina(rutinaData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const disponeData = {
            ID_RUTINA: data.insertId,
            ID_CENTRO: decoded.tecnicoData.ID_CENTRO
          }
          Tecnico.insertDispone(disponeData,(err,datos) => {
            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Rutina registrada correctamente',
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

//ACTUALIZACIÓN DE UNA RUTINA
router.put('/rutinas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const rutinaData = {
        ID_RUTINA   : req.params.id,
        NOMBRE : req.body.NOMBRE,
        DIFICULTAD: req.body.DIFICULTAD,
        DIAS: req.body.DIAS
      };

      Rutina.updateRutina(rutinaData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Rutina actualizada con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando la Rutina.'
          });
        }

      });
    }
  })
});


router.post('/rutinas/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.deleteDispone(req.params.id, (err,data) =>{
        if(data === true){
          Rutina.deleteRutina(req.params.id, (err,data) =>{
            if(data && data.mensaje){
              res.status(200).json({
                success: true,
                mensaje: 'Rutina borrada con exito.'
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error deleting dispone.'
              })
            }
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting Rutina.'
          })
        }
      })
    }
  })
});

router.post('/rutinas/:id/add/:id_ejercicio',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const contieneData = {
        ID_RUTINA   : req.params.id,
        ID_EJERCICIO: req.params.id_ejercicio,
        SERIES: req.body.SERIES,
        REPETICIONES : req.body.REPETICIONES
      };

      Rutina.addEjercicio(contieneData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Ejercicio añadido con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando la Rutina.'
          });
        }

      });
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
