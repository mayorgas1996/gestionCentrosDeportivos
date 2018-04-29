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


usuarioModel.getUsuario = (usuarioData,callback) =>{
  if(connection){
    const sql = `SELECT USUARIO.*,PLAN.ID_PLAN, PLAN.NOMBRE AS PLAN,  DATE_FORMAT(inscrito.FECHA_FIN, "%Y-%m-%d" ) AS FECHA_FIN, DATE_FORMAT(usuario.FECHA_NAC, "%Y-%m-%d" ) AS FECHA_NAC FROM usuario JOIN inscrito JOIN registrado JOIN plan
                ON usuario.ID_USUARIO = registrado.ID_USUARIO AND USUARIO.ID_USUARIO = inscrito.ID_USUARIO and plan.ID_PLAN = inscrito.ID_PLAN
                WHERE usuario.ID_USUARIO = ${connection.escape(usuarioData.ID_USUARIO)} AND registrado.ID_CENTRO = ${connection.escape(usuarioData.ID_CENTRO)}`;
    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else{
        callback(null,row);
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

usuarioModel.login = (usuarioData, callback) => {
  if(connection){
    const sql = `SELECT * FROM usuario WHERE
    EMAIL =  ${connection.escape(usuarioData.EMAIL)} AND ACTIVO = 1`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Usuario no encontrado',null);
      }
      else{
        var usuario = row[0];
        if(bcrypt.compareSync(usuarioData.PASSWORD,usuario.PASSWORD)){
          callback(null,row);
        }
        else{
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

module.exports = usuarioModel;
