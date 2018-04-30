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
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.getTecnicosDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
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
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO   : null,
        PASSWORD : bcrypt.hashSync(req.body.PASSWORD, salt),
        NOMBRE : req.body.NOMBRE,
        EMAIL : req.body.EMAIL,
        FECHA_NACIMIENTO : req.body.FECHA_NACIMIENTO,
        TELEFONO : req.body.TELEFONO,
        DOMICILIO : req.body.DOMICILIO,
        MUNICIPIO : req.body.MUNICIPIO,
        PROVINCIA : req.body.PROVINCIA,
        DOCUMENTACION : req.body.DOCUMENTACION,
        SALARIO : req.body.SALARIO,
        ADMINISTRATIVO : req.body.ADMINISTRATIVO,
        DEPORTIVO : req.body.DEPORTIVO,
        ESPECIALIDAD : req.body.ESPECIALIDAD

      };
      if(tecnicoData.SALARIO == ''){
        tecnicoData.SALARIO = 0;
      }
      CentroDeportivo.getCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando centro '
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
                ID_CENTRO : decoded.directorData.ID_CENTRO
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
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO     : req.params.id,
        PASSWORD       : bcrypt.hashSync(req.body.PASSWORD, salt),
        NOMBRE         : req.body.NOMBRE,
        EMAIL          : req.body.EMAIL,
        FECHA_NACIMIENTO : req.body.FECHA_NACIMIENTO,
        TELEFONO       : req.body.TELEFONO,
        DOMICILIO      : req.body.DOMICILIO,
        MUNICIPIO      : req.body.MUNICIPIO,
        PROVINCIA      : req.body.PROVINCIA,
        DOCUMENTACION  : req.body.DOCUMENTACION,
        SALARIO        : req.body.SALARIO,
        ADMINISTRATIVO : req.body.ADMINISTRATIVO,
        DEPORTIVO      : req.body.DEPORTIVO,
        ESPECIALIDAD   : req.body.ESPECIALIDAD

      };

      if(tecnicoData.SALARIO == ''){
        tecnicoData.SALARIO = 0;
      }
      Tecnico.updateTecnico(tecnicoData,(err,data) => {
        if(data && data.mensaje){
          Director.deleteTrabaja(tecnicoData.ID_TECNICO,(err,datos)=>{
            if(datos && datos.mensaje){
              const trabajaData = {
                ID_TECNICO : req.params.id,
                ID_CENTRO  : decoded.directorData.ID_CENTRO
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


router.put('/tecnicos/contrato/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO : req.params.id,
        ACTIVO: req.body.ACTIVO,
        BAJA  : req.body.BAJA
      }

      Tecnico.updateContract(tecnicoData,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando tecnico '
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.put('/tecnicos/mi_perfil/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const tecnicoData = {
        ID_TECNICO: req.params.id,
        PASSWORD: bcrypt.hashSync(req.body.PASSWORD, salt),
        NOMBRE  : req.body.NOMBRE,
        EMAIL   : req.body.EMAIL,
        TELEFONO: req.body.TELEFONO,
        DOMICILIO: req.body.DOMICILIO,
        MUNICIPIO: req.body.MUNICIPIO,
        PROVINCIA: req.body.PROVINCIA
      };
      Tecnico.updateMyTecnico(tecnicoData,(err,data) => {
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
