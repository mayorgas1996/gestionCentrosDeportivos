var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Contabilidad = require('../models/contabilidad');
const Tecnico = require('../models/tecnicos');

/* GET users listing. */
router.get('/contabilidad/operaciones', ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Contabilidad.getContabilidadDelCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })

});

router.get('/contabilidad/operacion/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Contabilidad.getOperacion(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando operacion.'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/contabilidad/ingreso/:id_usuario',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var nowDate = new Date();
      var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();

      const operacionData = {
        ID_OPERACION: null,
        ID_USUARIO : req.params.id_usuario,
        MOTIVO  : req.body.motivo,
        CANTIDAD  : req.body.cantidad,
        FECHA  : date
      };

      Contabilidad.insertOperacion(operacionData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const reflejaData = {
            ID_OPERACION   : data.insertId,
            ID_CENTRO : decoded.tecnicoData.ID_CENTRO
          }
          Contabilidad.insertRefleja(reflejaData,(err,datos) => {

            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Movimiento registrado correctamente',
                data: datos
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

router.post('/contabilidad/gasto/:id_usuario',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var nowDate = new Date();
      var date = nowDate.getFullYear()+'/'+(nowDate.getMonth()+1)+'/'+nowDate.getDate();
      var cantidad = req.body.cantidad;
      cantidad = cantidad*(-1);
      const operacionData = {
        ID_OPERACION: null,
        ID_USUARIO : req.params.id_usuario,
        MOTIVO  : req.body.motivo,
        CANTIDAD  : cantidad,
        FECHA  : date
      };

      Contabilidad.insertOperacion(operacionData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const reflejaData = {
            ID_OPERACION   : data.insertId,
            ID_CENTRO : decoded.tecnicoData.ID_CENTRO
          }
          Contabilidad.insertRefleja(reflejaData,(err,datos) => {

            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Operacion registrada correctamente',
                data: datos
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

router.put('/contabilidad/operacion/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const operacionData = {
        ID_OPERACION: req.params.id,
        ID_USUARIO : req.body.id_usuario,
        MOTIVO  : req.body.motivo,
        CANTIDAD  : req.body.cantidad,
        FECHA  : req.body.fecha
      };

      Contabilidad.updateOperacion(operacionData,(err,data) => {
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

router.post('/contabilidad/operacion/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Contabilidad.deleteRefleja(req.params.id, (err,data) =>{
        if(data === true){
          Contabilidad.deleteOperacion(req.params.id, (err,data) =>{
            if(data && data.mensaje){
              res.status(200).json({
                success: true,
                mensaje: 'Operacion borrada con exito.'
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error deleting refeja.'
              })
            }
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting operacion.'
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
