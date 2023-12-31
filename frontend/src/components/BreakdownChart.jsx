import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";

const BreakdownChart = ({ maquina = {}, index }) => {
  console.log(maquina);
  const theme = useTheme();
  const formattedData = [
    {
      id: "Producido",
      label: "Producido",
      value: (
        (Number(maquina.cantrealtotal) /
          Number(maquina.cantidadProyectadaTotalEstacion)) *
        100
      ).toFixed(0),
      color: theme.palette.secondary[500],
    },
    {
      id: "Faltante",
      label: "Faltante",
      value: (
        (1 -
          Number(maquina.cantrealtotal) /
            Number(maquina.cantidadProyectadaTotalEstacion)) *
        100
      ).toFixed(0),
      color: theme.palette.secondary[300],
    },
  ];

  return (
    <Box mt="20px">
      <Typography
        variant="h6"
        sx={{ textAlign: "center" }}
        color={theme.palette.secondary[100]}
        fontWeight="bold"
      >{`${index + 1}. ${maquina.est_nombre}`}</Typography>
      <Box
        display="flex"
        width="100%"
        height="180px"
        backgroundColor={theme.palette.background.alt}
        position="relative"
      >
        <ResponsivePie
          data={formattedData}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: theme.palette.secondary[200],
                },
              },
              legend: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              ticks: {
                line: {
                  stroke: theme.palette.secondary[200],
                  strokeWidth: 1,
                },
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
            },
            legends: {
              text: {
                fill: theme.palette.secondary[200],
              },
            },
            tooltip: {
              container: {
                color: theme.palette.primary.main,
              },
            },
          }}
          valueFormat={(v) => `${v}%`}
          colors={{ datum: "data.color" }}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          sortByValue={false}
          innerRadius={0.75}
          activeOuterRadiusOffset={2}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          enableArcLinkLabels={false}
          arcLinkLabelsTextColor={theme.palette.secondary[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
        />
        <Box
          position="absolute"
          color={theme.palette.secondary[300]}
          textAlign="center"
          pointerEvents="none"
          sx={{
            top: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h7">{`${maquina.cantrealtotal}/${maquina.cantidadProyectadaTotalEstacion}`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BreakdownChart;
