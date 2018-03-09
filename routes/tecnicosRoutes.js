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
const Director = require('../models/directores');

/* GET users listing. */
router.get('/tecnicos', ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.getTecnicos((err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/tecnicos/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Tecnico.getTecnico(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando tecnico ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

//INSERTAR O REGISTRAR UN TECNICO, PARA ELLO TAMBIEN SE INSERTA EN LA TABLA 'TRABAJA' JUNTO CON LA TABLA 'TECNICO'
// HACEMOS COMPROBACIÓN DE QUE EL CENTRO DEPORTIVO AL QUE SE ASIGNA DICHO TECNICO EXISTE
router.post('/tecnicos',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO   : null,
        PASSWORD : bcrypt.hashSync(req.body.password, salt),
        NOMBRE : req.body.nombre,
        EMAIL : req.body.email,
        FECHA_NACIMIENTO : req.body.fecha_nac,
        TELEFONO : req.body.telefono,
        DOMICILIO : req.body.domicilio,
        MUNICIPIO : req.body.municipio,
        PROVINCIA : req.body.provincia,
        DOCUMENTACION : req.body.documentacion,
        SALARIO : req.body.salario,
        ADMINISTRATIVO : req.body.administrativo,
        DEPORTIVO : req.body.deportivo,
        ESPECIALIDAD : req.body.especialidad

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
          Tecnico.insertTecnico(tecnicoData, (err, data) =>{
            if(data && data.insertId){
              const trabajaData = {
                ID_TECNICO   : data.insertId,
                ID_CENTRO : req.body.id_centro
              }
              Director.insertTrabaja(trabajaData,(err,datos) => {

                if(datos === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Tecnico registrado con exito'
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

router.put('/tecnicos/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO     : req.params.id,
        PASSWORD       : bcrypt.hashSync(req.body.password, salt),
        NOMBRE         : req.body.nombre,
        EMAIL          : req.body.email,
        FECHA_NACIMIENTO : req.body.fecha_nac,
        TELEFONO       : req.body.telefono,
        DOMICILIO      : req.body.domicilio,
        MUNICIPIO      : req.body.municipio,
        PROVINCIA      : req.body.provincia,
        DOCUMENTACION  : req.body.documentacion,
        SALARIO        : req.body.salario,
        ADMINISTRATIVO : req.body.administrativo,
        DEPORTIVO      : req.body.deportivo,
        ESPECIALIDAD   : req.body.especialidad

      };

      Tecnico.updateTecnico(tecnicoData,(err,data) => {
        if(data && data.mensaje){
          Director.deleteTrabaja(tecnicoData.ID_TECNICO,(err,datos)=>{
            if(datos && datos.mensaje){
              const trabajaData = {
                ID_TECNICO : req.params.id,
                ID_CENTRO  : req.body.id_centro
              }
              Director.insertTrabaja(trabajaData,(err,datosTrabaja) =>{
                if(datosTrabaja === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Tecnico actualizado con exito'
                  })
                }
              })
            }
            else{
              res.status(500).json({
                success:false,
                mensaje: 'Error borrando de la tabla Trabaja'
              })
            }

          })

        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Tecnico'
          })
        }

      })
    }
  })
})

router.post('/tecnicos/delete/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.deleteTecnico(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting tecnico'
          })
        }
      })
    }
  })
});

//Ruta para poder ver el técnico su propio perfil
router.post('/tecnicos/mi_perfil',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Tecnico.getTecnico(decoded.tecnicoData.ID_TECNICO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando tecnico.'
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
