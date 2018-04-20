var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Plan = require('../models/planes');
const Director = require('../models/directores');

/* GET planes listing. */
router.get('/planes',ensureToken,(req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);

  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      jwt.verify(req.token,'tecnico',(err,data) =>{
        if(err){
          res.sendStatus(403); //Acceso no permitido
        }
        else{
          Plan.getPlanesDelCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
            res.status(200).json(data);
          })
        }
      })

    }
    else{
      Plan.getPlanesDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/planes/plan/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Plan.getPlan(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando plan ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/planes',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const planData = {
        ID_PLAN   : null,
        NOMBRE : req.body.NOMBRE,
        GASTOS_INSCRIPCION : req.body.GASTOS_INSCRIPCION,
        COSTE_MENSUAL : req.body.COSTE_MENSUAL,
        EDAD_MIN : req.body.EDAD_MIN,
        EDAD_MAX : req.body.EDAD_MAX,
        ACCESO_ZONA_ACUATICA : req.body.ACCESO_ZONA_ACUATICA,
        SABADOS_Y_DOMINGOS : req.body.SABADOS_Y_DOMINGOS
      };
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Plan.insertPlan(planData, (err, data) =>{
        if(data && data.insertId){
          const ofertaData = {
            ID_CENTRO : decoded.directorData.ID_CENTRO,
            ID_PLAN   : data.insertId
          }
          Director.insertOferta(ofertaData,(err,datos) => {
            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Plan registrado correctamente',
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error'
              });
            }
          })

        }

      })
    }
  })
})

router.put('/planes/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const planData = {
        ID_CENTRO     : req.params.id,
        NOMBRE : req.body.NOMBRE,
        GASTOS_INSCRIPCION : req.body.GASTOS_INSCRIPCION,
        COSTE_MENSUAL : req.body.COSTE_MENSUAL,
        EDAD_MIN : req.body.EDAD_MIN,
        EDAD_MAX : req.body.EDAD_MAX,
        ACCESO_ZONA_ACUATICA : req.body.ACCESO_ZONA_ACUATICA,
        SABADOS_Y_DOMINGOS : req.body.SABADOS_Y_DOMINGOS

      };

      Plan.updatePlan(planData,(err,data) => {
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

router.post('/planes/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Plan.deletePlan(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting plan'
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
