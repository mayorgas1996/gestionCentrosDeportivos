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

tecnicoModel.getTecnicos = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM tecnico',(err, rows)=>{
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

tecnicoModel.updateTecnico = (tecnicoData, callback) => {
  if(connection){
    console.log("Tecnico a actualizar")
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
    ID_TECNICO =  ${connection.escape(tecnicoData.ID_TECNICO)}`;

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


module.exports = tecnicoModel;
