import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Update, RadioButtonChecked } from "@mui/icons-material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import TodayIcon from "@mui/icons-material/Today";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "../../components/BreakdownChart";
import {
  useLazyGetDataDayMetallicQuery,
  useLazyGetDataWeekMetallicQuery,
} from "../../state/api";
import StatBox from "../../components/StatBox";
import ProductionMonthChart from "../../components/productionMonthChart";

const MetalicoSemana = () => {
  //estado de la fechca
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading }] =
    useLazyGetDataDayMetallicQuery();
  const [
    getdataWeekMetallic,
    { data: dataWeekMetallic, isLoading: isLoadingWeekMetallic },
  ] = useLazyGetDataWeekMetallicQuery();

  const fechingData = async () => {
    let dateFormat = dateToday;
    if (dateToday) {
      const [year, month, day] = dateToday.split("-");
      dateFormat = `${month}/${day}/${year}`;
      console.log(dateFormat);
    }
    getDataDashborad(dateFormat);
    getdataWeekMetallic(dateFormat);
  };

  const getAccumulatedData = () => {
    let porcentajeAvance = "0.00%";
    let avanceProduccion = 0;
    let totalProyectadoMes = 0;
    let totalMaquinas = 0;
    let promedioProduccionMes = 0;
    if (!dataWeekMetallic)
      return {
        promedioProduccionMes,
        totalMaquinas,
        totalProyectadoMes,
        porcentajeAvance,
      };

    const maxDate = dataWeekMetallic.produccionSemanaPorDia.length;
    for (let i = 0; i < maxDate; i++) {
      avanceProduccion +=
        dataWeekMetallic.produccionSemanaPorDia[i].produccionDia;
      totalProyectadoMes +=
        dataWeekMetallic.produccionSemanaPorDia[i].produccionProyectadaDia;
      totalMaquinas +=
        dataWeekMetallic.produccionSemanaPorDia[i].CantidadMaquinasDia;
    }

    totalProyectadoMes != 0 &&
      (porcentajeAvance =
        ((avanceProduccion / totalProyectadoMes) * 100).toFixed(2) + "%");

    dataWeekMetallic.produccionSemanaPorDia.length != 0 &&
      (promedioProduccionMes = (
        avanceProduccion / dataWeekMetallic.produccionSemanaPorDia.length
      ).toFixed(0));

    return {
      promedioProduccionMes,
      totalMaquinas,
      totalProyectadoMes,
      porcentajeAvance,
    };
  };
  const {
    promedioProduccionMes,
    totalMaquinas,
    totalProyectadoMes,
    porcentajeAvance,
  } = getAccumulatedData();

  const getTopMaquinas = () => {
    let topMaquinas = [];
    if (data) {
      const arrayMaquinas = [...data.sumaryByStation];
      arrayMaquinas.sort((a, b) => {
        return Number(b.cantrealtotal) - Number(a.cantrealtotal);
      });
      topMaquinas = arrayMaquinas.slice(0, 5);
    }
    return topMaquinas;
  };

  const columns = [
    {
      field: "dia",
      headerName: "DIA",
      flex: 0.5,
    },
    {
      field: "opest_fecha",
      headerName: "FECHA",
      flex: 1,
    },
    {
      field: "CantidadMaquinasDia",
      headerName: "MAQUINAS ACTIVAS",
      flex: 1,
    },
    {
      field: "produccionDia",
      headerName: "PRODUCIDO",
      flex: 1,
    },
    {
      field: "produccionProyectadaDia",
      headerName: "PROYECTADO",
      flex: 1,
    },
  ];

  useEffect(() => {
    fechingData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateToday]);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Bienvenido a su dashboard" />
        <Box>
          <input
            type="Date"
            onChange={(e) => setDateToday(e.target.value)}
            value={dateToday}
          />
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="200px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Promedio unidades por dia"
          value={promedioProduccionMes}
          icon={
            <Update
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 7"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center" }}
            color={theme.palette.secondary[100]}
          >
            Unidades producidas en la semana
          </Typography>
          <ProductionMonthChart
            view="semana"
            data={
              dataWeekMetallic ? dataWeekMetallic.produccionSemanaPorDia : []
            }
            isLoading={isLoadingWeekMetallic}
          />
        </Box>
        <StatBox
          title="Maquinas activas de la semana"
          value={totalMaquinas}
          icon={
            <RadioButtonChecked
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 3"
          gridRow="span 6"
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          gap="10px"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.background.alt}
          borderRadius="0.55rem"
        >
          <Typography
            variant="h3"
            sx={{ color: theme.palette.secondary[100], textAlign: "center" }}
          >
            Top 5 maquinas
          </Typography>

          <Typography
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200], textAlign: "center" }}
          >
            Mayor produccion.
          </Typography>
          <Box width="100%" mt="20px">
            {getTopMaquinas().map((maquina, index) => (
              <BreakdownChart maquina={maquina} key={index} index={index} />
            ))}
          </Box>
        </Box>
        <StatBox
          title="Unidades solicitadas de la semana"
          value={totalProyectadoMes}
          icon={
            <TodayIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="% Avance de la semana"
          value={porcentajeAvance}
          icon={
            <DataSaverOffIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* ROW 2 */}
        <Box
          gridColumn="span 9"
          gridRow="span 3"
          sx={{ backgroundColor: theme.palette.background.alt, p: 2 }}
        >
          <Typography
            variant="h3"
            p="20px"
            sx={{
              color: theme.palette.secondary[100],
              textAlign: "center",
            }}
          >
            Resumen de la semana
          </Typography>
          <Box
            height="500px"
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
              },

              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `${theme.palette.secondary[200]} !important`,
              },
            }}
          >
            <DataGrid
              loading={isLoading || !dataWeekMetallic}
              getRowId={(row) => row.dia}
              rows={
                (dataWeekMetallic
                  ? dataWeekMetallic.produccionSemanaPorDia
                  : []) || []
              }
              columns={columns}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MetalicoSemana;
