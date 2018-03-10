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
const Usuario = require('../models/usuarios');

/* GET users listing. */
router.get('/usuarios',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Usuario.getUsuarios((err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/usuarios/usuario/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Usuario.getUsuario(id,(err,data) =>{
        console.log("Err contiene" + err)
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando usuario ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

//INSERTAR O REGISTRAR UN USUARIO, PARA ELLO TAMBIEN SE INSERTA EN LA TABLA 'REGISTRADO' JUNTO CON LA TABLA 'TECNICO'
// HACEMOS COMPROBACIÓN DE QUE EL CENTRO DEPORTIVO AL QUE SE ASIGNA DICHO USUARIO EXISTE
router.post('/usuarios',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const usuarioData = {
        ID_USUARIO   : null,
        PASSWORD     : bcrypt.hashSync(req.body.password, salt),
        NOMBRE       : req.body.nombre,
        EMAIL        : req.body.email,
        SEXO         : req.body.sexo,
        FECHA_NAC    : req.body.fecha_nac,
        TELEFONO     : req.body.telefono,
        DOCUMENTACION: req.body.documentacion,
        IBAN         : req.body.iban,
        OBSERVACIONES: req.body.observaciones,
        DIRECCION    : req.body.direccion,
        MUNICIPIO    : req.body.municipio,
        PROVINCIA    : req.body.provincia,
        ACTIVO       : req.body.activo

      };
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      CentroDeportivo.getCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
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
          Usuario.insertUsuario(usuarioData, (err, data) =>{
            if(data && data.insertId){
              const registradoData = {
                ID_USUARIO   : data.insertId,
                ID_CENTRO : decoded.tecnicoData.ID_CENTRO
              }
              Tecnico.insertRegistrado(registradoData,(err,datos) => {

                if(datos === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Usuario registrado con exito'
                  })
                }
                else{
                  res.status(500).json({
                    success: false,
                    mensaje: 'Error'
                  });
                }
              });

            }
          });
        }
      });
    }
  });
});

//ACTUALIZACIÓN DE UN USUARIO
router.put('/usuarios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const usuarioData = {
        ID_USUARIO   : req.params.id,
        PASSWORD     : bcrypt.hashSync(req.body.password, salt),
        NOMBRE       : req.body.nombre,
        EMAIL        : req.body.email,
        SEXO         : req.body.sexo,
        FECHA_NAC    : req.body.fecha_nac,
        TELEFONO     : req.body.telefono,
        DOCUMENTACION: req.body.documentacion,
        IBAN         : req.body.iban,
        OBSERVACIONES: req.body.observaciones,
        DIRECCION    : req.body.direccion,
        MUNICIPIO    : req.body.municipio,
        PROVINCIA    : req.body.provincia,
        ACTIVO       : req.body.activo
      };

      Usuario.updateUsuario(usuarioData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Usuario actualizado con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Usuario.'
          });
        }

      });
    }
  })
});

router.post('/usuarios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Usuario.deleteUsuario(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting user'
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
