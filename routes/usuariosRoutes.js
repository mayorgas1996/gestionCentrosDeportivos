var express = require('express');
var router = express.Router();

const Usuario = require('../models/usuarios');

/* GET users listing. */
router.get('/usuarios', (req,res) => {
  Usuario.getUsuarios((err,data) =>{
    res.status(200).json(data);
  })
});

router.post('/usuarios',(req,res) => {
  const usuarioData = {
    ID_USUARIO   : null,
    PASSWORD     : req.body.password,
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

  };
  console.log("Datos usuario antes de insertar " + usuarioData.PASSWORD);
  Usuario.insertUsuario(usuarioData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Usuario registrado correctamente',
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

})

router.put('/usuarios/:id',(req,res) => {
  const usuarioData = {
    ID_USUARIO   : req.params.id,
    PASSWORD     : req.body.password,
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

  };

  Usuario.updateUsuario(usuarioData,(err,data) => {
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
})

router.post('/usuarios/:id',(req,res) => {
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
});


module.exports = router;
