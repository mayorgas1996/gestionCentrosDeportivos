var express = require('express');
var router = express.Router();

const Plan = require('../models/planes');

/* GET users listing. */
router.get('/planes', (req,res) => {
  Plan.getPlanes((err,data) =>{
    res.status(200).json(data);
  })
});

router.get('/planes/:id', (req,res) => {
  var id = req.params.id;
  Plan.getPlan(id,(err,data) =>{
    if(err != null){
      res.status(500).json({
        success: false,
        mensaje: 'Error buscando plan ' + req.params.id
      })
    }
    else{
      res.status(200).json(data);
    }

  })
});

router.post('/planes',(req,res) => {
  const planData = {
    ID_PLAN   : null,
    NOMBRE : req.body.NOMBRE,
    GASTOS_INSCRIPCION : req.body.GASTOS_INSCRIPCION,
    COSTE_MENSUAL : req.body.COSTE_MENSUAL,
    EDAD_MIN : req.body.EDAD_MIN,
    EDAD_MAX : req.body.EDAD_MAX,
    ACCESO_ZONA_ACUATICA : req.body.ACCESO_ZONA_ACUATICA,
    ACCESO_ACTIVIDADES : req.body.ACCESO_ACTIVIDADES,
    ACCESO_FITNESS : req.body.ACCESO_FITNESS,
    SABADOS_Y_DOMINGOS : req.body.SABADOS_Y_DOMINGOS
  };

  Plan.insertPlan(planData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Plan registrado correctamente',
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

router.put('/planes/:id',(req,res) => {
  const planData = {
    ID_CENTRO     : req.params.id,
    NOMBRE : req.body.NOMBRE,
    GASTOS_INSCRIPCION : req.body.GASTOS_INSCRIPCION,
    COSTE_MENSUAL : req.body.COSTE_MENSUAL,
    EDAD_MIN : req.body.EDAD_MIN,
    EDAD_MAX : req.body.EDAD_MAX,
    ACCESO_ZONA_ACUATICA : req.body.ACCESO_ZONA_ACUATICA,
    ACCESO_ACTIVIDADES : req.body.ACCESO_ACTIVIDADES,
    ACCESO_FITNESS : req.body.ACCESO_FITNESS,
    SABADOS_Y_DOMINGOS : req.body.SABADOS_Y_DOMINGOS

  };

  Plan.updatePlan(planData,(err,data) => {
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

router.post('/planes/:id',(req,res) => {
  Plan.deletePlan(req.params.id, (err,data) =>{
    if(data && data.mensaje){
      res.status(200).json(data);
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: 'Error deleting plan'
      })
    }
  })
});


module.exports = router;
