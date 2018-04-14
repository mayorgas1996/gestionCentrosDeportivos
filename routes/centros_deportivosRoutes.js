var express = require('express');
var router = express.Router();

const CentroDeportivo = require('../models/centros_deportivos');

/* GET users listing. */
router.get('/centros', (req,res) => {
  CentroDeportivo.getCentros((err,data) =>{
    res.status(200).json(data);
  })
});

router.get('/centros/:id', (req,res) => {
  var id = req.params.id;
  CentroDeportivo.getCentro(id,(err,data) =>{
    if(err != null){
      res.status(500).json({
        success: false,
        mensaje: 'Error buscando centro ' + req.params.id
      })
    }
    else{
      res.status(200).json(data);
    }

  })
});

router.post('/centros',(req,res) => {
  const centroData = {
    ID_CENTRO   : null,
    NOMBRE : req.body.nombre,
    DIRECCION : req.body.direccion,
    MUNICIPIO : req.body.municipio,
    PROVINCIA : req.body.provincia,
    TELEFONO : req.body.telefono,
    EMAIL : req.body.email
  };

  CentroDeportivo.insertCentro(centroData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Centro registrado correctamente',
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

router.put('/centros/:id',(req,res) => {
  const centroData = {
    ID_CENTRO     : req.params.id,
    NOMBRE : req.body.NOMBRE,
    DIRECCION : req.body.DIRECCION,
    MUNICIPIO : req.body.MUNICIPIO,
    PROVINCIA : req.body.PROVINCIA,
    TELEFONO : req.body.TELEFONO,
    EMAIL : req.body.EMAIL  

  };

  CentroDeportivo.updateCentro(centroData,(err,data) => {
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

router.post('/centros/:id',(req,res) => {
  CentroDeportivo.deleteCentro(req.params.id, (err,data) =>{
    if(data && data.mensaje){
      res.status(200).json(data);
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: 'Error deleting centro'
      })
    }
  })
});


module.exports = router;
