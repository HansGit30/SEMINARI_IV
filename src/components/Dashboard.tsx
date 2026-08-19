import React, { useState } from "react";

function Dashboard(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<string>("pandas");

  return (
    <div style={styles.dashboardLayout}>
      {/* Sidebar Azul */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🐍</span>
          <span style={styles.brandName}>DASHBOARD</span>
        </div>

        <nav style={styles.sideNav}>
          <button
            style={{
              ...styles.navBtn,
              ...(activeTab === "pandas" ? styles.navBtnActive : {}),
            }}
            onClick={() => setActiveTab("pandas")}
          >
            Librería Pandas
          </button>

          <button
            style={{
              ...styles.navBtn,
              ...(activeTab === "numpy" ? styles.navBtnActive : {}),
            }}
            onClick={() => setActiveTab("numpy")}
          >
            Librería NumPy
          </button>

          <button
            style={{
              ...styles.navBtn,
              ...(activeTab === "reporte" ? styles.navBtnActive : {}),
            }}
            onClick={() => setActiveTab("reporte")}
          >
            Reporte
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main style={styles.mainContent}>
        <div style={styles.panelContainer}>
          <h2 style={styles.contentTitle}>
            {activeTab === "pandas" && "Librería Pandas"}
            {activeTab === "numpy" && "Librería NumPy"}
            {activeTab === "reporte" && "Reporte"}
          </h2>
        </div>
      </main>
    </div>
  );
}

// Estilos de la interfaz
const styles: { [key: string]: React.CSSProperties } = {
  dashboardLayout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#eef2f6",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#16335d",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  brand: {
    padding: "24px 20px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    letterSpacing: "1px",
  },
  brandIcon: {
    fontSize: "24px",
  },
  brandName: {
    color: "#ffffff",
  },
  sideNav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "10px",
  },
  navBtn: {
    padding: "16px 20px",
    textAlign: "left",
    background: "transparent",
    border: "none",
    color: "#93c5fd",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  navBtnActive: {
    backgroundColor: "#20467e",
    color: "#ffffff",
    fontWeight: "bold",
    borderLeft: "4px solid #38bdf8",
  },
  mainContent: {
    flex: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
  },
  panelContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentTitle: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1e293b",
    margin: 0,
  },
};

export default Dashboard;