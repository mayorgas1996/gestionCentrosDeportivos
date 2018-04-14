var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let rutinaModel = {};

rutinaModel.getRutinasDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT * FROM dispone JOIN rutina ON dispone.ID_RUTINA = rutina.ID_RUTINA WHERE dispone.ID_CENTRO = ${connection.escape(id_centro)}`

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

rutinaModel.getRutina = (id_rutina,callback) =>{
  if(connection){

    const sql = `SELECT ejercicio.NOMBRE,ejs.SERIES, ejs.REPETICIONES FROM (select contiene.SERIES, contiene.REPETICIONES,
      contiene.ID_EJERCICIO from contiene join rutina on contiene.ID_RUTINA = rutina.ID_RUTINA WHERE rutina.ID_RUTINA = ${connection.escape(id_rutina)}) as ejs
      join ejercicio on ejercicio.ID_EJERCICIO = ejs.ID_EJERCICIO `

    connection.query(sql,id_rutina,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

rutinaModel.insertRutina = (rutinaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO rutina SET ?', rutinaData, (err, result) =>{
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

rutinaModel.addEjercicio = (contieneData, callback) =>{
  if(connection){
    connection.query('INSERT INTO contiene SET ?', contieneData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos actualizados correctamente'
        })
      }
    })
  }
};

rutinaModel.updateRutina = (rutinaData, callback) => {
  if(connection){
    const sql = `UPDATE rutina SET
      NOMBRE = ${connection.escape(rutinaData.NOMBRE)},
      DIFICULTAD = ${connection.escape(rutinaData.DIFICULTAD)},
      DIAS = ${connection.escape(rutinaData.DIAS)}

      WHERE ID_RUTINA = ${connection.escape(rutinaData.ID_RUTINA)}
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

rutinaModel.deleteRutina = (id_rutina, callback) => {
  if(connection){
    connection.query('DELETE FROM rutina WHERE ID_RUTINA = ?',id_rutina, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Rutina borrada'
        })
      }
    })
  }

}


rutinaModel.buscarRutinaEnCentro = (id_centro, busquedaData,callback) =>{
    if(connection){
      var nombre = connection.escape(busquedaData.NOMBRE);

      nombre = nombre.replace("\'","%"); //Reemplazamos al inicio
      nombre = nombre.replace("\'","%"); //Reemplazamos al final el simbolo de la comilla que hay que insertar al pasar el JSON

      const sql = `SELECT rutina.NOMBRE, rutina.DIFICULTAD, rutina.DIAS FROM dispone join rutina on dispone.ID_RUTINA = rutina.ID_RUTINA WHERE ID_CENTRO = ${connection.escape(id_centro)} and rutina.NOMBRE LIKE '${nombre}'`;

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

module.exports = rutinaModel;
