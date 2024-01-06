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
import Products from "./scenes/products/index.jsx";
import Customers from "./scenes/customers//index.jsx";
import Transactions from "./scenes/transactions/index.jsx";
import Geography from "./scenes/geography/index.jsx";
import Overview from "./scenes/overview/index.jsx";
import Daily from "./scenes/daily/index.jsx";
import Monthly from "./scenes/monthly/index.jsx";
import Breakdown from "./scenes/breakdown/index.jsx";
import Admin from "./scenes/admin/index.jsx";
import Performance from "./scenes/performance/index.jsx";

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
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
