import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

import {
  useLazyGetDataDayPaintQuery,
  useLazyGetDataMonthPaintQuery,
} from "../../state/api";
import PerformanceChart from "../../components/performanceChart";
import PercentageUnitsProducedChart from "../../components/percentageUnitsProducedChart";
import BreakdownChartEfficiency from "../../components/BreakdownChartEfficiency";

const MetalicoRendimiento = () => {
  //estado de la fechca
  const [dateToday, setDateToday] = useState("");
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const [getDataDashborad, { data, isLoading }] = useLazyGetDataDayPaintQuery();

  const fechingData = async () => {
    let dateFormat = dateToday;
    if (dateToday) {
      const [year, month, day] = dateToday.split("-");
      dateFormat = `${month}/${day}/${year}`;
      console.log(dateFormat);
    }
    getDataDashborad(dateFormat);
  };

  const getTopMaquinas = () => {
    let topMaquinas = [];
    if (data) {
      const arrayMaquinas = [...data.sumaryByStation];
      arrayMaquinas.sort((a, b) => {
        return Number(b.eficienciadiaria) - Number(a.eficienciadiaria);
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
        gridAutoRows="250px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
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
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
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

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
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

export default MetalicoRendimiento;
