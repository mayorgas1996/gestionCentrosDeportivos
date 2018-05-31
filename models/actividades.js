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

actividadModel.getHorarioDelCentro = (id_centro,callback) =>{
  if(connection){
    const sql = `SELECT actividad.NOMBRE AS ACTIVIDAD, impartida.DIA_SEMANA, impartida.HORA_INICIO, impartida.HORA_FIN, tecnico.NOMBRE AS TECNICO, sala.NOMBRE AS SALA FROM impartida join propone join tecnico join sala join actividad on impartida.ID_ACTIVIDAD = actividad.ID_ACTIVIDAD and impartida.ID_ACTIVIDAD = propone.ID_ACTIVIDAD and tecnico.ID_TECNICO = impartida.ID_TECNICO and sala.ID_SALA = impartida.ID_SALA WHERE propone.ID_CENTRO = ${connection.escape(id_centro)} ORDER BY impartida.DIA_SEMANA ASC `

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

actividadModel.getActividadesPorDia = (id_centro, dia_semana,fecha,callback) =>{
  if(connection){

    //Manipular el dia de la semana y pasar a número para que lo pueda leer la consulta correctamente
    console.log("centro: " +id_centro + " dia "+ dia_semana + " fecha: " + fecha);
    const sql = `SELECT
    impartida.*,
    tecnico.NOMBRE AS TECNICO,
    SALA.NOMBRE AS SALA,
    sala.AFORO,
    actividad.NOMBRE AS ACTIVIDAD,
    actividad.TIPO_ACTIVIDAD,
    (SELECT COUNT(*)
        FROM apuntado
            WHERE ID_SALA = sala.ID_SALA AND FECHA = ${connection.escape(fecha)} AND DIA_SEMANA = ${connection.escape(dia_semana)} AND HORA_INICIO = impartida.HORA_INICIO) as APUNTADOS
        FROM impartida JOIN propone JOIN tecnico JOIN sala JOIN actividad
            ON tecnico.ID_TECNICO = impartida.ID_TECNICO AND
                impartida.ID_SALA = sala.ID_SALA AND
                actividad.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD AND
                impartida.ID_ACTIVIDAD = propone.ID_ACTIVIDAD
                    WHERE impartida.DIA_SEMANA = ${connection.escape(dia_semana)} AND propone.ID_CENTRO = ${connection.escape(id_centro)} `

    console.log("Consulta: " + sql);

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error: " + err);
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

actividadModel.getAsistenciasPorDia = (dia_semana, id_usuario ,fecha,callback) =>{
  if(connection){

    //Manipular el dia de la semana y pasar a número para que lo pueda leer la consulta correctamente
    console.log("dia_semana: " +dia_semana + " usuario "+ id_usuario + " fecha: " + fecha);
    const sql = `SELECT apuntado.HORA_INICIO, apuntado.ID_SALA FROM apuntado WHERE apuntado.ID_USUARIO = ${connection.escape(id_usuario)} AND apuntado.FECHA = ${connection.escape(fecha)} AND apuntado.DIA_SEMANA = ${connection.escape(dia_semana)} `


    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error: " + err);
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

actividadModel.insertImpartida = (impartidaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO impartida SET ?', impartidaData, (err, result) =>{
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

actividadModel.registrarAsistencia = (asistenciaData, callback) =>{
  if(connection){
    console.log("Registrando asistencia: " + JSON.stringify(asistenciaData));
    connection.query('INSERT INTO apuntado SET ?', asistenciaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

actividadModel.borrarAsistencia = (asistenciaData, callback) =>{
  if(connection){
    const sql = `DELETE FROM apuntado WHERE ID_USUARIO = ${connection.escape(asistenciaData.ID_USUARIO)} AND FECHA = ${connection.escape(asistenciaData.FECHA)} AND ID_SALA = ${connection.escape(asistenciaData.ID_SALA)} AND DIA_SEMANA = ${connection.escape(asistenciaData.DIA_SEMANA)} AND HORA_INICIO = ${connection.escape(asistenciaData.HORA_INICIO)} `;

    connection.query(sql, (err, result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Asistencia borrada'
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
