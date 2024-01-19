import React, { useEffect, useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  useLazyGetDataDayPaintQuery,
  useLazyGetDataMonthPaintQuery,
} from "../../state/api";

const Indicadores = () => {
  //estado de la fecha
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
    }
    getDataDashborad(dateFormat);
    getDataProductionMonth(dateFormat);
  };

  const columns = [
    {
      field: "est_id",
      headerName: "ID",
      flex: 0.25,
    },
    {
      field: "est_nombre",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "eficienciadiaria",
      headerName: "Eficiencia %",
      flex: 0.5,
    },
    {
      field: "totalhr",
      headerName: "Horas reales",
      flex: 0.5,
    },
    {
      field: "totalmuerto",
      headerName: "Tiempo muerto",
      flex: 0.5,
    },
    {
      field: "totalalertas",
      headerName: "Tiempo alertas",
      flex: 0.5,
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
        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
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
              backgroundColor: theme.palette.primary.light,
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
      </Box>
    </Box>
  );
};

export default Indicadores;
