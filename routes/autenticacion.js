var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const Usuario = require('../models/usuarios');

router.post('/login/usuario',(req,res) => {

  const usuarioData = {
    ID_USUARIO   : req.body.ID_USUARIO,
    PASSWORD     : req.body.PASSWORD
  };
  Usuario.login(usuarioData, (err, data) =>{
    if(data){
      res.status(200).json({
        success: true,
        mensaje: 'Inicio de sesión correctamente',
        datos: JSON.stringify(data)
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
