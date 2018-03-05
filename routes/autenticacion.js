var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const Usuario = require('../models/usuarios');
const Admin = require('../models/admins');

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

module.exports = router;
