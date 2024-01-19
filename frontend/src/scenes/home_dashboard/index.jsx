import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Update, RadioButtonChecked } from "@mui/icons-material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import TodayIcon from "@mui/icons-material/Today";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "../../components/BreakdownChart";
import TrendChart from "../../components/trendChart";
import {
  useLazyGetDataDayMetallicQuery,
  useLazyGetDataMonthMetallicQuery,
} from "../../state/api";
import StatBox from "../../components/StatBox";
import ProductionMonthChart from "../../components/productionMonthChart";
import PerformanceChart from "../../components/performanceChart";
import PercentageUnitsProducedChart from "../../components/percentageUnitsProducedChart";

const HomeDashboard = () => {
  //estado de la fecha
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading }] =
    useLazyGetDataDayMetallicQuery();
  const [
    getDataProductionMonth,
    { data: dataProductionMonth, isLoading: isLoadingProductionMonth },
  ] = useLazyGetDataMonthMetallicQuery();

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
  const { totalProyectadoMes, porcentajeAvance } = getAccumulatedData();

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
      field: "est_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "est_nombre",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "eficienciadiaria",
      headerName: "Eficiencia",
      flex: 1,
    },
    {
      field: "totalhr",
      headerName: "Total Horas",
      flex: 0.5,
    },
    {
      field: "totalalertas",
      headerName: "Alertas",
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
          title="Piezas producidas por dia"
          value={
            data ? (Number(data.cantidadProducidaDia) / 24).toFixed(0) : "0"
          }
          icon={
            <Update
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 7"
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center" }}
            color={theme.palette.secondary[400]}
          >
            Produccion por hora
          </Typography>
          <TrendChart
            view="sales"
            isDashboard={true}
            data={data ? data.tendenciaProduccionPorHora : []}
            isLoading={isLoading}
          />
        </Box>
        <StatBox
          title="Maquinas activas"
          value={data ? data.sumaryByStation.length : "0"}
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
          title="Piezas a producir en el mes"
          value={totalProyectadoMes}
          icon={
            <TodayIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 7"
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center" }}
            color={theme.palette.secondary[400]}
          >
            Piezas producidas en el mes
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
          title="Avance del mes"
          value={porcentajeAvance}
          icon={
            <DataSaverOffIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        {/* <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row.est_id}
            rows={(data ? data.sumaryByStation : []) || []}
            columns={columns}
          />
        </Box> */}
        <Box
          gridColumn="span 9"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center" }}
            color={theme.palette.secondary[400]}
          >
            Desempeño Hrs por estación
          </Typography>
          <PerformanceChart
            view="sales"
            isDashboard={true}
            data={data ? data.sumaryByStation : []}
            isLoading={isLoading}
          />
        </Box>
        <Box
          gridColumn="span 9"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <Typography
            variant="h6"
            sx={{ textAlign: "center" }}
            color={theme.palette.secondary[400]}
          >
            Porcentaje de Piezas producidas por estación
          </Typography>
          <PercentageUnitsProducedChart
            view="sales"
            isDashboard={true}
            data={data ? data.sumaryByStation : []}
            isLoading={isLoading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomeDashboard;
