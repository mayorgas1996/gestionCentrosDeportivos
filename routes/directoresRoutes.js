var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');

//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Director = require('../models/directores');
const CentroDeportivo = require('../models/centros_deportivos');

/* GET users listing. */
router.get('/directores',ensureToken, (req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Director.getDirectores((err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/directores/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Director.getDirector(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando director ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

//INSERTAR O REGISTRAR UN DIRECTOR, PARA ELLO TAMBIEN SE INSERTA EN LA TABLA 'DIRIGIDO' JUNTO CON LA TABLA 'DIRECTOR'
// HACEMOS COMPROBACIÓN DE QUE EL CENTRO DEPORTIVO AL QUE SE ASIGNA DICHO DIRECTOR EXISTE
router.post('/directores',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const directorData = {
        ID_DIRECTOR   : null,
        PASSWORD : bcrypt.hashSync(req.body.password, salt),
        NOMBRE : req.body.nombre,
        EMAIL : req.body.email,
        FECHA_NACIMIENTO : req.body.fecha_nac,
        TELEFONO : req.body.telefono,
        DOMICILIO : req.body.domicilio,
        MUNICIPIO : req.body.municipio,
        PROVINCIA : req.body.provincia,
        DOCUMENTACION : req.body.documentacion,
        SALARIO : req.body.salario
      };

      CentroDeportivo.getCentro(req.body.id_centro,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando centro ' + req.params.id
          })
        }
        else if(data === null){
          res.status(500).json({
            success: false,
            mensaje: err
          })
        }
        else{

          Director.insertDirector(directorData, (err, data) =>{
            if(data && data.insertId){
              const dirigidoData = {
                ID_DIRECTOR   : data.insertId,
                ID_CENTRO : req.body.id_centro
              }
              Director.insertDirigido(dirigidoData,(err,datos) => {

                if(datos === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Director registrado con exito',
                    director_id: data.insertId,
                    dirigido_id: datos.insertId
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
        }
      })
    }
  })
})

//ACTUALIZACIÓN DE LOS DATOS DE UN DIRECTOR
router.put('/directores/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const directorData = {
        ID_DIRECTOR     : req.params.id,
        PASSWORD       : bcrypt.hashSync(req.body.password, salt),
        NOMBRE         : req.body.nombre,
        EMAIL          : req.body.email,
        FECHA_NACIMIENTO : req.body.fecha_nac,
        TELEFONO       : req.body.telefono,
        DOMICILIO      : req.body.domicilio,
        MUNICIPIO      : req.body.municipio,
        PROVINCIA      : req.body.provincia,
        DOCUMENTACION  : req.body.documentacion,
        SALARIO        : req.body.salario

      };

      Director.updateDirector(directorData,(err,data) => {
        if(data && data.mensaje){
          Director.deleteDirigido(directorData.ID_DIRECTOR,(err,datos) =>{
            if(datos && datos.mensaje){
              const dirigidoData = {
                ID_DIRECTOR   : req.params.id,
                ID_CENTRO : req.body.id_centro
              }
              Director.insertDirigido(dirigidoData,(err,datosDirigido) =>{
                if(datosDirigido === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Director actualizado con exito'
                  })
                }
              })
            }
            else{
              res.status(500).json({
                success:false,
                mensaje: 'Error borrando de la tabla Dirigido'
              })
            }

          })

        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Director'
          })
        }

      })
    }
  })
})

//Borramos director y también su relación en la tabla Dirigido
router.post('/directores/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Director.deleteDirigido(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          Director.deleteDirector(req.params.id,(err,data)=>{
            if(data && data.mensaje){
              res.status(200).json({
                success: true,
                mensaje: 'Director borrado con exito'
              })
            }
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error borrando director'
          })
        }
      })
    }
  })
});

//Ruta para poder ver el técnico su propio perfil
router.post('/directores/mi_perfil',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      Director.getDirector(decoded.directorData.ID_DIRECTOR,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando director.'
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
