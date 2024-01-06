import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const PercentageUnitsProducedChart = ({
  isDashboard = false,
  view,
  data,
  isLoading = true,
}) => {
  const theme = useTheme();

  if (!data || isLoading) return "Loading...";

  const dataPloat = data.map(
    ({ porcetajeProduccionPorEstacion, est_nombre }) => {
      return {
        producido: porcetajeProduccionPorEstacion,
        faltante: (100 - Number(porcetajeProduccionPorEstacion)).toFixed(2),
        est_nombre,
      };
    }
  );

  return (
    <ResponsiveBar
      data={dataPloat}
      keys={["producido", "faltante"]}
      indexBy="est_nombre"
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
      margin={{ top: 20, right: 110, bottom: 120, left: 50 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: false }}
      enableLabel={false}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={true}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -70,
      }}
      axisLeft={{
        format: (number) => {
          return number + "%";
        },
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: -50,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      colors={{ scheme: "nivo" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PercentageUnitsProducedChart;
