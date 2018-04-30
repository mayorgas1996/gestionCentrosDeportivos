var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let analisisModel = {};

analisisModel.getAnalisisDelUsuario = (id_usuario,callback) =>{
  if(connection){
    const sql = `SELECT analisis.*, DATE_FORMAT(analisis.FECHA, "%d/%m/%Y" ) AS FECHA FROM anota JOIN analisis ON anota.ID_ANALISIS = analisis.ID_ANALISIS WHERE anota.ID_USUARIO = ${connection.escape(id_usuario)} order by analisis.FECHA DESC`

    connection.query(sql,id_usuario,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

analisisModel.getAnalisis = (id_analisis,callback) =>{
  if(connection){

    const sql = `SELECT analisis.*,DATE_FORMAT(analisis.FECHA, "%d/%m/%Y" ) AS FECHA FROM analisis WHERE ID_ANALISIS = ${connection.escape(id_analisis)}`

    connection.query(sql,id_analisis,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

analisisModel.insertAnalisis = (analisisData, callback) =>{
  if(connection){
    connection.query('INSERT INTO analisis SET ?', analisisData, (err, result) =>{
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

module.exports = analisisModel;
