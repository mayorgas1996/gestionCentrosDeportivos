var express = require('express');
var router = express.Router();

const PistaDeportiva = require('../models/pistas_deportivas');

/* GET users listing. */
router.get('/pistas', (req,res) => {
  PistaDeportiva.getPistas((err,data) =>{
    res.status(200).json(data);
  })
});

router.get('/pistas/:id', (req,res) => {
  var id = req.params.id;
  PistaDeportiva.getPista(id,(err,data) =>{
    if(err != null){
      res.status(500).json({
        success: false,
        mensaje: 'Error buscando pista ' + req.params.id
      })
    }
    else{
      res.status(200).json(data);
    }

  })
});

router.post('/pistas',(req,res) => {
  const pistaData = {
    ID_PISTA   : null,
    NOMBRE : req.body.NOMBRE,
    PRECIO_SIN_LUZ : req.body.PRECIO_SIN_LUZ,
    PRECIO_CON_LUZ : req.body.PRECIO_CON_LUZ,
    HORA_APERTURA : req.body.HORA_APERTURA,
    HORA_CIERRE : req.body.HORA_CIERRE,
    HORA_INICIO_LUZ : req.body.HORA_INICIO_LUZ
  };

  PistaDeportiva.insertPista(pistaData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Pista registrado correctamente',
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

router.put('/pistas/:id',(req,res) => {
  const pistaData = {
    ID_PISTA     : req.params.id,
    NOMBRE : req.body.NOMBRE,
    PRECIO_SIN_LUZ : req.body.PRECIO_SIN_LUZ,
    PRECIO_CON_LUZ : req.body.PRECIO_CON_LUZ,
    HORA_APERTURA : req.body.HORA_APERTURA,
    HORA_CIERRE : req.body.HORA_CIERRE,
    HORA_INICIO_LUZ : req.body.HORA_INICIO_LUZ
  };

  PistaDeportiva.updatePista(pistaData,(err,data) => {
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

router.post('/pistas/:id',(req,res) => {
  PistaDeportiva.deletePista(req.params.id, (err,data) =>{
    if(data && data.mensaje){
      res.status(200).json(data);
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: 'Error deleting pista deportiva'
      })
    }
  })
});


module.exports = router;
