var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let pistaDeportivaModel = {};

pistaDeportivaModel.getPistas = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM pista_deportiva',(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

pistaDeportivaModel.getPista = (id_pista,callback) =>{
  if(connection){

    const sql = `SELECT * FROM pista_deportiva WHERE ID_PISTA = ${connection.escape(id_pista)}`

    connection.query(sql,id_pista,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

pistaDeportivaModel.insertPista = (pistaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO pista_deportiva SET ?', pistaData, (err, result) =>{
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

pistaDeportivaModel.updatePista = (pistaData, callback) => {
  if(connection){
    const sql = `UPDATE pista_deportiva SET
      NOMBRE = ${connection.escape(pistaData.NOMBRE)},
      PRECIO_SIN_LUZ = ${connection.escape(pistaData.PRECIO_SIN_LUZ)},
      PRECIO_CON_LUZ = ${connection.escape(pistaData.PRECIO_CON_LUZ)},
      HORA_APERTURA = ${connection.escape(pistaData.HORA_APERTURA)},
      HORA_CIERRE = ${connection.escape(pistaData.HORA_CIERRE)},
      HORA_INICIO_LUZ = ${connection.escape(pistaData.HORA_INICIO_LUZ)}

      WHERE ID_PISTA = ${connection.escape(pistaData.ID_PISTA)}
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

pistaDeportivaModel.deletePista = (id_pista, callback) => {
  if(connection){
    connection.query('DELETE FROM pista_deportiva WHERE ID_PISTA = ?',id_pista, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Pista borrada'
        })
      }
    })
  }

}

module.exports = pistaDeportivaModel;
