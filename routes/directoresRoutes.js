var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const Director = require('../models/directores');

/* GET users listing. */
router.get('/directores', (req,res) => {
  Director.getDirectores((err,data) =>{
    res.status(200).json(data);
  })
});

router.get('/directores/:id', (req,res) => {
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
});

router.post('/directores',(req,res) => {
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
  console.log("Datos recogidos");
  Director.insertDirector(directorData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Director registrado correctamente',
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

router.put('/directores/:id',(req,res) => {
  const directorData = {
    ID_DIRECTOR     : req.params.id,
    PASSWORD       : req.body.password,
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

router.post('/directores/:id',(req,res) => {
  Director.deleteDirector(req.params.id, (err,data) =>{
    if(data && data.mensaje){
      res.status(200).json(data);
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: 'Error deleting director'
      })
    }
  })
});


module.exports = router;
