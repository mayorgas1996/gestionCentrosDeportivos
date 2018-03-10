var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const cookieParser = require('cookie-parser');

const Usuario = require('../models/usuarios');
const Admin = require('../models/admins');
const Director = require('../models/directores');
const Tecnico = require('../models/tecnicos');

router.post('/login/admin',(req,res) => {

  const adminData = {
    ID_ADMIN   : req.body.ID_ADMIN,
    PASSWORD     : req.body.PASSWORD
  };
  Admin.login(adminData, (err, data) =>{
    if(data){
      const token = jwt.sign({adminData},'administrador');
      res.status(200).json({
        success: true,
        mensaje: 'Administrador - Inicio de sesión correctamente',
        datos: JSON.stringify(data),
        token: token
      })

    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })

})

router.post('/login/usuario',(req,res) => {

  const usuarioData = {
    ID_USUARIO   : req.body.ID_USUARIO,
    PASSWORD     : req.body.PASSWORD
  };
  Usuario.login(usuarioData, (err, data) =>{
    if(data){
      const token = jwt.sign({usuarioData},'usuario');
      res.status(200).json({
        success: true,
        mensaje: 'Usuario - Inicio de sesión correctamente',
        datos: JSON.stringify(data),
        token: token
      })
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })

})

router.post('/login/director',(req,res) => {

  const directorData = {
    ID_DIRECTOR   : req.body.ID_DIRECTOR,
    PASSWORD      : req.body.PASSWORD,
    ID_CENTRO     : Director.conocerCentro(req.body.ID_DIRECTOR)
  };
  Director.login(directorData, (err, data) =>{
    if(data){
      const token = jwt.sign({directorData},'director');
      res.status(200).json({
        success: true,
        mensaje: 'Director - Inicio de sesión correctamente',
        datos: JSON.stringify(data),
        token: token
      })
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })

})

router.post('/login/tecnico',(req,res) => {
  Tecnico.conocerCentro(req.body.ID_TECNICO,(err,data) =>{
    if(data){
      const tecnicoData = {
        ID_TECNICO   : req.body.ID_TECNICO,
        PASSWORD     : req.body.PASSWORD,
        ID_CENTRO    : data[0].ID_CENTRO
      };
      Tecnico.login(tecnicoData, (err, data) =>{
        if(data){
          const token = jwt.sign({tecnicoData},'tecnico');
          res.status(200).json({
            success: true,
            mensaje: 'Tecnico - Inicio de sesión correctamente',
            datos: JSON.stringify(data),
            token: token
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: err
          })
        }
      })
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: "El técnico no está trabajando en ningún centro deportivo."
      })
    }
  });



})

module.exports = router;
