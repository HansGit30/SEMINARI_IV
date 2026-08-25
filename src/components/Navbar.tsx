import { NavLink, Link } from "react-router-dom";
import { Database, ArrowRight } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-pill">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-badge">
            <Database className="logo-icon" />
          </div>
          <span className="logo-text">DataFlow AI</span>
        </Link>

        {/* Enlaces de Navegación */}
        <nav className="navbar-menu">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Inicio
          </NavLink>
          <NavLink to="/nosotros" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Nosotros
          </NavLink>
          <NavLink to="/servicios" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Servicios
          </NavLink>
          <NavLink to="/contacto" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Contacto
          </NavLink>
        </nav>

        {/* Botón Acción (Login / Get Started) */}
        <Link to="/login" className="btn-get-started">
          <div className="btn-icon-circle">
            <ArrowRight className="btn-arrow" />
          </div>
          <span className="btn-text">Comenzar</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;