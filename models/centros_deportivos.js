var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let centroDeportivoModel = {};

centroDeportivoModel.getCentros = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM centro_deportivo',(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

centroDeportivoModel.getCentro = (id_centro,callback) =>{
  if(connection){

    const sql = `SELECT * FROM centro_deportivo WHERE ID_CENTRO = ${connection.escape(id_centro)}`

    connection.query(sql,id_centro,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

centroDeportivoModel.insertCentro = (centroData, callback) =>{
  if(connection){
    connection.query('INSERT INTO centro_deportivo SET ?', centroData, (err, result) =>{
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

centroDeportivoModel.updateCentro = (centroData, callback) => {
  if(connection){
    const sql = `UPDATE centro_deportivo SET
      NOMBRE = ${connection.escape(centroData.NOMBRE)},
      DIRECCION = ${connection.escape(centroData.DIRECCION)},
      MUNICIPIO = ${connection.escape(centroData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(centroData.PROVINCIA)},
      TELEFONO = ${connection.escape(centroData.TELEFONO)},
      EMAIL = ${connection.escape(centroData.EMAIL)}

      WHERE ID_CENTRO = ${connection.escape(centroData.ID_CENTRO)}
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

centroDeportivoModel.deleteCentro = (id_centro, callback) => {
  if(connection){
    connection.query('DELETE FROM centro_deportivo WHERE ID_CENTRO = ?',id_centro, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Centro borrado'
        })
      }
    })
  }

}

module.exports = centroDeportivoModel;
