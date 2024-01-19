import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout/index";
import HomeDashboard from "./scenes/home_dashboard/index.jsx";
import MetalicoDia from "./scenes/metalico_dia/index.jsx";
import MetalicoSemana from "./scenes/metalico_semana/index.jsx";
import MetalicoMes from "./scenes/metalico_mes/index.jsx";
import MetalicoRendimiento from "./scenes/metalico_rendimiento/index.jsx";
import MetalicoIndicadores from "./scenes/metalico_indicadores";
import PinturaDia from "./scenes/pintura_dia/index.jsx";
import PinturaSemana from "./scenes/pintura_semana/index.jsx";
import PinturaMes from "./scenes/pintura_mes/index.jsx";
import PinturaRendimiento from "./scenes/pintura_rendimiento/index.jsx";
import PinturaIndicadores from "./scenes/pintura_indicadores/index.jsx";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={<Navigate to="/home-dashboard" replace />}
              />
              <Route path="/home-dashboard" element={<HomeDashboard />} />
              <Route path="/metalico-dia" element={<MetalicoDia />} />
              <Route path="/metalico-semana" element={<MetalicoSemana />} />
              <Route path="/metalico-mes" element={<MetalicoMes />} />
              <Route
                path="/metalico-rendimiento"
                element={<MetalicoRendimiento />}
              />
              <Route
                path="/metalico-indicadores"
                element={<MetalicoIndicadores />}
              />
              <Route path="/pintura-dia" element={<PinturaDia />} />
              <Route path="/pintura-semana" element={<PinturaSemana />} />
              <Route path="/pintura-mes" element={<PinturaMes />} />
              <Route
                path="/pintura-rendimiento"
                element={<PinturaRendimiento />}
              />
              <Route
                path="/pintura-indicadores"
                element={<PinturaIndicadores />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
