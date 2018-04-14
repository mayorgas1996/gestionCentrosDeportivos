var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let ejercicioModel = {};

ejercicioModel.getEjerciciosDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT * FROM tiene JOIN ejercicio ON tiene.ID_EJERCICIO = ejercicio.ID_EJERCICIO WHERE tiene.ID_CENTRO = ${connection.escape(id_centro)}`

    connection.query(sql,id_centro,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

ejercicioModel.getEjercicio = (id_ejercicio,callback) =>{
  if(connection){

    const sql = `SELECT * FROM ejercicio WHERE ID_EJERCICIO = ${connection.escape(id_ejercicio)}`

    connection.query(sql,id_ejercicio,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

ejercicioModel.insertEjercicio = (ejercicioData, callback) =>{
  if(connection){
    connection.query('INSERT INTO ejercicio SET ?', ejercicioData, (err, result) =>{
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

ejercicioModel.updateEjercicio = (ejercicioData, callback) => {
  if(connection){
    const sql = `UPDATE ejercicio SET
      NOMBRE = ${connection.escape(ejercicioData.NOMBRE)},
      GRUPO_MUSCULAR = ${connection.escape(ejercicioData.GRUPO_MUSCULAR)},
      DIFICULTAD = ${connection.escape(ejercicioData.DIFICULTAD)}

      WHERE ID_EJERCICIO = ${connection.escape(ejercicioData.ID_EJERCICIO)}
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

ejercicioModel.deleteEjercicio = (id_ejercicio, callback) => {
  if(connection){
    connection.query('DELETE FROM ejercicio WHERE ID_EJERCICIO = ?',id_ejercicio, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Ejercicio borrado'
        })
      }
    })
  }

}


ejercicioModel.buscarEjercicioEnCentro = (id_centro, busquedaData,callback) =>{
    if(connection){
      var nombre = connection.escape(busquedaData.NOMBRE);

      nombre = nombre.replace("\'","%"); //Reemplazamos al inicio
      nombre = nombre.replace("\'","%"); //Reemplazamos al final el simbolo de la comilla que hay que insertar al pasar el JSON

      const sql = `SELECT ejercicio.NOMBRE, ejercicio.GRUPO_MUSCULAR, ejercicio.DIFICULTAD FROM tiene join ejercicio on tiene.ID_EJERCICIO = ejercicio.ID_EJERCICIO WHERE ID_CENTRO = ${connection.escape(id_centro)} and ejercicio.NOMBRE LIKE '${nombre}'`;

      connection.query(sql,(err,rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
      })
    }

  }

module.exports = ejercicioModel;
