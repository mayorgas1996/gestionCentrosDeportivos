var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let pistaDeportivaModel = {};

pistaDeportivaModel.getPistasDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT pista_deportiva.NOMBRE,pista_deportiva.PRECIO_SIN_LUZ,pista_deportiva.PRECIO_CON_LUZ,pista_deportiva.HORA_APERTURA, pista_deportiva.HORA_CIERRE,pista_deportiva.HORA_INICIO_LUZ FROM existen RIGHT JOIN pista_deportiva on existen.ID_PISTA = pista_deportiva.ID_PISTA WHERE ID_CENTRO = ${connection.escape(id_centro)}`

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

pistaDeportivaModel.crearReserva = (reservaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO reserva SET ?', reservaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,"Reserva con exito.")
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

pistaDeportivaModel.buscarReservas = (reservaData,callback) =>{
  if(connection){
    const sql = `SELECT * FROM reserva WHERE FECHA = ${connection.escape(reservaData.FECHA)} and ID_PISTA =  ${connection.escape(reservaData.ID_PISTA)}`

    connection.query(sql,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

pistaDeportivaModel.deleteReserva = (reservaData, callback) => {
  if(connection){

    console.log("Datos de la reserva a borrar: " + JSON.stringify(reservaData));
    const sql = `DELETE FROM reserva WHERE FECHA = ${connection.escape(reservaData.FECHA)} and ID_PISTA =  ${connection.escape(reservaData.ID_PISTA)} and HORA_INICIO = ${connection.escape(reservaData.HORA_INICIO)} and ID_USUARIO = ${connection.escape(reservaData.ID_USUARIO)}`

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Reserva borrada'
        })
      }
    })
  }

}

module.exports = pistaDeportivaModel;
