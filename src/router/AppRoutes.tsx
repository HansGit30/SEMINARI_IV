import { Routes, Route } from "react-router-dom";

import Home from "../page/Home";
import Nosotros from "../page/Nosotros";
import MainLayout from "../layouts/MainLayout";
import Servicios from "../page/Servicios";
import Contactos from "../page/Contacto";
import Login from "../page/Login";

import Register from "../page/Register";
import Dashboard from "../components/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import HomeDashboard from "../page/HomeDashboard";
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
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/dashboard/home" element={<HomeDashboard />} />
        <Route path="/dashboard/imagen" element={<Imagen />} />
        <Route path="/dashboard/audio" element={<Audio />} />
        <Route path="/dashboard/postura" element={<Postura />} />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;