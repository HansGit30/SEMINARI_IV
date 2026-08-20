import { Routes, Route } from "react-router-dom";

import Home from "../page/Home";
import Nosotros from "../page/Nosotros";
import MainLayout from "../layouts/MainLayout";
import Servicios from "../page/Servicios";
import Contactos from "../page/Contacto";
import Login from "../page/Login";
import Register from "../page/Register"; // <-- Importamos Register aquí
import Dashboard from "../components/Dashboard";

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
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AppRoutes;
