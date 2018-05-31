var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'gestion_deportiva'
});

let estadisticaModel = {};

//Dado un ID_ACTIVIDAD y un CENTRO sacar para el mes actual la asistencia para cada día de la semana de personas a esa actividad
estadisticaModel.getActividad = (id, id_centro,callback) =>{
  if(connection){

    var hoy = new Date();
    var primer_dia_mes = hoy.getFullYear() + '-' + (hoy.getMonth()+1) + '-' + '01';

    const sql = `SELECT COUNT(*) as CANTIDAD, impartida.DIA_SEMANA
    from impartida join propone join apuntado
    on apuntado.ID_SALA = impartida.ID_SALA and apuntado.DIA_SEMANA = impartida.DIA_SEMANA and apuntado.HORA_INICIO = impartida.HORA_INICIO and propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD
    where impartida.ID_ACTIVIDAD =  ${connection.escape(id)} and propone.ID_CENTRO =  ${connection.escape(id_centro)} and apuntado.FECHA >=  ${connection.escape(primer_dia_mes)}
    GROUP BY impartida.DIA_SEMANA order by impartida.DIA_SEMANA`

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

estadisticaModel.getActividadesPorGenero = (id_centro,callback) =>{
  if(connection){

    var hoy = new Date();
    var primer_dia_mes = hoy.getFullYear() + '-' + (hoy.getMonth()+1) + '-' + '01';

    const sql = ` SELECT propone.ID_ACTIVIDAD,

(SELECT count(*) from apuntado join usuario join impartida
  on apuntado.ID_USUARIO = usuario.ID_USUARIO and apuntado.ID_SALA = impartida.ID_SALA and apuntado.DIA_SEMANA = impartida.DIA_SEMANA and apuntado.HORA_INICIO = impartida.HORA_INICIO
  where propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD and usuario.SEXO = 'Hombre' and apuntado.FECHA >= ${connection.escape(primer_dia_mes)})
  as HOMBRES,

(SELECT count(*) from apuntado join usuario join impartida
  on apuntado.ID_USUARIO = usuario.ID_USUARIO and apuntado.ID_SALA = impartida.ID_SALA and apuntado.DIA_SEMANA = impartida.DIA_SEMANA and apuntado.HORA_INICIO = impartida.HORA_INICIO
  where propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD and usuario.SEXO = 'Mujer' and apuntado.FECHA >= ${connection.escape(primer_dia_mes)})
  as MUJERES,

(SELECT count(*) from apuntado join usuario join impartida
  on apuntado.ID_USUARIO = usuario.ID_USUARIO and apuntado.ID_SALA = impartida.ID_SALA and apuntado.DIA_SEMANA = impartida.DIA_SEMANA and apuntado.HORA_INICIO = impartida.HORA_INICIO
  where propone.ID_ACTIVIDAD = impartida.ID_ACTIVIDAD and usuario.SEXO = 'Otro' and apuntado.FECHA >= ${connection.escape(primer_dia_mes)})
  as OTROS

from propone where propone.ID_CENTRO = ${connection.escape(id_centro)}`

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


//Dado un ID_ACTIVIDAD y un CENTRO sacar para el mes actual la asistencia para cada día de la semana de personas a esa actividad
estadisticaModel.getEstadisticasFinancieras = (id_centro,callback) =>{
  if(connection){

    var hoy = new Date();
    var ano = hoy.getFullYear();

    const sql = `SELECT YEAR(operacion.FECHA) AS ANO ,MONTH(operacion.FECHA) as MES,
(SELECT SUM(operacion.CANTIDAD) from operacion WHERE operacion.CANTIDAD > 0 and YEAR(operacion.FECHA)= ANO AND MONTH(operacion.FECHA)=MES ) as INGRESOS,
(SELECT SUM(operacion.CANTIDAD) from operacion WHERE operacion.CANTIDAD < 0 and YEAR(operacion.FECHA)= ANO AND MONTH(operacion.FECHA)=MES) AS GASTOS
	from refleja join operacion on operacion.ID_OPERACION = refleja.ID_OPERACION where refleja.ID_CENTRO =  ${connection.escape(id_centro)} group by 	YEAR(operacion.FECHA),MONTH(operacion.FECHA) HAVING ANO = ${connection.escape(ano)}`;

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

estadisticaModel.getEstadisticasUsuarios = (id_centro,callback) =>{
  if(connection){

    const sql = `select count(*) AS USUARIOS, usuario.SEXO
      from registrado join usuario on usuario.ID_USUARIO = registrado.ID_USUARIO
      where ID_CENTRO = ${connection.escape(id_centro)} and usuario.ACTIVO = 1 group by usuario.SEXO `;

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

estadisticaModel.getEstadisticasUsuariosEdades = (id_centro,callback) =>{
  if(connection){

    const sql = `SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 0 AND 19
      UNION ALL
      SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 20 AND 25
      UNION ALL
      SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 26 AND 30
      UNION ALL
      SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 31 AND 40
      UNION ALL
      SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 41 AND 50
      UNION ALL
      SELECT COUNT(*) AS RANGOS FROM (SELECT FLOOR (DATEDIFF( now() , usuario.FECHA_NAC) / 365.25 ) AS EDAD from usuario JOIN registrado ON registrado.ID_USUARIO = usuario.ID_USUARIO WHERE registrado.ID_CENTRO = ${connection.escape(id_centro)} AND usuario.ACTIVO = 1) AS EDADES WHERE EDADES.EDAD BETWEEN 51 AND 9999`;

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

estadisticaModel.getEstadisticasRutinas = (id_centro,callback) =>{
  if(connection){

    const sql = `select COUNT(*) as PERSONAS, posee.ID_RUTINA, rutina.NOMBRE
      from posee join usuario join registrado JOIN rutina
      on posee.ID_USUARIO = usuario.ID_USUARIO and registrado.ID_USUARIO = usuario.ID_USUARIO AND rutina.ID_RUTINA = posee.ID_RUTINA
      where registrado.ID_CENTRO = ${connection.escape(id_centro)} and usuario.ACTIVO = 1
      group by posee.ID_RUTINA order by PERSONAS DESC limit 10`;

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};


estadisticaModel.getPista = (id_pista, id_centro,callback) =>{
  if(connection){

    var hoy = new Date();
    var ano = hoy.getFullYear();

    const sql = `select YEAR(reserva.FECHA) AS ANO, MONTH(reserva.FECHA) AS MES, COUNT(*) AS RESERVAS
from existen join pista_deportiva join reserva on existen.ID_PISTA = pista_deportiva.ID_PISTA and existen.ID_PISTA = reserva.ID_PISTA 
WHERE existen.ID_CENTRO = ${connection.escape(id_centro)} AND reserva.ID_PISTA = ${connection.escape(id_pista)}

group by YEAR(reserva.FECHA),MONTH(reserva.FECHA) HAVING ANO = ${connection.escape(ano)}`;

    connection.query(sql,(err, rows)=>{
        if(err){
          console.log("Hay error estadistica");
          throw err;
        }
        else{
          callback(null,rows);
        }
    });
  }
};

module.exports = estadisticaModel;
