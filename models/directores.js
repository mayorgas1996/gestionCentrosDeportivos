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

let directorModel = {};

directorModel.getDirectores = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM director',(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

directorModel.getDirector = (id_director,callback) =>{
  if(connection){

    const sql = `SELECT * FROM director JOIN dirigido ON director.ID_DIRECTOR = dirigido.ID_DIRECTOR WHERE director.ID_DIRECTOR = ${connection.escape(id_director)}`

    connection.query(sql,id_director,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

directorModel.insertDirector = (directorData, callback) =>{
  if(connection){
    connection.query('INSERT INTO director SET ?', directorData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        console.log('Director registrado con ID ' + result.insertId)
        callback(null,{
          'insertId':result.insertId
        })
      }
    })
  }
};

directorModel.insertDirigido = (dirigidoData, callback) =>{
  if(connection){
    connection.query('INSERT INTO dirigido SET ?', dirigidoData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

directorModel.insertTrabaja = (trabajaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO trabaja SET ?', trabajaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

directorModel.insertOferta = (ofertaData, callback) =>{
  if(connection){
    connection.query('INSERT INTO oferta SET ?', ofertaData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

directorModel.insertHay = (hayData, callback) =>{
  if(connection){
    connection.query('INSERT INTO hay SET ?', hayData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};


directorModel.insertExisten = (existenData, callback) =>{
  if(connection){
    connection.query('INSERT INTO existen SET ?', existenData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

directorModel.insertPropone = (proponeData, callback) =>{
  if(connection){
    connection.query('INSERT INTO propone SET ?', proponeData, (err, result) =>{
      if(err){
        throw err;
      }
      else{
        callback(null,true);
      }
    })
  }
};

directorModel.updateDirector = (directorData, callback) => {
  if(connection){
    const sql = `UPDATE director SET
      PASSWORD = ${connection.escape(directorData.PASSWORD)},
      NOMBRE = ${connection.escape(directorData.NOMBRE)},
      EMAIL = ${connection.escape(directorData.EMAIL)},
      FECHA_NACIMIENTO = ${connection.escape(directorData.FECHA_NACIMIENTO)},
      TELEFONO = ${connection.escape(directorData.TELEFONO)},
      DOMICILIO = ${connection.escape(directorData.DOMICILIO)},
      MUNICIPIO = ${connection.escape(directorData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(directorData.PROVINCIA)},
      DOCUMENTACION = ${connection.escape(directorData.DOCUMENTACION)},
      SALARIO = ${connection.escape(directorData.SALARIO)}

      WHERE ID_DIRECTOR = ${connection.escape(directorData.ID_DIRECTOR)}
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

directorModel.updateMyDirector = (directorData, callback) => {
  if(connection){
    const sql = `UPDATE director SET
      PASSWORD = ${connection.escape(directorData.PASSWORD)},
      NOMBRE = ${connection.escape(directorData.NOMBRE)},
      EMAIL = ${connection.escape(directorData.EMAIL)},
      TELEFONO = ${connection.escape(directorData.TELEFONO)},
      DOMICILIO = ${connection.escape(directorData.DOMICILIO)},
      MUNICIPIO = ${connection.escape(directorData.MUNICIPIO)},
      PROVINCIA = ${connection.escape(directorData.PROVINCIA )}

      WHERE ID_DIRECTOR = ${connection.escape(directorData.ID_DIRECTOR)}
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

directorModel.deleteDirector = (idDirector, callback) => {
  if(connection){
    connection.query('DELETE FROM director WHERE ID_DIRECTOR = ?',idDirector, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Director borrado'
        })
      }
    })
  }

}

directorModel.deleteDirigido = (idDirector, callback) => {
  if(connection){
    connection.query('DELETE FROM dirigido WHERE ID_DIRECTOR = ?',idDirector, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Instancia borrada'
        })
      }
    })
  }

}

directorModel.deleteTrabaja = (idTecnico, callback) => {
  if(connection){
    connection.query('DELETE FROM trabaja WHERE ID_TECNICO = ?',idTecnico, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          mensaje:'Instancia borrada'
        })
      }
    })
  }

}

directorModel.login = (directorData, callback) => {
  if(connection){
    const sql = `SELECT * FROM director WHERE
    EMAIL =  ${connection.escape(directorData.EMAIL)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Director no encontrado',null);
      }
      else{
        var director = row[0];
        if(bcrypt.compareSync(directorData.PASSWORD,director.PASSWORD)){
          callback(null,row);
        }
        else{
          callback('Password incorrecto',null);
        }
      }
    })

  }
}

directorModel.conocerCentro = (idDirector, callback) =>{
  if(connection){
    const sql = `SELECT ID_CENTRO FROM dirigido WHERE
    ID_DIRECTOR =  ${connection.escape(idDirector)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Director no trabaja en ningun centro',null);
      }
      else{
        callback(null,row);
      }
    })
  }
}

directorModel.conocerID = (email, callback) =>{
  if(connection){
    const sql = `SELECT ID_DIRECTOR FROM director WHERE
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

module.exports = directorModel;
