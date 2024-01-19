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
  useLazyGetDataDayPaintQuery,
  useLazyGetDataMonthPaintQuery,
} from "../../state/api";
import StatBox from "../../components/StatBox";
import ProductionMonthChart from "../../components/productionMonthChart";

const MetalicoMes = () => {
  //estado de la fechca
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading }] = useLazyGetDataDayPaintQuery();
  const [
    getDataProductionMonth,
    { data: dataProductionMonth, isLoading: isLoadingProductionMonth },
  ] = useLazyGetDataMonthPaintQuery();

  const fechingData = async () => {
    let dateFormat = dateToday;
    if (dateToday) {
      const [year, month, day] = dateToday.split("-");
      dateFormat = `${month}/${day}/${year}`;
      console.log(dateFormat);
    }
    getDataDashborad(dateFormat);
    getDataProductionMonth(dateFormat);
  };

  const getAccumulatedData = () => {
    let porcentajeAvance = "0.00%";
    let avanceProduccion = 0;
    let totalProyectadoMes = 0;
    let totalMaquinas = 0;
    let promedioProduccionMes = 0;
    if (!dataProductionMonth)
      return {
        promedioProduccionMes,
        totalMaquinas,
        totalProyectadoMes,
        porcentajeAvance,
      };

    const maxDate = dataProductionMonth.produccionMesPorDia.length;
    for (let i = 0; i < maxDate; i++) {
      avanceProduccion +=
        dataProductionMonth.produccionMesPorDia[i].produccionDia;
      totalProyectadoMes +=
        dataProductionMonth.produccionMesPorDia[i].produccionProyectadaDia;
      totalMaquinas +=
        dataProductionMonth.produccionMesPorDia[i].CantidadMaquinasDia;
    }

    totalProyectadoMes != 0 &&
      (porcentajeAvance =
        ((avanceProduccion / totalProyectadoMes) * 100).toFixed(2) + "%");

    dataProductionMonth.produccionMesPorDia.length != 0 &&
      (promedioProduccionMes = (
        avanceProduccion / dataProductionMonth.produccionMesPorDia.length
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
          gridColumn="span 10"
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
            Unidades producidas en el mes
          </Typography>
          <ProductionMonthChart
            view="sales"
            isDashboard={true}
            data={
              dataProductionMonth ? dataProductionMonth.produccionMesPorDia : []
            }
            isLoading={isLoadingProductionMonth}
          />
        </Box>
        <StatBox
          title="Maquinas activas del mes"
          value={totalMaquinas}
          icon={
            <RadioButtonChecked
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Unidades solicitadas del mes"
          value={totalProyectadoMes}
          icon={
            <TodayIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="% Avance del mes"
          value={porcentajeAvance}
          icon={
            <DataSaverOffIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
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
            Resumen del mes
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
              loading={isLoading || !dataProductionMonth}
              getRowId={(row) => row.dia}
              rows={
                (dataProductionMonth
                  ? dataProductionMonth.produccionMesPorDia
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

export default MetalicoMes;
