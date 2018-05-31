var express = require('express');
var router = express.Router();

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

//Para creación de token y comprobación -> Sesiones
var jwt = require('jsonwebtoken');
//Para decodificar el contenido del Payload del token donde metemos información del usuario que ha iniciado sesión
var jwtDecode = require('jwt-decode');

const Tecnico = require('../models/tecnicos');
const CentroDeportivo = require('../models/centros_deportivos');
const Usuario = require('../models/usuarios');
const Analisis = require('../models/analisis');
const Rutina = require('../models/rutinas');

/* GET users listing. */
router.get('/usuarios_activos',ensureToken, (req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Usuario.getUsuariosActivosDelCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
        res.status(200).json(data);
      })
    }
  })
});

router.get('/usuarios/usuario/:id',ensureToken, (req,res) => {
  var token = req.headers['authorization'];
  token = token.replace('Bearer ', '');
  var decoded = jwtDecode(token);
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
//      var id = req.params.id;
      const usuarioData = {
        ID_USUARIO: req.params.id,
        ID_CENTRO : decoded.tecnicoData.ID_CENTRO
      }
      console.log(JSON.stringify(usuarioData));
      Usuario.getUsuario(usuarioData.ID_USUARIO, usuarioData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando usuario'
          })
        }
        else{
          console.log("Va a devolver: " + data);
          res.status(200).json(data);
        }

      })
    }
  })
});

router.post('/usuarios/buscar',ensureToken,(req,res)=> {
  jwt.verify(req.token,'tecnico',(err,data) => {
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const busquedaData = {
        NOMBRE: req.body.nombre,
      }


      Tecnico.buscarUsuarioEnCentro(decoded.tecnicoData.ID_CENTRO, busquedaData,(err,data) =>{
        if(data.length === 0){
          res.status(200).json({
            success: false
          })
        }
        else if(data){
          res.status(200).json({
            success: true,
            resultado: JSON.stringify(data)
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando usuario'
          })
        }
      })
    }
  })

})

//Ruta para poder ver el técnico su propio perfil
router.post('/usuarios/mi_perfil',ensureToken,(req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      Usuario.getUsuario(decoded.usuarioData.ID_USUARIO, decoded.usuarioData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando usuario.'
          })
        }
        else{
          console.log("Recogidos datos: " + data);
          res.status(200).json(data);
        }

      })

    }
  })
});


router.put('/usuarios/mi_perfil/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const usuarioData = {
        ID_USUARIO: req.params.id,
        PASSWORD: bcrypt.hashSync(req.body.password, salt),
        NOMBRE  : req.body.nombre,
        EMAIL   : req.body.email,
        TELEFONO: req.body.telefono,
        DIRECCION: req.body.direccion,
        MUNICIPIO: req.body.municipio,
        PROVINCIA: req.body.provincia,
        OBSERVACIONES: req.body.observaciones,
        SEXO : req.body.sexo
      };
      Usuario.updateMyUsuario(usuarioData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          console.log("Error");
          res.status(500).json({
            success: false,
            mensaje: 'Error'
          })
        }

      })
    }
  })
});

//INSERTAR O REGISTRAR UN USUARIO, PARA ELLO TAMBIEN SE INSERTA EN LA TABLA 'REGISTRADO' JUNTO CON LA TABLA 'TECNICO'
// HACEMOS COMPROBACIÓN DE QUE EL CENTRO DEPORTIVO AL QUE SE ASIGNA DICHO USUARIO EXISTE
router.post('/usuarios',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const usuarioData = {
        ID_USUARIO   : null,
        PASSWORD     : bcrypt.hashSync(req.body.PASSWORD, salt),
        NOMBRE       : req.body.NOMBRE,
        EMAIL        : req.body.EMAIL,
        SEXO         : req.body.SEXO,
        FECHA_NAC    : req.body.FECHA_NAC,
        TELEFONO     : req.body.TELEFONO,
        DOCUMENTACION: req.body.DOCUMENTACION,
        IBAN         : req.body.IBAN,
        OBSERVACIONES: req.body.OBSERVACIONES,
        DIRECCION    : req.body.DIRECCION,
        MUNICIPIO    : req.body.MUNICIPIO,
        PROVINCIA    : req.body.PROVINCIA,
        ACTIVO       : req.body.ACTIVO

      };
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);
      CentroDeportivo.getCentro(decoded.tecnicoData.ID_CENTRO,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando centro '
          })
        }
        else if(data === null){
          res.status(500).json({
            success: false,
            mensaje: err
          })
        }
        else{
          Usuario.insertUsuario(usuarioData, (err, data) =>{
            if(data && data.insertId){
              const registradoData = {
                ID_USUARIO   : data.insertId,
                ID_CENTRO : decoded.tecnicoData.ID_CENTRO
              }
              Tecnico.insertRegistrado(registradoData,(err,datos) => {

                if(datos === true){
                  res.status(200).json({
                    success:true,
                    ID_USUARIO:data.insertId,
                    mensaje: 'Usuario registrado con exito'
                  })
                }
                else{
                  res.status(500).json({
                    success: false,
                    mensaje: 'Error'
                  });
                }
              });

            }
          });
        }
      });
    }
  });
});

//ACTUALIZACIÓN DE UN USUARIO
router.put('/usuarios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const usuarioData = {
        ID_USUARIO   : req.params.id,
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
        ACTIVO       : req.body.activo
      };

      Usuario.updateUsuario(usuarioData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Usuario actualizado con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Usuario.'
          });
        }

      });
    }
  })
});


//ACTUALIZACIÓN DE UN USUARIO
router.put('/usuarios/:id/plan',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const planData = {
        ID_USUARIO   : req.params.id,
        ID_PLAN      : req.body.ID_PLAN,
        FECHA_FIN    : req.body.FECHA_FIN
      };

      Usuario.updateUserPlan(planData,(err,data) => {
        if(data && data.mensaje){
          res.status(200).json({
            success:true,
            mensaje: 'Usuario actualizado con exito.'
          })
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error actualizando el Usuario.'
          });
        }

      });
    }
  })
});

router.post('/usuarios/:id/renovar',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Usuario.renewUsuario(req.params.id, req.body.FECHA_FIN,(err,data) =>{
        if(data && data.mensaje){
          res.status(200).json(data);
        }
        else{
          res.status(500).json({
            success: false,
            mensaje: 'Error renewing user'
          })
        }
      })
    }
  })
});

router.post('/usuarios/plan/asignar',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const inscritoData = {
        ID_USUARIO   : req.body.ID_USUARIO,
        ID_PLAN      : req.body.ID_PLAN,
        FECHA_FIN    : req.body.FECHA_FIN
      }

      Tecnico.desasignarPlan(inscritoData.ID_USUARIO, (err,data) => {
        if(data === true){
          Tecnico.asignarPlan(inscritoData, (err,data) =>{
            if(data === true){
              res.status(200).json({
                success:true,
                mensaje: 'Plan asignado al usuario con exito.'
              })
            }
            else{
              res.status(500).json({
                success: false,
                mensaje: 'Error asignando plan al usuario.'
              })
            }
          })
        }
      })
    }
  })
});

router.post('/usuarios/:id',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
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
    }
  })
});

router.get('/usuarios/usuario/:id/recibo',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      Tecnico.getRecibo(req.params.id,(err,data) => {
        if(err){
          res.status(500).json({
            success: false,
            mensaje: 'Error obteniendo recibo.'
          })
        }
        else{
          res.status(200).json({
            success: true,
            mensaje: 'Recibo obtenido con exito.',
            data
          })

        }

      })
    }
  })
});

router.post('/usuarios/usuario/:id/analisis',ensureToken,(req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      const analisisData = {
        ID_ANALISIS      : null,
        PESO             : req.body.PESO,
        GRASA_CORPORAL   : req.body.GRASA_CORPORAL,
        PORCENTAJE_AGUA  : req.body.PORCENTAJE_AGUA,
        MASA_OSEA        : req.body.MASA_OSEA,
        MASA_VISCERAL    : req.body.MASA_VISCERAL,
        MASA_MUSCULAR    : req.body.MASA_MUSCULAR,
        EDAD_METABOLICA  : req.body.EDAD_METABOLICA,
        IMC              : req.body.IMC,
        FECHA            : req.body.FECHA
      };
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

          Analisis.insertAnalisis(analisisData, (err, data) =>{
            if(data && data.insertId){
              const anotaData = {
                ID_ANALISIS   : data.insertId,
                ID_USUARIO : req.params.id
              }
              Tecnico.insertAnota(anotaData,(err,datos) => {

                if(datos === true){
                  res.status(200).json({
                    success:true,
                    mensaje: 'Analisis registrado con exito'
                  })
                }
                else{
                  res.status(500).json({
                    success: false,
                    mensaje: 'Error'
                  });
                }
              });

            }
          });
        }
  });
});

router.get('/usuarios/usuario/:id/analisis',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Analisis.getAnalisisDelUsuario(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando analisis.'
          })
        }
        else if(data.length === 0){
          res.status(200).json({
            success: true,
            mensaje: "No se han encontrado analisis."
          });
        }
        else{
          res.status(200).json(data);
        }
      })
    }
  })
});

router.get('/usuarios/usuario/:id/ultimoAnalisis',ensureToken, (req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id;
      Analisis.getAnalisisDelUsuario(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando analisis.'
          })
        }
        else if(data.length === 0){
          res.status(200).json({
            success: true,
            mensaje: "No se han encontrado analisis."
          });
        }
        else{
          res.status(200).json(data);
        }
      })
    }
  })
});

router.get('/analisis/:id_analisis',ensureToken, (req,res) => {
  jwt.verify(req.token,'tecnico',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var id = req.params.id_analisis;
      Analisis.getAnalisis(id,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando analisis.'
          })
        }
        else{
          res.status(200).json(data);
        }
      })
    }
  })
});

router.get('/reservas/:fecha',ensureToken, (req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Usuario.getReservas(decoded.usuarioData.ID_USUARIO, req.params.fecha,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando reservas.'
          })
        }
        else{
          res.status(200).json(data);
        }
      })
    }
  })
});

router.post('/reserva/eliminar',ensureToken, (req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      const reservaData = {
        ID_PISTA    : req.body.ID_PISTA,
        FECHA       : req.body.FECHA,
        HORA        : req.body.HORA,
        ID_USUARIO  : decoded.usuarioData.ID_USUARIO,
      };

      Usuario.deleteReserva(reservaData,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error eliminando reserva.'
          })
        }
        else{
          res.status(200).json(data);
        }
      })
    }
  })
});

router.get('/usuario/mi_rutina/:fecha',ensureToken, (req,res) => {
  jwt.verify(req.token,'usuario',(err,data) =>{
    if(err){
      res.sendStatus(403); //Acceso no permitido
    }
    else{
      var token = req.headers['authorization'];
      token = token.replace('Bearer ', '');
      var decoded = jwtDecode(token);

      Rutina.getMiRutina(decoded.usuarioData.ID_USUARIO, req.params.fecha,(err,data) =>{
        if(err != null){
          res.status(500).json({
            success: false,
            mensaje: 'Error buscando rutina.'
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
