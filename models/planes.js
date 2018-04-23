
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let planModel = {};

planModel.getPlanesDelCentro = (id_centro, callback) =>{
  if(connection){
    connection.query('SELECT * FROM plan JOIN oferta on plan.ID_PLAN = oferta.ID_PLAN WHERE ID_CENTRO = ?',id_centro,(err, rows)=>{
        if(err){
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

planModel.getPlan = (id_plan,callback) =>{
  if(connection){

    const sql = `SELECT * FROM plan WHERE ID_PLAN = ${connection.escape(id_plan)}`

    connection.query(sql,id_plan,(err, row)=>{

        if(err){
          throw err;
        }
        else{
          callback(null,row);
        }
    });
  }
};

planModel.insertPlan = (planData, callback) =>{
  if(connection){
    connection.query('INSERT INTO plan SET ?', planData, (err, result) =>{
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

planModel.updatePlan = (planData, callback) => {
  if(connection){
    const sql = `UPDATE plan SET
      NOMBRE = ${connection.escape(planData.NOMBRE)},
      GASTOS_INSCRIPCION = ${connection.escape(planData.GASTOS_INSCRIPCION)},
      COSTE_MENSUAL = ${connection.escape(planData.COSTE_MENSUAL)},
      EDAD_MIN = ${connection.escape(planData.EDAD_MIN)},
      EDAD_MAX = ${connection.escape(planData.EDAD_MAX)},
      ACCESO_ZONA_ACUATICA = ${connection.escape(planData.ACCESO_ZONA_ACUATICA)},
      SABADOS_Y_DOMINGOS = ${connection.escape(planData.SABADOS_Y_DOMINGOS)}

      WHERE ID_PLAN = ${connection.escape(planData.ID_PLAN)}
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


planModel.updateEstadoPlan = (planData, callback) => {
  if(connection){
    const sql = `UPDATE plan SET
      ACTIVO = ${connection.escape(planData.ACTIVO)}


      WHERE ID_PLAN = ${connection.escape(planData.ID_PLAN)}
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


planModel.deletePlan = (id_plan, callback) => {
  if(connection){
    connection.query('DELETE FROM plan WHERE ID_PLAN = ?',id_plan, (err,result) =>{
      if (err){
        throw err;
      }
      else{
        callback(null,{
          'mensaje':'Plan borrado'
        })
      }
    })
  }

}

module.exports = planModel;
