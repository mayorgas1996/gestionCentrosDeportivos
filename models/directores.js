var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let directorModel = {};

directorModel.getDirectores = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM director',(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

directorModel.getDirector = (id_director,callback) =>{
  if(connection){

    const sql = `SELECT * FROM director WHERE ID_DIRECTOR = ${connection.escape(id_director)}`

    connection.query(sql,id_director,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

directorModel.insertDirector = (directorData, callback) =>{
  if(connection){
    connection.query('INSERT INTO director SET ?', directorData, (err, result) =>{
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

directorModel.updateDirector = (directorData, callback) => {
  if(connection){
    const sql = `UPDATE director SET
      PASSWORD = ${connection.escape(directorData.PASSWORD)},
      NOMBRE = ${connection.escape(directorData.NOMBRE)},
      EMAIL = ${connection.escape(directorData.EMAIL)},
      FECHA_NACIMIENTO = ${connection.escape(directorData.FECHA_NAC)},
      TELEFONO = ${connection.escape(directorData.TELEFONO)},
      DOMICILIO = ${connection.escape(directorData.DOMICILIO)},
      MUNICIPIO = ${connection.escape(directorData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(directorData.PROVINCIA)},
      DOCUMENTACION = ${connection.escape(directorData.DOCUMENTACION)},
      SALARIO = ${connection.escape(directorData.SALARIO)}

      WHERE ID_DIRECTOR = ${connection.escape(directorData.ID_DIRECTOR)}
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

directorModel.deleteDirector = (idDirector, callback) => {
  if(connection){
    connection.query('DELETE FROM director WHERE ID_DIRECTOR = ?',idDirector, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Director borrado'
        })
      }
    })
  }

}

module.exports = directorModel;
