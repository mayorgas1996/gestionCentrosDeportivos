var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);
//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Admin = require('../models/admins');

/* GET users listing. */
router.get('/admins', ensureToken, (req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Admin.getAdmins((err,data) =>{
        res.status(200).json(data);
      })
    }
  })

});

router.get('/admins/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Admin.getAdmin(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando administrador'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/admins',ensureToken,(req,res) => {

  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const adminData = {
        ID_ADMIN: null,
        PASSWORD: bcrypt.hashSync(req.body.password, salt),
        NOMBRE  : req.body.nombre,
        EMAIL   : req.body.email,
        TELEFONO: req.body.telefono,
        DOMICILIO: req.body.domicilio,
        MUNICIPIO: req.body.municipio,
        PROVINCIA: req.body.provincia
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
    }
  })
})

router.put('/admins/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      console.log('Datos recibidos: ' + JSON.stringify(req.body) );
      const adminData = {
        ID_ADMIN: req.params.id,
        NOMBRE  : req.body.NOMBRE,
        EMAIL   : req.body.EMAIL,
        TELEFONO: req.body.TELEFONO,
        DOMICILIO: req.body.DOMICILIO,
        MUNICIPIO: req.body.MUNICIPIO,
        PROVINCIA: req.body.PROVINCIA
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
    }
  })
})

router.put('/admins/mi_perfil/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      console.log('Datos recibidos: ' + JSON.stringify(req.body) );
      const adminData = {
        ID_ADMIN: req.params.id,
        PASSWORD: bcrypt.hashSync(req.body.password, salt),
        NOMBRE  : req.body.nombre,
        EMAIL   : req.body.email,
        TELEFONO: req.body.telefono,
        DOMICILIO: req.body.domicilio,
        MUNICIPIO: req.body.municipio,
        PROVINCIA: req.body.provincia
      };
      Admin.updateMyAdmin(adminData,(err,data) => {
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
    }
  })
})

router.post('/admins/delete/:id',ensureToken,(req,res) => {
  console.log("5555555");
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
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
    }
  })
});

router.post('/admins/mi_perfil',ensureToken,(req,res) => {
  jwt.verify(req.token,'administrador',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      Admin.getAdmin(decoded.adminData.ID_ADMIN,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando admin.'
          })
        }
        else{
          res.status(200).json(data);
        }

      })

    }
  })
});

//Middleware que nos comprueba que un administrador ya ha iniciado sesión
function ensureToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  //Si la cabecera contiene algún dato
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else{
    res.sendStatus(403);
  }

}

module.exports = router;
