var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const Tecnico = require('../models/tecnicos');

/* GET users listing. */
router.get('/tecnicos', (req,res) => {
  Tecnico.getTecnicos((err,data) =>{
    res.status(200).json(data);
  })
});

router.get('/tecnicos/:id', (req,res) => {
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
});

router.post('/tecnicos',(req,res) => {
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
  console.log("Datos recogidos");
  Tecnico.insertTecnico(tecnicoData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Tecnico registrado correctamente',
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

router.put('/tecnicos/:id',(req,res) => {
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

router.post('/tecnicos/:id',(req,res) => {
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
});


module.exports = router;
