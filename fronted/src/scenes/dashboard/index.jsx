import React, { useEffect, useState } from "react";
import FlexBetween from "./../../components/FlexBetween";
import Header from "./../../components/Header";
import { Update, RadioButtonChecked } from "@mui/icons-material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import TodayIcon from "@mui/icons-material/Today";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "./../../components/BreakdownChart";
import OverviewChart from "./../../components/OverviewChart";
import { useLazyGetBasicDataQuery } from "./../../state/api";
import StatBox from "./../../components/StatBox";

const Dashboard = () => {
  //estado de la fechca
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading }] = useLazyGetBasicDataQuery();
  const fechingData = async () => {
    let dateFormat = dateToday;
    if (dateToday) {
      const [year, month, day] = dateToday.split("-");
      dateFormat = `${month}/${day}/${year}`;
      console.log(dateFormat);
    }
    getDataDashborad(dateFormat);
  };

  let porcentajeAvanceDia = "0%";
  if (data && data?.cantidadProyectadaDia != 0) {
    porcentajeAvanceDia =
      ((data.cantidadProducidaDia / data.cantidadProyectadaDia) * 100).toFixed(
        2
      ) + "%";
  }

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
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Unidades producidas por hora"
          value={data ? data.cantidadProyectadaDia : "0"}
          icon={
            <Update
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 6"
          gridRow="span 1"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart
            view="sales"
            isDashboard={true}
            data={data ? data.tendenciaProduccionPorHora : []}
            isLoading={isLoading}
          />
        </Box>
        <StatBox
          title="Maquinas activas"
          value={
            data
              ? data.totalMaquinasActivas || data.sumaryByStation.length
              : "0"
          }
          icon={
            <RadioButtonChecked
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 2"
          gridRow="span 5"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <h1>Top Maquinas</h1>
        </Box>
        <StatBox
          title="Unidades solicitadas del dia"
          value={data ? data.cantidadProducidaDia : "0"}
          icon={
            <TodayIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart
            view="sales"
            isDashboard={true}
            data={data ? data.sumaryByStation : []}
            isLoading={isLoading}
          />
        </Box>
        <StatBox
          title="% de Avance Unidades de hoy versus proyectado"
          value={porcentajeAvanceDia}
          icon={
            <DataSaverOffIcon
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
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
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
