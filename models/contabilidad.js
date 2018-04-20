var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let contabilidadModel = {};

contabilidadModel.getContabilidadDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT * FROM refleja JOIN operacion ON refleja.ID_OPERACION = operacion.ID_OPERACION WHERE refleja.ID_CENTRO = ${connection.escape(id_centro)} ORDER BY FECHA DESC`

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

contabilidadModel.getOperacion = (id_operacion,callback) =>{
  if(connection){

    const sql = `SELECT * FROM operacion WHERE ID_OPERACION = ${connection.escape(id_operacion)}`

    connection.query(sql,id_operacion,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

contabilidadModel.insertOperacion = (operacionData, callback) =>{
  if(connection){
    connection.query('INSERT INTO operacion SET ?', operacionData, (err, result) =>{
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

contabilidadModel.updateOperacion = (operacionData, callback) => {
  if(connection){
    const sql = `UPDATE operacion SET
      ID_USUARIO = ${connection.escape(operacionData.ID_USUARIO)},
      MOTIVO = ${connection.escape(operacionData.MOTIVO)},
      CANTIDAD = ${connection.escape(operacionData.CANTIDAD)},
      FECHA = ${connection.escape(operacionData.FECHA)}

      WHERE ID_OPERACION = ${connection.escape(operacionData.ID_OPERACION)}
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

contabilidadModel.deleteOperacion = (id_operacion, callback) => {
  if(connection){
    connection.query('DELETE FROM operacion WHERE ID_OPERACION = ?',id_operacion, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Sala borrada'
        })
      }
    })
  }

}

contabilidadModel.deleteRefleja = (id_operacion, callback) =>{
  if(connection){
    connection.query('DELETE FROM refleja WHERE ID_OPERACION = ?', id_operacion, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

contabilidadModel.insertRefleja = (reflejaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO refleja SET ?', reflejaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

module.exports = contabilidadModel;
