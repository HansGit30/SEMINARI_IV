import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isDefaultAdmin =
      (email === "admin" || email === "admin@python.org") && password === "admin";

    const registeredUsers = JSON.parse(
      localStorage.getItem("registered_users") || "[]"
    );
    const foundUser = registeredUsers.find(
      (u: { email?: string; password?: string }) =>
        u.email === email && u.password === password
    );

    if (isDefaultAdmin || foundUser) {
      navigate("/dashboard");
    } else {
      setError("AuthError: Credenciales inválidas ('admin' / 'admin' o usuario registrado)");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        {/* Panel Izquierdo con Imagen al Centro */}
        <div style={styles.leftColumn}>
          <div style={styles.leftHeader}>
            {/* BOTÓN REGRESAR AL HOME */}
            <Link to="/" style={styles.backHomeBtn}>
              ← Volver al Home
            </Link>

            <div style={styles.headerNav}>
              <span style={styles.navLink}>Nosotros</span>
              <button type="button" style={styles.joinButton}>
                Servicios
              </button>
            </div>
          </div>

          {/* Imagen ilustrativa central */}
          <div style={styles.imageContainer}>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
              alt="Data Analytics"
              style={styles.heroImage}
            />
          </div>

          <div style={styles.heroTextContainer}>
            <span style={styles.heroBadge}>PANDAS &amp; NUMPY</span>
            <h2 style={styles.heroTitle}>Transforma tus datos en conocimiento</h2>
          </div>
        </div>

        {/* Panel Derecho: Formulario */}
        <div style={styles.rightColumn}>
          <div style={styles.rightHeader}>
            <span style={styles.brandTitleRight}>DATAFLOW</span>
            <div style={styles.langSelector}>
              <span>🌐 ES</span>
              <span style={{ fontSize: "10px", marginLeft: "4px" }}>▼</span>
            </div>
          </div>

          <div style={styles.formContainer}>
            <div style={styles.badge}>
              <span style={styles.promptSymbol}>&gt;&gt;&gt;</span> import dataflow
            </div>

            <h1 style={styles.title}>Iniciar Sesión</h1>
            <p style={styles.subtitle}>Ingresa a tu plataforma analítica</p>

            {error && (
              <div style={styles.errorMessage}>
                <code>{error}</code>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <code>user_email =</code>
                </label>
                <input
                  type="text"
                  placeholder="admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <code>password =</code>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Ingresar al sistema →
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                ¿No tienes cuenta?{" "}
                <Link to="/register" style={styles.link}>
                  Registrarse
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    backgroundImage: "linear-gradient(to bottom, #ffffff, #f1f5f9)",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: "100%",
    maxWidth: "960px",
    minHeight: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
  },
  leftColumn: {
    position: "relative",
    padding: "36px",
    backgroundColor: "#0f172a",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  leftHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  backHomeBtn: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "13px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    transition: "background-color 0.2s",
  },
  headerNav: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navLink: {
    color: "#94a3b8",
    fontSize: "13px",
    cursor: "pointer",
  },
  joinButton: {
    backgroundColor: "#bef264",
    color: "#0f172a",
    border: "none",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
    width: "100%",
  },
  heroImage: {
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
  },
  heroTextContainer: {
    zIndex: 2,
  },
  heroBadge: {
    color: "#bef264",
    fontSize: "12px",
    fontFamily: "monospace",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "1px",
    backgroundColor: "rgba(190, 242, 100, 0.1)",
    padding: "4px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(190, 242, 100, 0.2)",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: "1.2",
    margin: "12px 0 0 0",
    letterSpacing: "-0.5px",
  },
  rightColumn: {
    backgroundColor: "#ffffff",
    padding: "36px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandTitleRight: {
    fontWeight: 800,
    fontSize: "15px",
    letterSpacing: "1px",
    color: "#0f172a",
  },
  langSelector: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    color: "#64748b",
    backgroundColor: "#f8fafc",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "340px",
    margin: "0 auto",
    width: "100%",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontFamily: "monospace",
    marginBottom: "12px",
    border: "1px solid #e2e8f0",
  },
  promptSymbol: {
    color: "#65a30d",
    fontWeight: "bold",
  },
  title: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px 0",
    textAlign: "center",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 24px 0",
    textAlign: "center",
  },
  errorMessage: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    marginBottom: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#475569",
    fontSize: "13px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#0f172a",
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#bef264",
    color: "#0f172a",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "8px",
    boxShadow: "0 4px 12px rgba(190, 242, 100, 0.4)",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#0f172a",
    fontWeight: 700,
    textDecoration: "underline",
  },
};

export default Login;