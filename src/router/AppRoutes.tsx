import { Routes, Route } from "react-router-dom";

import Home from "../page/Home";
import Nosotros from "../page/Nosotros";
import MainLayout from "../layouts/MainLayout";
import Servicios from "../page/Servicios";
import Contactos from "../page/Contacto";
import Login from "../page/Login";
import Register from "../page/Register"; // <-- Importamos Register aquí
import Dashboard from "../components/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import HomeDashboard from "../page/HomeDashboard";
import { Panda } from "lucide-react";
import Numpy from "../page/Numpy";
import Reportes from "../page/Reportes";
import Imagen from "../page/Imagen";
import Audio from "../page/Audio";
import Postura from "../page/Postura";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contactos />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<HomeDashboard />} />
        <Route path="/dashboard/pandas" element={<Panda />} />
        <Route path="/dashboard/numpy" element={<Numpy />} />
        <Route path="/dashboard/reportes" element={<Reportes />} />

        <Route path="/dashboard/imagen" element={<Imagen />} />
        <Route path="/dashboard/audio" element={<Audio />} />
        <Route path="/dashboard/postura" element={<Postura />} />




      </Route>

      <Route path="/login" element={<Login />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default AppRoutes;
