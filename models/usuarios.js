var mysql      = require('mysql');

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let usuarioModel = {};

usuarioModel.getUsuarios = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM usuario',(err, rows)=>{
      if(err){
        throw err;
      }
      else{
        callback(null,rows);
      }
    });
  }
};

usuarioModel.getUsuariosActivosDelCentro = (id_centro, callback) =>{
  if(connection){
    connection.query('SELECT USUARIO.*,PLAN.ID_PLAN, PLAN.NOMBRE AS PLAN,  DATE_FORMAT(inscrito.FECHA_FIN, "%d/%m/%Y" ) AS FECHA_FIN, DATE_FORMAT(usuario.FECHA_NAC, "%Y-%m-%d" ) AS FECHA_NAC FROM usuario JOIN inscrito JOIN registrado JOIN plan ON usuario.ID_USUARIO = registrado.ID_USUARIO AND USUARIO.ID_USUARIO = inscrito.ID_USUARIO and plan.ID_PLAN = inscrito.ID_PLAN WHERE usuario.ACTIVO = 1 AND registrado.ID_CENTRO = ? ',id_centro,(err, rows)=>{
      if(err){
        throw err;
      }
      else{
          console.log("Fecha fin: " + JSON.stringify(rows));
        callback(null,rows);
      }
    });
  }
};


usuarioModel.getUsuario = (idUsuario, idCentro,callback) =>{
  if(connection){
    const sql = `SELECT USUARIO.*,PLAN.ID_PLAN, PLAN.NOMBRE AS PLAN,  DATE_FORMAT(inscrito.FECHA_FIN, "%Y-%m-%d" ) AS FECHA_FIN, DATE_FORMAT(usuario.FECHA_NAC, "%Y-%m-%d" ) AS FECHA_NAC FROM usuario JOIN inscrito JOIN registrado JOIN plan
                ON usuario.ID_USUARIO = registrado.ID_USUARIO AND USUARIO.ID_USUARIO = inscrito.ID_USUARIO and plan.ID_PLAN = inscrito.ID_PLAN
                WHERE usuario.ID_USUARIO = ${connection.escape(idUsuario)} AND registrado.ID_CENTRO = ${connection.escape(idCentro)}`;
    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else{
        console.log("Ha devuelto resultado");
        callback(null,row);
      }
    });
  }
};

usuarioModel.getReservas = (id_usuario, fecha, callback) =>{
  if(connection){

    const sql = `SELECT DATE_FORMAT(reserva.FECHA, "%d/%m/%Y" ) AS FECHA, reserva.ID_PISTA, reserva.ID_USUARIO, TIME_FORMAT(reserva.HORA, '%H:00') as HORA, pista_deportiva.NOMBRE, pista_deportiva.PRECIO_SIN_LUZ, pista_deportiva.PRECIO_CON_LUZ, pista_deportiva.HORA_INICIO_LUZ FROM reserva join pista_deportiva on reserva.ID_PISTA = pista_deportiva.ID_PISTA WHERE reserva.ID_USUARIO =  ${connection.escape(id_usuario)} AND reserva.FECHA >=  ${connection.escape(fecha)} order by FECHA,HORA ASC`;

    connection.query(sql,(err, rows)=>{
      if(err){
        throw err;
      }
      else{
        callback(null,rows);
      }
    });
  }
};

usuarioModel.insertUsuario = (usuarioData, callback) =>{
  if(connection){
    connection.query('INSERT INTO usuario SET ?', usuarioData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,{
          'insertId':result.insertId
        })
      }
    })
  }
};

usuarioModel.updateUsuario = (usuarioData, callback) => {
  if(connection){
    const sql = `UPDATE usuario SET

    NOMBRE = ${connection.escape(usuarioData.NOMBRE)},
    EMAIL = ${connection.escape(usuarioData.EMAIL)},
    SEXO = ${connection.escape(usuarioData.SEXO)},
    FECHA_NAC = ${connection.escape(usuarioData.FECHA_NAC)},
    TELEFONO = ${connection.escape(usuarioData.TELEFONO)},
    DOCUMENTACION = ${connection.escape(usuarioData.DOCUMENTACION)},
    IBAN = ${connection.escape(usuarioData.IBAN)},
    OBSERVACIONES = ${connection.escape(usuarioData.OBSERVACIONES)},
    DIRECCION = ${connection.escape(usuarioData.DIRECCION)},
    MUNICIPIO = ${connection.escape(usuarioData.MUNICIPIO)},
    PROVINCIA = ${connection.escape(usuarioData.PROVINCIA)},
    ACTIVO = ${connection.escape(usuarioData.ACTIVO)}

    WHERE ID_USUARIO = ${connection.escape(usuarioData.ID_USUARIO)}
    `;

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos actualizados correctamente'
        })
      }
    })
  }

}

usuarioModel.updateMyUsuario = (usuarioData, callback) => {
  if(connection){
    const sql = `UPDATE usuario SET
      PASSWORD = ${connection.escape(usuarioData.PASSWORD)},
      NOMBRE = ${connection.escape(usuarioData.NOMBRE)},
      EMAIL = ${connection.escape(usuarioData.EMAIL)},
      TELEFONO = ${connection.escape(usuarioData.TELEFONO)},
      DIRECCION = ${connection.escape(usuarioData.DIRECCION)},
      MUNICIPIO = ${connection.escape(usuarioData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(usuarioData.PROVINCIA )},
      OBSERVACIONES = ${connection.escape(usuarioData.OBSERVACIONES )},
      SEXO = ${connection.escape(usuarioData.SEXO )}

      WHERE ID_USUARIO = ${connection.escape(usuarioData.ID_USUARIO)}
    `;

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos actualizados correctamente'
        })
      }
    })
  }

}

usuarioModel.renewUsuario = (id_usuario, fecha_fin, callback) => {
  if(connection){
    const sql = `UPDATE inscrito SET
    FECHA_FIN = ${connection.escape(fecha_fin)}

    WHERE ID_USUARIO = ${connection.escape(id_usuario)}
    `;

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos actualizados correctamente'
        })
      }
    })
  }

}

usuarioModel.updateUserPlan = (planData, callback) => {
  if(connection){
    const sql = `UPDATE inscrito SET
    FECHA_FIN = ${connection.escape(planData.FECHA_FIN)},
    ID_PLAN   = ${connection.escape(planData.ID_PLAN)}

    WHERE ID_USUARIO = ${connection.escape(planData.ID_USUARIO)}
    `;

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos actualizados correctamente'
        })
      }
    })
  }

}

usuarioModel.deleteUsuario = (idUsuario, callback) => {
  if(connection){
    connection.query('UPDATE usuario SET ACTIVO = 0 WHERE ID_USUARIO = ?',idUsuario, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Usuario borrado'
        })
      }
    })
  }
}

usuarioModel.deleteReserva = (reservaData, callback) =>{
  if(connection){

    const sql = `DELETE FROM reserva WHERE
      ID_USUARIO = ${connection.escape(reservaData.ID_USUARIO)} AND
      ID_PISTA   = ${connection.escape(reservaData.ID_PISTA)} AND
      FECHA   = ${connection.escape(reservaData.FECHA)} AND
      HORA   = ${connection.escape(reservaData.HORA)}
      `;
    console.log("Consulta eliminación: " + sql);

    connection.query(sql,(err, rows)=>{
      if(err){
        throw err;
      }
      else{
        callback(null,rows);
      }
    });
  }
};

usuarioModel.login = (usuarioData, callback) => {
  if(connection){
    const sql = `SELECT * FROM usuario WHERE
    EMAIL =  ${connection.escape(usuarioData.EMAIL)} AND ACTIVO = 1`;
    console.log("Consulta " + sql);
    connection.query(sql,(err, row)=>{

      if(err){
        console.log("err");
        throw err;
      }
      else if(row.length == 0){
        console.log("No encontrado");
        callback('Usuario no encontrado',null);
      }
      else{
        var usuario = row[0];
        if(bcrypt.compareSync(usuarioData.PASSWORD,usuario.PASSWORD)){
          callback(null,row);
        }
        else{
          console.log("Contraseña incorrecta");
          callback('Password incorrecto',null);
        }
      }
    })

  }
}

usuarioModel.conocerID = (email, callback) =>{
  if(connection){
    const sql = `SELECT ID_USUARIO FROM usuario WHERE
    EMAIL =  ${connection.escape(email)}`;
    console.log("Consulta: " + sql);

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('No existe ese email',null);
      }
      else{
        callback(null,row);
      }
    })
  }
}

usuarioModel.conocerCentro = (idUsuario, callback) =>{
  if(connection){
    const sql = `SELECT ID_CENTRO FROM registrado WHERE
    ID_USUARIO =  ${connection.escape(idUsuario)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Usuario no trabaja en ningun centro',null);
      }
      else{
        callback(null,row);
      }
    })
  }
}

module.exports = usuarioModel;
