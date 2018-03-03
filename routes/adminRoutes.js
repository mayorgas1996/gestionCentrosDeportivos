var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const Admin = require('../models/admins');

/* GET users listing. */
router.get('/admins', (req,res) => {
  Admin.getAdmins((err,data) =>{
    res.status(200).json(data);
  })
});

router.post('/admins',(req,res) => {
  const adminData = {
    ID_ADMIN: null,
    PASSWORD: req.body.password,
    NOMBRE  : req.body.nombre,
    EMAIL   : req.body.email
  };

  Admin.insertAdmin(adminData, (err, data) =>{
    if(data && data.insertId){
      res.status(200).json({
        success: true,
        mensaje: 'Administrador registrado correctamente',
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

router.put('/admins/:id',(req,res) => {
  const adminData = {
    ID_ADMIN: req.params.id,
    PASSWORD: bcrypt.hashSync(req.body.password, salt),
    NOMBRE  : req.body.nombre,
    EMAIL   : req.body.email
  };
  Admin.updateAdmin(adminData,(err,data) => {
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

router.post('/admins/:id',(req,res) => {
  Admin.deleteAdmin(req.params.id, (err,data) =>{
    if(data && data.mensaje){
      res.status(200).json(data);
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: 'Error deleting admin'
      })
    }
  })
});


module.exports = router;
