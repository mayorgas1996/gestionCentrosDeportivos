var express = require('express');
var router = express.Router();

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Actividad = require('../models/actividades');
const Director = require('../models/directores');

/* GET users listing. */
router.get('/actividades', ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Actividad.getActividadesDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })

});

router.get('/actividades/:id',ensureToken, (req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Actividad.getActividad(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando actividad ' + req.params.id
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/actividades/dia_semana/:id',ensureToken, (req,res) => {

  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      var fecha = new Date(req.params.id);
      var dia_semana = fecha.getDay();
      Actividad.getActividadesPorDia(decoded.usuarioData.ID_CENTRO, dia_semana, req.params.id, (err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando actividades '
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.get('/actividades/asistencias/:id',ensureToken, (req,res) => {

  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      var fecha = new Date(req.params.id);
      var dia_semana = fecha.getDay();
      Actividad.getAsistenciasPorDia(dia_semana, decoded.usuarioData.ID_USUARIO, req.params.id, (err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando asistencias'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/actividades/asistir',ensureToken, (req,res) => {

  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const asistenciaData = {
        ID_USUARIO: decoded.usuarioData.ID_USUARIO,
        ID_SALA : req.body.ID_SALA,
        FECHA  : req.body.FECHA,
        DIA_SEMANA: req.body.DIA_SEMANA,
        HORA_INICIO: req.body.HORA_INICIO
      };

      Actividad.registrarAsistencia(asistenciaData, (err,data) =>{
        if(err){
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting asistencia'
          })
        }
        else{
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/actividades/no_asistir',ensureToken, (req,res) => {

  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const asistenciaData = {
        ID_USUARIO: decoded.usuarioData.ID_USUARIO,
        ID_SALA : req.body.ID_SALA,
        FECHA  : req.body.FECHA,
        DIA_SEMANA: req.body.DIA_SEMANA,
        HORA_INICIO: req.body.HORA_INICIO
      };

      Actividad.borrarAsistencia(asistenciaData, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting asistencia'
          })
        }

      })
    }
  })
});

router.post('/actividades',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const actividadData = {
        ID_ACTIVIDAD: null,
        NOMBRE : req.body.NOMBRE,
        TIPO_ACTIVIDAD  : req.body.TIPO_ACTIVIDAD
      };

      Actividad.insertActividad(actividadData, (err, data) =>{
        if(data && data.insertId){
          var token = req.headers['authorization'];
          token = token.replace('Bearer ', '');
          var decoded = jwtDecode(token);

          const proponeData = {
            ID_ACTIVIDAD   : data.insertId,
            ID_CENTRO : decoded.directorData.ID_CENTRO
          }
          Director.insertPropone(proponeData,(err,datos) => {

            if(datos === true){
              res.status(200).json({
                success: true,
                mensaje: 'Actividad registrada correctamente',
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

router.put('/actividades/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const actividadData = {
        ID_ACTIVIDAD: req.params.id,
        NOMBRE : req.body.NOMBRE,
        TIPO_ACTIVIDAD  : req.body.TIPO_ACTIVIDAD
      };

      Actividad.updateActividad(actividadData,(err,data) => {
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

router.post('/actividades/disponibilidad/staff',ensureToken,(req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const disponibilidadData = {
        DIA_SEMANA      : req.body.DIA_SEMANA,
        HORA_INICIO     : req.body.HORA_INICIO,
        HORA_FIN        : req.body.HORA_FIN,
        ID_CENTRO       : decoded.directorData.ID_CENTRO
      };

      Actividad.tecnicosDisponibles(disponibilidadData,(err,data) => {
        if(data){
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

router.post('/actividades/disponibilidad/salas',ensureToken,(req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const disponibilidadData = {
        DIA_SEMANA      : req.body.DIA_SEMANA,
        HORA_INICIO     : req.body.HORA_INICIO,
        HORA_FIN        : req.body.HORA_FIN,
        ID_CENTRO       : decoded.directorData.ID_CENTRO
      };

      Actividad.salasDisponibles(disponibilidadData,(err,data) => {
        if(data){
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

router.get('/horario/actividades', ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Actividad.getHorarioDelCentro(decoded.directorData.ID_CENTRO,(err,data) =>{
        if(data){
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

});

router.post('/horario/actividades/',ensureToken,(req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const impartidaData = {
        ID_ACTIVIDAD : req.body.ID_ACTIVIDAD,
        DIA_SEMANA   : req.body.DIA_SEMANA  ,
        HORA_INICIO  : req.body.HORA_INICIO ,
        HORA_FIN     : req.body.HORA_FIN    ,
        ID_TECNICO   : req.body.ID_TECNICO  ,
        ID_SALA      : req.body.ID_SALA
      };

      Actividad.insertImpartida(impartidaData,(err,data) => {
        if(data){
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

router.post('/horario/borrar/actividad/',ensureToken,(req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const impartidaData = {
        DIA_SEMANA   : req.body.DIA_SEMANA  ,
        HORA_INICIO  : req.body.HORA_INICIO ,
        ID_SALA      : req.body.ID_SALA
      };

      Actividad.deleteImpartida(impartidaData,(err,data) => {
        if(data){
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

router.post('/actividades/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'director',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Actividad.deleteActividad(req.params.id, (err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error deleting actividad'
          })
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
