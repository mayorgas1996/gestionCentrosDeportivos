var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let actividadModel = {};

actividadModel.getActividadesDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT ACTIVIDAD.ID_ACTIVIDAD,ACTIVIDAD.NOMBRE,ACTIVIDAD.TIPO_ACTIVIDAD FROM propone RIGHT JOIN actividad on propone.ID_ACTIVIDAD = actividad.ID_ACTIVIDAD WHERE ID_CENTRO = ${connection.escape(id_centro)}`

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

actividadModel.getActividad = (id_actividad,callback) =>{
  if(connection){

    const sql = `SELECT * FROM actividad WHERE ID_ACTIVIDAD = ${connection.escape(id_actividad)}`

    connection.query(sql,id_actividad,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

//ACTIVIDADES IMPARTIDAS EN UN CENTRO

actividadModel.tecnicosDisponibles = (disponibilidadData,callback) =>{
  if(connection){

    const sql = `SELECT tecnico.* FROM tecnico join trabaja on tecnico.ID_TECNICO = trabaja.ID_TECNICO WHERE trabaja.ID_CENTRO = ${connection.escape(disponibilidadData.ID_CENTRO)} and tecnico.ACTIVO = 1 and tecnico.BAJA = 0 and tecnico.DEPORTIVO = 1 and tecnico.ID_TECNICO not in (SELECT impartida.ID_TECNICO as ID_TECNICO from propone join impartida on propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD
      where propone.ID_CENTRO = ${connection.escape(disponibilidadData.ID_CENTRO)} and impartida.DIA_SEMANA = ${connection.escape(disponibilidadData.DIA_SEMANA)} and impartida.HORA_FIN> CAST(${connection.escape(disponibilidadData.HORA_INICIO)} AS time) and impartida.HORA_FIN<= CAST(${connection.escape(disponibilidadData.HORA_FIN)} AS time))`

    connection.query(sql,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

actividadModel.salasDisponibles = (disponibilidadData,callback) =>{
  if(connection){

    const sql = `SELECT * FROM sala join hay on sala.ID_SALA = hay.ID_SALA WHERE hay.ID_CENTRO = ${connection.escape(disponibilidadData.ID_CENTRO)} and sala.activo = 1 and sala.ID_SALA not in (SELECT impartida.ID_SALA as ID_SALA from propone join impartida on propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD
      where propone.ID_CENTRO = ${connection.escape(disponibilidadData.ID_CENTRO)} and impartida.DIA_SEMANA = ${connection.escape(disponibilidadData.DIA_SEMANA)} and impartida.HORA_FIN> CAST(${connection.escape(disponibilidadData.HORA_INICIO)} AS time) and impartida.HORA_FIN<= CAST(${connection.escape(disponibilidadData.HORA_FIN)} AS time))`

    connection.query(sql,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

actividadModel.insertActividad = (actividadData, callback) =>{
  if(connection){
    connection.query('INSERT INTO actividad SET ?', actividadData, (err, result) =>{
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

actividadModel.updateActividad = (actividadData, callback) => {
  if(connection){
    const sql = `UPDATE actividad SET
      NOMBRE = ${connection.escape(actividadData.NOMBRE)},
      TIPO_ACTIVIDAD = ${connection.escape(actividadData.TIPO_ACTIVIDAD)}

      WHERE ID_ACTIVIDAD = ${connection.escape(actividadData.ID_ACTIVIDAD)}
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

actividadModel.deleteActividad = (id_actividad, callback) => {
  if(connection){
    connection.query('DELETE FROM actividad WHERE ID_ACTIVIDAD = ?',id_actividad, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Actividad borrada'
        })
      }
    })
  }

}

module.exports = actividadModel;
