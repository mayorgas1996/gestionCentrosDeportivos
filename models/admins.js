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

let adminModel = {};

adminModel.getAdmins = (callback) =>{
  if(connection){
    connection.query('SELECT * FROM administrador',(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

adminModel.getAdmin = (id_admin,callback) =>{
  if(connection){

    const sql = `SELECT * FROM administrador WHERE ID_ADMIN = ${connection.escape(id_admin)}`

    connection.query(sql,id_admin,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

adminModel.insertAdmin = (adminData, callback) =>{
  if(connection){
    connection.query('INSERT INTO administrador SET ?', adminData, (err, result) =>{
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

adminModel.updateAdmin = (adminData, callback) => {
  if(connection){
    const sql = `UPDATE administrador SET
      PASSWORD = ${connection.escape(adminData.PASSWORD)},
      NOMBRE = ${connection.escape(adminData.NOMBRE)},
      EMAIL = ${connection.escape(adminData.EMAIL)}
      WHERE ID_ADMIN = ${connection.escape(adminData.ID_ADMIN)}
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

adminModel.deleteAdmin = (idAdmin, callback) => {
  if(connection){
    connection.query('DELETE FROM administrador WHERE ID_ADMIN = ?',idAdmin, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Administrador borrado'
        })
      }
    })
  }

}

adminModel.login = (adminData, callback) => {
  if(connection){
    const sql = `SELECT * FROM administrador WHERE
    ID_ADMIN =  ${connection.escape(adminData.ID_ADMIN)}`;

    connection.query(sql,(err, row)=>{

      if(err){
        throw err;
      }
      else if(row.length == 0){
        callback('Administrador no encontrado',null);
      }
      else{
        var admin = row[0];
        if(bcrypt.compareSync(adminData.PASSWORD,admin.PASSWORD)){
          callback(null,row);
        }
        else{
          callback('Password incorrecto',null);
        }
      }
    })

  }
}

module.exports = adminModel;
