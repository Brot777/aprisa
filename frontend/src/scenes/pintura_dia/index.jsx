import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Update, RadioButtonChecked } from "@mui/icons-material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import TodayIcon from "@mui/icons-material/Today";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "../../components/BreakdownChart";
import TrendChart from "../../components/trendChart";
import { useLazyGetDataDayPaintQuery } from "../../state/api";
import StatBox from "../../components/StatBox";

const MetalicoDia = () => {
  //estado de la fechca
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading, isFetching }] =
    useLazyGetDataDayPaintQuery();

  const fechingData = async () => {
    let dateFormat = dateToday;
    if (dateToday) {
      const [year, month, day] = dateToday.split("-");
      dateFormat = `${month}/${day}/${year}`;
      console.log(dateFormat);
    }
    getDataDashborad(dateFormat);
  };

  const getPercentageToDate = () => {
    let porcentajeAvanceDia = "0.00%";
    if (data && data?.cantidadProyectadaDia != 0) {
      porcentajeAvanceDia =
        (
          (data?.cantidadProducidaDia / data?.cantidadProyectadaDia) *
          100
        ).toFixed(2) + "%";
    }
    return porcentajeAvanceDia;
  };

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
      flex: 0.5,
    },
    {
      field: "est_nombre",
      headerName: "NOMBRE",
      flex: 2,
    },
    {
      field: "eficienciadiaria",
      headerName: "EFICIENCIA",
      flex: 1,
    },
    {
      field: "cantidadProyectadaTotalEstacion",
      headerName: "SOLICITADAS",
      flex: 1,
    },
    {
      field: "cantrealtotal",
      headerName: "PRODUCIDAS",
      flex: 1,
    },
    {
      field: "porcetajeProduccionPorEstacion",
      headerName: "% PRODUCIDO",
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
          <FormControl sx={{ mt: "1rem" }}>
            <input
              type="Date"
              onChange={(e) => setDateToday(e.target.value)}
              value={dateToday}
            />
          </FormControl>
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
          title="Unidades producidas por hora"
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
            Tendencia de unidades por hora
          </Typography>
          <TrendChart
            view="sales"
            isDashboard={true}
            data={data ? data.tendenciaProduccionPorHora : []}
            isLoading={isLoading}
            isFeaching={isFetching}
          />
        </Box>
        <StatBox
          title="Maquinas activas del dia"
          value={data ? data.totalMaquinasActivas : "0"}
          icon={
            <RadioButtonChecked
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="Unidades solicitadas del dia"
          value={data ? data.cantidadProyectadaDia : "0"}
          icon={
            <TodayIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        <StatBox
          title="% Avance del dia"
          value={getPercentageToDate()}
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
            Resumen del dia
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
              loading={isLoading || !data}
              getRowId={(row) => row.est_id}
              rows={(data ? data.sumaryByStation : []) || []}
              columns={columns}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MetalicoDia;
