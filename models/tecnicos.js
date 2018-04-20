var mysql      = require('mysql');

//Para encriptar la contraseña
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(2);

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let tecnicoModel = {};

tecnicoModel.getTecnicosDelCentro = (id_centro, callback) =>{
  if(connection){
    connection.query('SELECT * FROM tecnico JOIN trabaja ON tecnico.ID_TECNICO = trabaja.ID_TECNICO WHERE trabaja.ID_CENTRO = ?',id_centro,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

tecnicoModel.getTecnico = (id_tecnico,callback) =>{
  if(connection){

    const sql = `SELECT * FROM tecnico WHERE ID_TECNICO = ${connection.escape(id_tecnico)}`

    connection.query(sql,id_tecnico,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

tecnicoModel.insertTecnico = (tecnicoData, callback) =>{
  if(connection){
    connection.query('INSERT INTO tecnico SET ?', tecnicoData, (err, result) =>{
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

tecnicoModel.insertRegistrado = (registradoData, callback) =>{
  if(connection){
    connection.query('INSERT INTO registrado SET ?', registradoData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.insertTiene = (tieneData, callback) =>{
  if(connection){
    connection.query('INSERT INTO tiene SET ?', tieneData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.insertDispone = (disponeData, callback) =>{
  if(connection){
    connection.query('INSERT INTO dispone SET ?', disponeData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.insertAnota = (anotaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO anota SET ?', anotaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.deleteTiene = (id_ejercicio, callback) =>{
  if(connection){
    connection.query('DELETE FROM tiene WHERE ID_EJERCICIO = ?', id_ejercicio, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.deleteDispone = (id_rutina, callback) =>{
  if(connection){
    connection.query('DELETE FROM dispone WHERE ID_RUTINA = ?', id_rutina, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.desasignarPlan = (id_usuario, callback) =>{
  if(connection){
    connection.query('DELETE FROM inscrito WHERE ID_USUARIO = ?', id_usuario, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.asignarPlan = (inscritoData, callback) =>{
  if(connection){
    connection.query('INSERT INTO inscrito SET ?', inscritoData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

tecnicoModel.getRecibo = (id_usuario, callback) =>{
  if(connection){

    const sql = `SELECT * FROM (SELECT registrado.ID_USUARIO, inscrito.ID_PLAN, inscrito.FECHA_FIN, registrado.ID_CENTRO FROM inscrito JOIN
      registrado on inscrito.ID_USUARIO = registrado.ID_USUARIO WHERE inscrito.ID_USUARIO = ${connection.escape(id_usuario)}) AS CONSULTA JOIN USUARIO JOIN PLAN JOIN
      centro_deportivo ON CONSULTA.ID_USUARIO = USUARIO.ID_USUARIO AND CONSULTA.ID_PLAN = PLAN.ID_PLAN AND CONSULTA.ID_CENTRO = centro_deportivo.ID_CENTRO`

    connection.query(sql, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,result);
      }
    })
  }
};

tecnicoModel.updateTecnico = (tecnicoData, callback) => {
  if(connection){
    const sql = `UPDATE tecnico SET
      PASSWORD = ${connection.escape(tecnicoData.PASSWORD)},
      NOMBRE = ${connection.escape(tecnicoData.NOMBRE)},
      EMAIL = ${connection.escape(tecnicoData.EMAIL)},
      FECHA_NACIMIENTO = ${connection.escape(tecnicoData.FECHA_NAC)},
      TELEFONO = ${connection.escape(tecnicoData.TELEFONO)},
      DOMICILIO = ${connection.escape(tecnicoData.DOMICILIO)},
      MUNICIPIO = ${connection.escape(tecnicoData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(tecnicoData.PROVINCIA)},
      DOCUMENTACION = ${connection.escape(tecnicoData.DOCUMENTACION)},
      SALARIO = ${connection.escape(tecnicoData.SALARIO)},
      ADMINISTRATIVO = ${connection.escape(tecnicoData.ADMINISTRATIVO)},
      DEPORTIVO = ${connection.escape(tecnicoData.DEPORTIVO)},
      ESPECIALIDAD = ${connection.escape(tecnicoData.ESPECIALIDAD)}

      WHERE ID_TECNICO = ${connection.escape(tecnicoData.ID_TECNICO)}
    `;

    connection.query(sql, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          mensaje:'Datos actualizados correctamente'
        })
      }
    })
  }

}

tecnicoModel.updateMyTecnico = (tecnicoData, callback) => {
  if(connection){
    const sql = `UPDATE tecnico SET
      PASSWORD = ${connection.escape(tecnicoData.PASSWORD)},
      NOMBRE = ${connection.escape(tecnicoData.NOMBRE)},
      EMAIL = ${connection.escape(tecnicoData.EMAIL)},
      TELEFONO = ${connection.escape(tecnicoData.TELEFONO)},
      DOMICILIO = ${connection.escape(tecnicoData.DOMICILIO)},
      MUNICIPIO = ${connection.escape(tecnicoData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(tecnicoData.PROVINCIA )}

      WHERE ID_TECNICO = ${connection.escape(tecnicoData.ID_TECNICO)}
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


tecnicoModel.deleteTecnico = (id_tecnico, callback) => {
  if(connection){
    connection.query('DELETE FROM tecnico WHERE ID_TECNICO = ?',id_tecnico, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Tecnico borrado'
        })
      }
    })
  }

}

tecnicoModel.login = (tecnicoData, callback) => {
  if(connection){
    const sql = `SELECT * FROM tecnico WHERE
    EMAIL =  ${connection.escape(tecnicoData.EMAIL)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Tecnico no encontrado',null);
      }
      else{
        var tecnico = row[0];
        if(bcrypt.compareSync(tecnicoData.PASSWORD,tecnico.PASSWORD)){
          callback(null,row);
        }
        else{
          callback('Password incorrecto',null);
        }
      }
    })

  }
}

tecnicoModel.conocerCentro = (idTecnico, callback) =>{
  if(connection){
    const sql = `SELECT ID_CENTRO FROM trabaja WHERE
    ID_TECNICO =  ${connection.escape(idTecnico)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Tecnico no trabaja en ningun centro',null);
      }
      else{
        callback(null,row);
      }
    })
  }
}

tecnicoModel.conocerID = (email, callback) =>{
  if(connection){
    const sql = `SELECT ID_TECNICO FROM tecnico WHERE
    EMAIL =  ${connection.escape(email)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('No existe ese email',null);
      }
      else{
        callback(null,row);
      }
    })
  }
}

tecnicoModel.buscarUsuarioEnCentro = (idCentro, busquedaData, callback) =>{
  if(connection){
    var nombre = connection.escape(busquedaData.NOMBRE);

    nombre = nombre.replace("\'","%"); //Reemplazamos al inicio
    nombre = nombre.replace("\'","%"); //Reemplazamos al final el simbolo de la comilla que hay que insertar al pasar el JSON

    const sql = `SELECT usuario.NOMBRE, usuario.EMAIL, usuario.SEXO, usuario.MUNICIPIO, usuario.ACTIVO FROM registrado join usuario on registrado.ID_USUARIO = usuario.ID_USUARIO WHERE ID_CENTRO = ${connection.escape(idCentro)} and usuario.NOMBRE LIKE '${nombre}'`;

    console.log("La consulta sql es: "  + sql);
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

module.exports = tecnicoModel;
