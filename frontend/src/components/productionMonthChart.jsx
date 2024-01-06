import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";

const ProductionMonthChart = ({ view, data, isLoading = true }) => {
  const theme = useTheme();

  if (!data || isLoading) return "Loading...";

  return (
    <ResponsiveBar
      data={data}
      keys={["produccionDia"]}
      indexBy="dia"
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
      margin={{
        top: 15,
        right: 20,
        bottom: view == "semana" ? 110 : 60,
        left: 50,
      }}
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
        legend: "Dia",
        legendOffset: view == "semana" ? 80 : 35,
        legendPosition: "middle",
      }}
      axisLeft={{
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
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  );
};

export default ProductionMonthChart;
