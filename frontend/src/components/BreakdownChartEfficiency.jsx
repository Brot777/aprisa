import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography, useTheme } from "@mui/material";

const BreakdownChartEfficiency = ({ maquina = {}, index }) => {
  console.log(maquina.eficienciadiaria);
  const theme = useTheme();
  const formattedData = [
    {
      id: "Eficiencia",
      label: "Eficiencia",
      value: Number(maquina.eficienciadiaria).toFixed(0),
      color: theme.palette.secondary[500],
    },
    {
      id: "Faltante",
      label: "Faltante",
      value: (100 - Number(maquina.eficienciadiaria)).toFixed(0),
      color: theme.palette.secondary[300],
    },
  ];

  return (
    <Box mt="20px">
      <Box
        display="flex"
        width="100%"
        height="170px"
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
          valueFormat={(v) => ""}
          colors={{ datum: "data.color" }}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          sortByValue={false}
          innerRadius={0.8}
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            color={theme.palette.secondary[100]}
          >{`${Number(maquina.eficienciadiaria).toFixed(0)}%`}</Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.secondary[100]}
          >
            {maquina.est_nombre}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BreakdownChartEfficiency;
