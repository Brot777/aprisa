import { getConnection } from "../sql/conectar.js";
import sql from "mssql";
import moment from "moment-timezone";

export const getDataDay = async (req, res) => {
  const fecha =
    req.query.fecha || moment().tz("America/Guatemala").format("MM/DD/YYYY");
  console.log({ fecha });
  try {
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

    let totalalertas = 0;

    //busca horarios de la estacion
    const fechaenuso = fecha;

    // Traer data de una sola estacion
    const pool = await getConnection();
    const dataEstacion = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        `SELECT * FROM opestxestacion WHERE  opest_fecha=@fecha and est_id=36 order by prioridad, opest_id ASC`
      );
    const arrayDataEstacion = dataEstacion.recordset;
    console.log(arrayDataEstacion.length);
    if (arrayDataEstacion.length > 0) totalMaquinasActivas = 1;

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

    //odenando por fecha de inicio
    arrayDataEstacion.sort((a, b) => {
      const dateA = new Date(a.opest_hii);
      const dateB = new Date(b.opest_hii);
      return dateA.getTime() - dateB.getTime();
    });
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
      const date_opest_hii = new Date(opest_hii);
      const date_finalactual = new Date(finactual);
      let muerto = 0;
      if (date_finalactual.getTime() > date_opest_hii.getTime()) {
        finactual = opest_hff;
      } else if (opest_hii != "") {
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
        const diaActual = Number(fecha.split("/")[1]);
        const diaInicio = Number(opest_hii.split(" ")[0].split("-")[2]);
        const diaFinal = Number(opest_hff.split(" ")[0].split("-")[2]);

        let [horaInicio, minutosInicio, segundosInicio] = opest_hii
          .split(" ")[1]
          .split(":");
        let [horaFinal, minutosFinal, segundosFinal] = opest_hff
          .split(" ")[1]
          .split(":");

        let horaInicioEntero = Number(horaInicio);
        let horaFinalEntero = Number(horaFinal);

        let segundosTotalInicio =
          Number(minutosInicio) * 60 + Number(segundosInicio);
        let HorasReajusteInicio = segundosTotalInicio / 3600;
        let segundosTotalFinal =
          Number(minutosFinal) * 60 + Number(segundosFinal);
        let HorasReajusteFinal = segundosTotalFinal / 3600;

        let velocidadProduccion = 0;
        if (horasr) {
          //coversion horasr (segundo) a horas por eso la multiplicacion de 3600
          velocidadProduccion = (Number(opest_cantr) * 3600) / horasr;
        }

        //validando que sean hora del dia actual y quitando las que no
        if (diaActual > diaInicio) {
          horaInicioEntero = 0;
          HorasReajusteInicio = 0; //cero segundos
        }
        if (diaActual < diaInicio) {
          horaInicioEntero = 0;
          HorasReajusteInicio = 0; //cero segundos
        }

        if (diaActual < diaFinal) {
          if (diaFinal == diaActual + 1) {
            horaFinalEntero = 23;
            HorasReajusteFinal = 1; //un segundo menos que la hora
          } else {
            horaFinalEntero = 0;
            HorasReajusteFinal = 0; //cero segundos
          }
        }
        if (diaActual > diaFinal) {
          horaFinalEntero = 0;
          HorasReajusteFinal = 0; //cero segundos
        }

        //añadiendo velocidades por horas trabajadas al array de tendencia

        for (let i = horaInicioEntero; i < horaFinalEntero; i++) {
          tendenciaProduccionPorHora[i] += velocidadProduccion;
        }

        //ajuste produccion real primera y ultima hora
        tendenciaProduccionPorHora[horaFinalEntero] +=
          velocidadProduccion * HorasReajusteFinal;
        tendenciaProduccionPorHora[horaInicioEntero] -=
          velocidadProduccion * HorasReajusteInicio;
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

    porcetajeProduccionPorEstacion = porcetajeProduccionPorEstacion.toFixed(2);

    //
    /* eficienciadiaria = eficienciadiaria * cantrealtotal;
      eficienciaplantasuma = eficienciaplantasuma + eficienciadiaria; */
    //informacion por estacion

    // acumulados

    eficienciaplanta = eficienciaplantasuma / cantrealdía;

    tendenciaProduccionPorHora = tendenciaProduccionPorHora.map((produccion) =>
      produccion.toFixed(2)
    );
    const sumary = {
      est_id: 36,
      est_nombre: "Pintura",
      eficienciadiaria,
      totalhp,
      totalhr,
      totalalertas,
      totalmuerto,
      porcetajeProduccionPorEstacion,
      cantrealtotal,
      cantidadProyectadaTotalEstacion,
    };

    return res.status(200).json({
      totalMaquinasActivas,
      cantidadProducidaDia: cantrealdía,
      cantidadProyectadaDia,
      tendenciaProduccionPorHora,
      sumaryByStation: [sumary],
    });
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).send("Error en la base de datos");
  }
};

export const getDataMonth = async (req, res) => {
  const fecha =
    req.query.fecha || moment().tz("America/Guatemala").format("MM/DD/YYYY");
  console.log({ fecha });
  const obtenerCantidadDiasMes = () => {
    // Obtén la fecha en formato ISO
    const fechaActual = new Date(fecha);

    // Obtén el mes actual
    let mesActual = fechaActual.getMonth();

    // Incrementa el mes en 1 para obtener el siguiente mes
    mesActual++;

    // Configura la fecha al primer día del siguiente mes
    fechaActual.setMonth(mesActual, 1);

    // Retrocede un día para obtener el último día del mes actual
    fechaActual.setDate(fechaActual.getDate() - 1);

    // Obtiene el día del mes y retornar
    return fechaActual.getDate();
  };
  try {
    const pool = await getConnection();
    const dataProduccion = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        `SELECT DAY(opest_fecha) as dia,opest_fecha, COUNT(DISTINCT est_id) as CantidadMaquinasDia, SUM(CONVERT(INT, opest_cantr)) as produccionDia,SUM(CONVERT(INT, opest_cantp)) as produccionProyectadaDia FROM opestxestacion WHERE MONTH(opest_fecha)=MONTH(@fecha) AND YEAR(opest_fecha)=YEAR(@fecha) AND est_id = 36 GROUP BY opest_fecha`
      );

    const diasDelMes = obtenerCantidadDiasMes();
    const produccionPorDefecto = [];
    for (let i = 0; i < diasDelMes; i++) {
      const [mes, dia, año] = fecha.split("/");
      produccionPorDefecto.push({
        dia: i + 1,
        opest_fecha: `${mes}/${i + 1 > 9 ? i + 1 : "0" + (i + 1)}/${año}`,
        CantidadMaquinasDia: 0,
        produccionDia: 0,
        produccionProyectadaDia: 0,
      });
    }
    dataProduccion.recordset.forEach((dataDia) => {
      const indicePorReemplazar = dataDia.dia - 1;
      produccionPorDefecto[indicePorReemplazar] = dataDia;
    });
    const produccionMesPorDia = produccionPorDefecto.map((dataDia) => {
      return dataDia.produccionDia ? dataDia : { ...dataDia, produccionDia: 0 };
    });

    res.json({
      produccionMesPorDia,
    });
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).send("Error en la base de datos");
  }
};

export const getDataWeek = async (req, res) => {
  const fecha =
    req.query.fecha || moment().tz("America/Guatemala").format("MM/DD/YYYY");
  console.log({ fecha });
  const obtenerFechasDeLaSemana = () => {
    const today = new Date(fecha);
    // Obtener el día de la semana
    const currentDayOfWeek = today.getDay();

    // Crear una nueva fecha restando los días que han pasado desde el domingo
    const previusSunday = new Date(
      today.getTime() - currentDayOfWeek * 24 * 60 * 60 * 1000
    );
    const fechasSemana = [];
    for (let i = 0; i < 7; i++) {
      //obtener el dia de la fecha por cada dia de la semana
      const diaDate = new Date(
        previusSunday.getTime() + i * 24 * 60 * 60 * 1000
      );
      fechasSemana.push(diaDate.getDate());
    }
    return fechasSemana;
  };

  try {
    const pool = await getConnection();
    const dataProduccion = await pool
      .request()
      .input("fecha", sql.NVarChar, fecha)
      .query(
        `SELECT opest_fecha,DATEPART(dw,opest_fecha) as diaSemana, COUNT(DISTINCT est_id) as CantidadMaquinasDia, SUM(CONVERT(INT, opest_cantr)) as produccionDia,SUM(CONVERT(INT, opest_cantp)) as produccionProyectadaDia FROM opestxestacion WHERE DATEPART(WEEK, opest_fecha)=DATEPART(WEEK, @fecha) AND YEAR(opest_fecha)=YEAR(@fecha) AND est_id = 36 GROUP BY opest_fecha`
      );
    const fechasDeLaSemana = obtenerFechasDeLaSemana();
    const produccionPorDefecto = [];
    for (let i = 0; i < 7; i++) {
      const [mes, dia, año] = fecha.split("/");
      produccionPorDefecto.push({
        opest_fecha: `${mes}/${
          fechasDeLaSemana[1] > 9
            ? fechasDeLaSemana[1]
            : "0" + (fechasDeLaSemana[1] + 1)
        }/${año}`,
        diaSemana: i + 1,
        CantidadMaquinasDia: 0,
        produccionDia: 0,
        produccionProyectadaDia: 0,
      });
    }
    dataProduccion.recordset.forEach((dataDia) => {
      const indicePorReemplazar = dataDia.diaSemana - 1;
      produccionPorDefecto[indicePorReemplazar] = dataDia;
    });

    const produccionSemanaPorDia = produccionPorDefecto.map(
      (dataDia, index) => {
        const diasDeLaSemana = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];
        dataDia.dia = diasDeLaSemana[index];
        return dataDia.produccionDia
          ? dataDia
          : { ...dataDia, produccionDia: 0 };
      }
    );

    res.json({
      produccionSemanaPorDia,
    });
  } catch (error) {
    console.error("Error en la consulta SQL:", error);
    res.status(500).send("Error en la base de datos");
  }
};
