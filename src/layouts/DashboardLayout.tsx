import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: string;
  path: string;
  hasArrow?: boolean;
}

interface UserData {
  name: string;
  role: string;
  avatar: string;
}

export default function DashboardLayout(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para los datos del usuario (con valores por defecto si no existen en localStorage)
  const [user, setUser] = useState<UserData>({
    name: "Usuario",
    role: "Rol no asignado",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
  });

  useEffect(() => {
    // Lee el objeto 'user' o claves individuales guardadas en localStorage al iniciar sesión
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear el usuario del localStorage", error);
      }
    } else {
      // Alternativa si guardas claves individuales:
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole");
      const avatar = localStorage.getItem("userAvatar");

      if (name || role || avatar) {
        setUser({
          name: name || "Usuario",
          role: role || "Rol no asignado",
          avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
        });
      }
    }
  }, []);

  const mainItems: MenuItem[] = [
    { name: "INICIO", icon: "🏠", path: "/dashboard" },
    { name: "PANDAS", icon: "📦", path: "/dashboard/pandas" },
    { name: "NUMPY", icon: "🔧", path: "/dashboard/numpy", hasArrow: true },
    { name: "REPORTES", icon: "⛽", path: "/dashboard/reportes", hasArrow: true },
  ];

  const aiItems: MenuItem[] = [
    { name: "PROYECTO IMAGEN", icon: "🖼️", path: "/dashboard/imagen" },
    { name: "PROYECTO AUDIO", icon: "🎙️", path: "/dashboard/audio" },
    { name: "PROYECTO POSTURA", icon: "🧍", path: "/dashboard/postura" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div style={styles.appContainer}>
      {/* --- SIDEBAR LATERAL --- */}
      <aside style={styles.sidebar}>
        <div style={styles.brandRow}>
          <div style={styles.brandLogo}>⚡</div>
          <div>
            <div style={styles.brandName}>LoadSwift</div>
            <div style={styles.brandSub}>Company</div>
          </div>
          <span style={styles.collapseIcon}>«</span>
        </div>

        <nav style={styles.menuNav}>
          {/* SECCIÓN PRINCIPAL */}
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.menuItemActive : {}),
                }}
              >
                <span>{item.icon}</span> {item.name}
                {item.hasArrow && <span style={styles.arrow}>▾</span>}
              </div>
            );
          })}

          {/* SECCIÓN PREDICCIÓN IA */}
          <div style={styles.menuSectionTitle}>PREDICCIÓN IA</div>
          {aiItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.menuItemActive : {}),
                }}
              >
                <span>{item.icon}</span> {item.name}
              </div>
            );
          })}

          {/* SECCIÓN SUPPORT */}
          <div style={styles.menuSectionTitle}>SUPPORT</div>
          <div
            onClick={() => handleNavigation("/dashboard/documentacion")}
            style={{
              ...styles.menuItem,
              ...(location.pathname === "/dashboard/documentacion"
                ? styles.menuItemActive
                : {}),
            }}
          >
            <span>📄</span> DOCUMENTACIÓN
          </div>
        </nav>

        {/* PERFIL DE USUARIO DINÁMICO */}
        <div style={styles.userProfile}>
          <img
            src={user.avatar}
            alt={user.name}
            style={styles.userAvatar}
          />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>{user.role}</div>
          </div>
          <button
            type="button"
            title="Cerrar sesión"
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            🚪
          </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: "240px",
    height: "100vh",
    backgroundColor: "#111111",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 16px",
    boxSizing: "border-box",
    flexShrink: 0,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  brandLogo: {
    width: "32px",
    height: "32px",
    backgroundColor: "#facc15",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    fontWeight: "bold",
  },
  brandName: { fontWeight: 700, fontSize: "14px" },
  brandSub: { fontSize: "10px", color: "#71717a" },
  collapseIcon: { marginLeft: "auto", color: "#71717a", cursor: "pointer" },
  menuNav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1, overflowY: "auto" },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    color: "#a1a1aa",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontWeight: 500,
  },
  menuItemActive: {
    backgroundColor: "#27272a",
    color: "#ffffff",
    fontWeight: 600,
  },
  arrow: { marginLeft: "auto", fontSize: "10px" },
  menuSectionTitle: {
    fontSize: "10px",
    color: "#52525b",
    margin: "18px 12px 6px 12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 700,
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingTop: "16px",
    borderTop: "1px solid #27272a",
  },
  userAvatar: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" },
  userName: {
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: "11px",
    color: "#71717a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  mainContent: {
    flex: 1,
    height: "100vh",
    backgroundColor: "#ffffff",
    overflowY: "auto",
  },
};