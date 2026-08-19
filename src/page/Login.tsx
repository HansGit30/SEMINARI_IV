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

    // Validación de usuario y contraseña
    const isValidUser = email === "admin" || email === "admin@python.org";
    const isValidPassword = password === "admin";

    if (isValidUser && isValidPassword) {
      navigate("/dashboard");
    } else {
      setError("AuthError: Credenciales inválidas ('admin' / 'admin')");
    }
  };

  return (
    <section className="page" style={styles.container}>
      <div style={styles.card}>
        {/* Cabecera temática */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.promptSymbol}>&gt;&gt;&gt;</span> import auth
          </div>
          <h2 style={styles.title}>Python Auth</h2>
          <p style={styles.subtitle}>Ingresa tus credenciales para acceder a la terminal</p>
        </div>

        {/* Mensaje de error tipo excepción de Python */}
        {error && (
          <div style={styles.errorMessage}>
            <code>{error}</code>
          </div>
        )}

        {/* Formulario */}
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

          <button type="submit" style={styles.button}>
            <code>execute_login()</code>
          </button>
        </form>

        {/* Footer de la tarjeta */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={styles.link}>
              <code>register()</code>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// Estilos inspirados en la paleta oficial de Python
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 140px)",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    border: "1px solid #334155",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#0f172a",
    color: "#38bdf8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontFamily: "monospace",
    marginBottom: "12px",
    border: "1px solid #1e293b",
  },
  promptSymbol: {
    color: "#ffd43b",
    fontWeight: "bold",
  },
  title: {
    color: "#ffd43b",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "8px 0",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  errorMessage: {
    backgroundColor: "#451a1a",
    border: "1px solid #f87171",
    color: "#fca5a5",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#38bdf8",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "6px",
    color: "#f8fafc",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#306998",
    color: "#ffd43b",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    borderTop: "1px solid #334155",
    paddingTop: "16px",
  },
  footerText: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  link: {
    color: "#ffd43b",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Login;