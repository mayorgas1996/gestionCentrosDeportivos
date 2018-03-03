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

usuarioModel.getUsuario = (id_usuario,callback) =>{
  if(connection){

    const sql = `SELECT * FROM usuario WHERE ID_USUARIO = ${connection.escape(id_usuario)}`

    connection.query(sql,id_usuario,(err, row)=>{

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
    PASSWORD = ${connection.escape(usuarioData.PASSWORD)},
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
    PROVINCIA = ${connection.escape(usuarioData.PROVINCIA)}

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

usuarioModel.deleteUsuario = (idUsuario, callback) => {
  if(connection){
    connection.query('DELETE FROM usuario WHERE ID_USUARIO = ?',idUsuario, (err,result) =>{
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
    console.log("Buscando si existe algun usuario con id = " + usuarioData.ID_USUARIO + " y contraseña: " +  usuarioData.PASSWORD);
    const sql = `SELECT * FROM usuario WHERE
    ID_USUARIO =  ${connection.escape(usuarioData.ID_USUARIO)}`;

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
module.exports = usuarioModel;
