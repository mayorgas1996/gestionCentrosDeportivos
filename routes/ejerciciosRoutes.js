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
const Ejercicio = require('../models/ejercicios');

/* GET users listing. */
router.get('/ejercicios',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Ejercicio.getEjerciciosDelCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/ejercicios/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Ejercicio.getEjercicio(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando ejercicio.'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/ejercicios/buscar',ensureToken,(req,res)=> {
  jwt.verify(req.token,'tecnico',(err,data) => {
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const busquedaData = {
        NOMBRE: req.body.nombre
      }


      Ejercicio.buscarEjercicioEnCentro(decoded.tecnicoData.ID_CENTRO, busquedaData,(err,data) =>{
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
            mensaje: 'Error buscando ejercicio'
          })
        }
      })
    }
  })

})

//INSERTAR O REGISTRAR UN EJERCICIO
router.post('/ejercicios',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const ejercicioData = {
        ID_EJERCICIO   : null,
        NOMBRE : req.body.NOMBRE,
        GRUPO_MUSCULAR: req.body.GRUPO_MUSCULAR,
        DIFICULTAD: req.body.DIFICULTAD,
        INFORMACION: req.body.INFORMACION
      };

      Ejercicio.insertEjercicio(ejercicioData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const tieneData = {
            ID_EJERCICIO: data.insertId,
            ID_CENTRO: decoded.tecnicoData.ID_CENTRO
          }
          Tecnico.insertTiene(tieneData,(err,datos) => {
            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Ejercicio registrado correctamente',
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

//ACTUALIZACIÓN DE UN USUARIO
router.put('/ejercicios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const ejercicioData = {
        ID_EJERCICIO   : req.params.id,
        NOMBRE : req.body.NOMBRE,
        GRUPO_MUSCULAR: req.body.GRUPO_MUSCULAR,
        DIFICULTAD: req.body.DIFICULTAD,
        INFORMACION: req.body.INFORMACION
      };

      Ejercicio.updateEjercicio(ejercicioData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Ejercicio actualizado con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Ejercicio.'
          });
        }

      });
    }
  })
});


router.post('/ejercicios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.deleteTiene(req.params.id, (err,data) =>{
        if(data === true){
          Ejercicio.deleteEjercicio(req.params.id, (err,data) =>{
            if(data && data.mensaje){
              res.status(200).json({
                success: true,
                mensaje: 'Ejercicio borrado con exito.'
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error deleting tiene.'
              })
            }
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting Ejercicio.'
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
