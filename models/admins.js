var mysql      = require('mysql');

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

module.exports = adminModel;
