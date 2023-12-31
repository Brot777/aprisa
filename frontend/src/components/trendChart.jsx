import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";

const TrendChart = ({
  isDashboard = false,
  view,
  data,
  isLoading = true,
  isFeaching = false,
}) => {
  const theme = useTheme();

  if (!data || isLoading || isFeaching) return "Loading...";

  const arrayEficiencias = data.map((produccion, index) => {
    return { x: index + ":00", y: produccion };
  });
  const dataGrafica = {
    id: "trendProduction",
    color: theme.palette.secondary[600],
    data: arrayEficiencias,
  };

  return (
    <ResponsiveLine
      data={[dataGrafica]}
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
      margin={{ top: 15, right: 20, bottom: 80, left: 50 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -70,
        legend: "Hora",
        legendOffset: 55,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard
          ? ""
          : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -60,
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

export default TrendChart;
