var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

const cookieParser = require('cookie-parser');

const Usuario = require('../models/usuarios');
const Admin = require('../models/admins');
const Director = require('../models/directores');
const Tecnico = require('../models/tecnicos');

router.post('/login/administrador',(req,res) => {
  Admin.conocerID(req.body.EMAIL,(err,data) =>{
    if(data){
      const adminData = {
        ID_ADMIN   : data[0].ID_ADMIN,
        EMAIL        : req.body.EMAIL,
        PASSWORD     : req.body.PASSWORD
      };
      console.log(JSON.stringify(adminData));
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
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })
})

router.post('/login/usuario',(req,res) => {
  Usuario.conocerID(req.body.EMAIL,(err,data) =>{
    if(data){
      Usuario.conocerCentro(data[0].ID_USUARIO,(err,dato) =>{
        if(dato){
          console.log("Se sabe id y centro");
      const usuarioData = {
        ID_USUARIO   : data[0].ID_USUARIO,
        EMAIL        : req.body.EMAIL,
        PASSWORD     : req.body.PASSWORD,
        ID_CENTRO    : dato[0].ID_CENTRO
      };
      Usuario.login(usuarioData, (err, data) =>{
        if(data){
          console.log("Logueado");
          const token = jwt.sign({usuarioData},'usuario');
          res.status(200).json({
            success: true,
            mensaje: 'Usuario - Inicio de sesión correctamente',
            datos: JSON.stringify(data),
            id_centro: usuarioData.ID_CENTRO,
            token: token
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: data
          })
        }
      })
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })
}
})
})

router.post('/login/director',(req,res) => {
  Director.conocerID(req.body.EMAIL,(err,dato) =>{
    if(dato){
      Director.conocerCentro(dato[0].ID_DIRECTOR,(err,data) =>{
        if(data){
          const directorData = {
            ID_DIRECTOR   : dato[0].ID_DIRECTOR,
            EMAIL        : req.body.EMAIL,
            PASSWORD      : req.body.PASSWORD,
            ID_CENTRO     : data[0].ID_CENTRO
          };
          Director.login(directorData, (err, data) =>{
            if(data){
              const token = jwt.sign({directorData},'director');
              res.status(200).json({
                success: true,
                mensaje: 'Director - Inicio de sesión correctamente',
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
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: "El director no está trabajando en ningún centro deportivo."
          })
        }
      });
    }
    else{
      res.status(500).json({
        success: false,
        mensaje: err
      })
    }
  })

})

router.post('/login/tecnico',(req,res) => {
  Tecnico.conocerID(req.body.EMAIL,(err,dato) =>{
    if(dato){
      Tecnico.conocerCentro(dato[0].ID_TECNICO,(err,data) =>{
        if(data){
          const tecnicoData = {
            ID_TECNICO   : dato[0].ID_TECNICO,
            EMAIL        : req.body.EMAIL,
            PASSWORD     : req.body.PASSWORD,
            ID_CENTRO    : data[0].ID_CENTRO
          };
          Tecnico.login(tecnicoData, (err, data) =>{
            if(data){
              const token = jwt.sign({tecnicoData},'tecnico');
              res.status(200).json({
                success: true,
                mensaje: 'Tecnico - Inicio de sesión correctamente',
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
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: "El técnico no está trabajando en ningún centro deportivo."
          })
        }
      });
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
