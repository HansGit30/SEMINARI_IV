import { Navigate, Route, Routes } from "react-router-dom";
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
import Documentos from "../page/Documentos";
import ProtectedRoute from "../components/ProtectedRoute";

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

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeDashboard />} />
          <Route path="pandas" element={<Dashboard />} />
          <Route path="numpy" element={<Dashboard />} />
          <Route path="reportes" element={<Dashboard />} />
          <Route path="imagen" element={<Imagen />} />
          <Route path="audio" element={<Audio />} />
          <Route path="postura" element={<Postura />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="documentacion" element={<Navigate to="../documentos" replace />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
