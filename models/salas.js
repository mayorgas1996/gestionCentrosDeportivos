var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let salaModel = {};

salaModel.getSalasDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT SALA.ID_SALA,SALA.NOMBRE,SALA.AFORO FROM hay RIGHT JOIN sala on hay.ID_SALA = sala.ID_SALA WHERE ID_CENTRO = ${connection.escape(id_centro)}`

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

salaModel.getSala = (id_sala,callback) =>{
  if(connection){

    const sql = `SELECT * FROM sala WHERE ID_SALA = ${connection.escape(id_sala)}`

    connection.query(sql,id_sala,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

salaModel.insertSala = (salaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO sala SET ?', salaData, (err, result) =>{
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

salaModel.updateSala = (salaData, callback) => {
  if(connection){
    const sql = `UPDATE sala SET
      NOMBRE = ${connection.escape(salaData.NOMBRE)},
      AFORO = ${connection.escape(salaData.AFORO)}

      WHERE ID_SALA = ${connection.escape(salaData.ID_SALA)}
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

salaModel.updateEstadoSala = (salaData, callback) => {
  if(connection){
    const sql = `UPDATE sala SET
      ACTIVO = ${connection.escape(salaData.ACTIVO)}

      WHERE ID_SALA= ${connection.escape(salaData.ID_SALA)}
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

salaModel.deleteSala = (id_sala, callback) => {
  if(connection){
    connection.query('DELETE FROM sala WHERE ID_SALA = ?',id_sala, (err,result) =>{
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

module.exports = salaModel;
