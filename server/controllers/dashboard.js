import { getConnection } from "../sql/conectar.js";
import sql from "mssql";
import { convertToShortDate } from "../utils/convetDate.js";
import moment from "moment-timezone";

export const getBasicData = async (req, res) => {
  const fecha =
    req.query.fecha || moment().tz("America/Guatemala").format("MM/DD/YYYY");
  console.log({ fecha });
  try {
    const pool = await getConnection();
    const data = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        "SELECT * FROM rts WHERE opest_fecha= @fecha order by dep_id, est_nombre"
      );

    const arrayDataToday = data.recordset;

    /* VARIABLES GLOBALES */
    let eficienciaplanta = 0;
    let eficienciaplantasuma = 0;
    let cantrealdía = 0;
    let cantidadProyectadaDia = 0;
    let alertas = 0;
    let totalMaquinasActivas = 0;
    let tendenciaProduccionPorHora = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]; //tendencia 24 horas

    const arrayPromisesStations = arrayDataToday.map(async (estacion) => {
      /* VARIABLES POR ESTACION */
      const { est_id, est_nombre } = estacion;
      let totalalertas = 0;
      let activas = 0;
      let enespera = 0;

      //busca horarios de la estacion
      const fechaenuso = fecha;

      // Traer data de una sola estacion
      const pool = await getConnection();
      const dataEstacion = await pool
        .request()
        .input("fecha", sql.NVarChar, fecha)
        .query(
          `SELECT * FROM opestxestacion WHERE  opest_fecha=@fecha and est_id=${est_id} order by prioridad, opest_id ASC`
        );
      const arrayDataEstacion = dataEstacion.recordset;

      let alertasEstacion = 0;
      let alertamsg = "";

      let thoras = 0;
      //variable para sumar eficiencia del dia
      let eficienciadeldia = 0;
      let eficienciasuma = 0;

      let totalhp = 0;
      let totalhr = 0;

      //nuevas variables
      let totalmuerto = 0;
      let cantrealtotal = 0;
      let cantidadProyectadaTotalEstacion = 0;
      let eficienciat2 = 0;

      let finactual;

      console.log(est_nombre);
      arrayDataEstacion.forEach((maquina) => {
        /* INICIAL DATA MAQUINA */
        const {
          opest_hii,
          opest_hff,
          horasr,
          opest_cantp,
          opest_cantr,
          setting,
          talerta,
          alerta,
          estado_id,
          speed,
          med_factor,
          prc_tesperado,
        } = maquina;
        alertasEstacion = alertasEstacion + alerta;

        /* console.log(maquina); */
        /*   console.log({ opest_hff, opest_hii }); */

        //suma cantidad proyectada del dia y por estacion
        cantidadProyectadaTotalEstacion += Number(opest_cantp);
        cantidadProyectadaDia = cantidadProyectadaDia + Number(opest_cantp);

        //suma acumulada cantidad real del dia y por estacion
        cantrealtotal = cantrealtotal + Number(opest_cantr);
        cantrealdía = cantrealdía + Number(opest_cantr);

        //sumatoria de opest activas para icono de timeout
        if (estado_id == 1) enespera = enespera + 1;
        if (estado_id == 2) activas = activas + 1;

        //calcula diferencia entre programado y producido
        let cant_diferencia = 0;
        if (estado_id == 3) {
          cant_diferencia = Number(opest_cantr) - Number(opest_cantp);
        }

        //minutos a decimales
        let horasreales = horasr / 3600;
        let tiempoTotalAlertaMaquinaHoras = Number(talerta) / 3600;
        totalalertas = totalalertas + tiempoTotalAlertaMaquinaHoras;

        if (estado_id == 3) {
          horasreales = horasreales - tiempoTotalAlertaMaquinaHoras;
        }

        let horasereal = 0;
        let horase = 0;
        if (med_factor > 1) {
          horase = Number(opest_cantp) / (med_factor / prc_tesperado);
          horasereal = horase;
          horase = horase + setting / 60;
        }
        if (med_factor == 1) {
          horase = Number(opest_cantp) / prc_tesperado;
          horasereal = horase;
          horase = horase + setting / 60;
        }

        //si la diferencia producida es menor que cero, hicieron menos de lo programado

        //calcular tiempo real por unidad =tiemposaldo

        let tiemposaldo = horasereal / Number(opest_cantp); //tiempo real por unidad
        if (Number(opest_cantp) == 0) {
          tiemposaldo = 0;
        }
        tiemposaldo = tiemposaldo * cant_diferencia;

        //resta el tiempo que hubieran tardado en hacer la diferencia al tiempo esperado

        horase = horase + tiemposaldo;
        horase = (horase / speed) * 100;

        //calculo de tiempo muerto (TIMEOUT)
        if (!finactual) {
          finactual = opest_hii;
        }

        let muerto = 0;
        if (opest_hii != "") {
          const date_opest_hii = new Date(opest_hii);
          const date_finalactual = new Date(finactual);
          let muertoMilisegundos =
            date_opest_hii.getTime() - date_finalactual.getTime();
          muerto = muertoMilisegundos / (3600 * 1000);
        } else {
          let timeoutbeyond = " TO";
        }
        if (muerto > 7.5 || muerto < 0.0833) {
          muerto = 0;
        } //muerto 7.5hrs turno
        totalmuerto = totalmuerto + muerto;
        finactual = opest_hff;

        // fin calculo tiempo muerto

        //calculos eficiencia
        thoras = thoras + horase;

        let var1 = 0;

        if (horasreales > 0) {
          var1 = horase / horasreales;
        } else {
          var1 = 0;
        }
        let eficienciat = var1 * 100;

        totalhp = totalhp + horase;
        totalhr = totalhr + horasreales;

        eficienciat2 = eficienciat * Number(opest_cantr);

        eficienciasuma = eficienciasuma + eficienciat2;

        if (Number(opest_cantr) == 0) {
          eficienciat = 0;
        }

        //calculo tendencia
        if (opest_hii && opest_hff) {
          const horaInicioEntero = Number(
            opest_hii.split(" ")[1].split(":")[0]
          );
          const horaFinalEntero = Number(opest_hff.split(" ")[1].split(":")[0]);
          const date_opest_hii = new Date(opest_hii);
          const date_opest_hff = new Date(opest_hff);
          const horasTrabajadasMilisegundos =
            date_opest_hff.getTime() - date_opest_hii.getTime();
          const horasTrabajadas = horasTrabajadasMilisegundos / (3600 * 1000);
          const horasTrabajadasEnteras = Math.floor(horasTrabajadas);
          //velocidad de produccion
          let velocidadProduccion = 0;
          if (horasTrabajadas != 0) {
            velocidadProduccion = Number(opest_cantr) / horasTrabajadas;
          }

          //añadiendo velocidades por horas trabajadas al array de tendencia

          for (let i = horaInicioEntero; i < horaFinalEntero; i++) {
            tendenciaProduccionPorHora[i] += velocidadProduccion;
          }
          tendenciaProduccionPorHora[horaFinalEntero] +=
            velocidadProduccion * (horasTrabajadas - horasTrabajadasEnteras);
        }
        //fin calculo tendencia
      });

      let eficienciadiaria = 0;
      if (cantrealtotal == 0) {
        eficienciadiaria = 0;
      } else {
        eficienciadiaria = eficienciasuma / cantrealtotal;
      }

      //datos de una estacion

      if (alertas > 0) {
        alertamsg = "Assets/rtsalert.png";
      } else {
        alertamsg = "Assets/meta0.png";
      }

      //texto ordenes activas
      let activastxt = "";
      if (activas == 0 && enespera == 0)
        activastxt = "Assets/rtsstatusicon3.png";

      if (activas > 0) activastxt = "Assets/rtsstatusicon2.png";
      if (activas == 0 && enespera > 0)
        activastxt = "Assets/rtsstatusicon1.png";

      if (est_id == 38 || est_id == 73 || est_id == 48) eficienciadiaria = 100;
      //vuelve 100 la productividad de descarga y empaque

      /* DANDO FORMATO A LOS RESULTADOS */
      eficienciadiaria = eficienciadiaria.toFixed(2);
      totalhr = totalhr.toFixed(2);
      totalalertas = totalalertas.toFixed(2);
      totalmuerto = totalmuerto.toFixed(2);

      let porcetajeProduccionPorEstacion =
        Number(cantrealtotal) / Number(cantidadProyectadaTotalEstacion);
      if (cantidadProyectadaTotalEstacion == 0)
        porcetajeProduccionPorEstacion = 0;

      // convirtiendo a porcentaje
      porcetajeProduccionPorEstacion = porcetajeProduccionPorEstacion * 100;

      porcetajeProduccionPorEstacion =
        porcetajeProduccionPorEstacion.toFixed(2);

      //
      /* eficienciadiaria = eficienciadiaria * cantrealtotal;
      eficienciaplantasuma = eficienciaplantasuma + eficienciadiaria; */
      //informacion por estacion

      // acumulados
      totalMaquinasActivas = totalMaquinasActivas + activas;

      return {
        est_id,
        est_nombre: est_nombre.trim(),
        eficienciadiaria,
        totalhp,
        totalhr,
        totalalertas,
        totalmuerto,
        porcetajeProduccionPorEstacion,
      };
    });
    const sumaryByStation = await Promise.all(arrayPromisesStations);
    /*  console.log(sumaryByStation); */

    eficienciaplanta = eficienciaplantasuma / cantrealdía;

    tendenciaProduccionPorHora = tendenciaProduccionPorHora.map((produccion) =>
      produccion.toFixed(2)
    );

    return res.status(200).json({
      totalMaquinasActivas,
      cantidadProducidaDia: cantrealdía,
      cantidadProyectadaDia,
      tendenciaProduccionPorHora,
      sumaryByStation,
    });
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).send("Error en la base de datos");
  }
};

export const getProductionMonth = async (req, res) => {
  const fecha =
    req.query.fecha || moment().tz("America/Guatemala").format("MM/DD/YYYY");
  console.log({ fecha });
  try {
    const pool = await getConnection();
    const dataProduccion = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        `SELECT DAY(opest_fecha) as dia,opest_fecha, MONTH(opest_fecha) as month, SUM(CONVERT(INT, opest_cantr)) as produccionDia FROM opestxestacion WHERE MONTH(opest_fecha)=MONTH(@fecha) AND YEAR(opest_fecha)=YEAR(@fecha) GROUP BY opest_fecha`
      );
    const dataProyectado = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        `SELECT SUM(CONVERT(INT, opest_cantp)) as produccionProyectadaMes FROM opestxestacion WHERE MONTH(opest_fecha)=MONTH(@fecha) AND YEAR(opest_fecha)=YEAR(@fecha)`
      );
    const produccionMesPorDia = dataProduccion.recordset.map((dataDia) => {
      return dataDia.produccionDia ? dataDia : { ...dataDia, produccionDia: 0 };
    });
    const { produccionProyectadaMes } = dataProyectado.recordsets[0][0];

    res.json({ produccionMesPorDia, produccionProyectadaMes });
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).send("Error en la base de datos");
  }
};

const vistaTablas = (req, res) => {
  res.render("tables");
};

const vistaNotificaciones = (req, res) => {
  res.render("notificaciones");
};

const vistaMetalico = (req, res) => {
  res.render("metalico");
};
