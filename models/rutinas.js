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

    connection.query(sql,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
}

rutinaModel.getRutinaDelCentro = (id_rutina,id_centro,callback) =>{
  if(connection){
    const sql = `SELECT rutina.* FROM dispone JOIN rutina ON dispone.ID_RUTINA = rutina.ID_RUTINA WHERE dispone.ID_CENTRO = ${connection.escape(id_centro)} AND rutina.ID_RUTINA = ${connection.escape(id_rutina)}`

    connection.query(sql,id_centro,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
}

rutinaModel.getEjerciciosRutina = (id_rutina,callback) =>{
  if(connection){

    const sql = `SELECT ejercicio.* ,ejs.SERIES, ejs.REPETICIONES FROM (select contiene.SERIES, contiene.REPETICIONES,
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

rutinaModel.addPosee = (poseeData, callback) =>{
  if(connection){
    console.log(JSON.stringify(poseeData));
    connection.query('INSERT INTO posee SET ?', poseeData, (err, result) =>{
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
    var paso;
    let values = '';
    for (paso = 0; paso < contieneData.EJERCICIOS.length; paso++) {
      values += '('+contieneData.ID_RUTINA+','+contieneData.EJERCICIOS[paso].ID_EJERCICIO+','+contieneData.SERIES[paso]+','+contieneData.REPETICIONES[paso]+')';
      if(paso+1 != contieneData.EJERCICIOS.length){
        values+=',';
      }
    };

    var sql = 'INSERT INTO contiene (ID_RUTINA, ID_EJERCICIO, SERIES, REPETICIONES) VALUES ' + values;

    connection.query(sql, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Datos insertados'
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

rutinaModel.deleteEjerciciosAnteriores = (id_rutina, callback) => {
  if(connection){
    connection.query('DELETE FROM contiene WHERE ID_RUTINA = ?',id_rutina, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Ejercicios borrados'
        })
      }
    })
  }

}

rutinaModel.deletePosee = (id_usuario, callback) => {
  if(connection){
    connection.query('DELETE FROM posee WHERE ID_USUARIO = ?',id_usuario, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Asignación borrada'
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


rutinaModel.buscarRutinaDelUsuario = (id_usuario,callback) =>{
    if(connection){

      const sql = `SELECT rutina.* FROM posee join rutina on posee.ID_RUTINA = rutina.ID_RUTINA where posee.ID_USUARIO = ${connection.escape(id_usuario)}`;

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


  rutinaModel.getMiRutina = (id_usuario, fecha,callback) =>{
    if(connection){
      const sql = `SELECT DATE_FORMAT(posee.FECHA_INICIO, "%d/%m/%Y" ) AS FECHA_INICIO ,rutina.NOMBRE AS RUTINA, ejercicio.*, contiene.SERIES, contiene.REPETICIONES
      FROM posee JOIN rutina JOIN ejercicio join contiene
      ON posee.ID_RUTINA = rutina.ID_RUTINA and rutina.ID_RUTINA = contiene.ID_RUTINA and contiene.ID_EJERCICIO = ejercicio.ID_EJERCICIO where posee.ID_USUARIO = ${connection.escape(id_usuario)}`

      connection.query(sql,(err, rows)=>{
          if(err){
            throw err;
          }
          else{
            callback(null,rows);
          }
      });
    }
  }

module.exports = rutinaModel;
