import React, { useState } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: {
    padding: "60px 0",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    marginBottom: "40px",
  },
  headerHero: {
    textAlign: "center",
    marginBottom: "60px",
    position: "relative",
    overflow: "hidden",
    padding: "40px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  titleHero: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "15px",
    position: "relative",
    zIndex: 1,
  },
  subtitleHero: {
    fontSize: "20px",
    color: "#4b5563",
    maxWidth: "800px",
    margin: "0 auto",
    lineHeight: "1.6",
    position: "relative",
    zIndex: 1,
  },
  pandasLogoHero: {
    position: "absolute",
    right: "-30px",
    top: "-30px",
    width: "180px",
    opacity: 0.15,
    zIndex: 0,
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
    marginBottom: "60px",
    padding: "0 40px",
  },
  featureCard: {
    background: "#f9fafb",
    padding: "30px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
  },
  featureCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  featureIcon: {
    width: "60px",
    height: "60px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "22px",
    marginBottom: "12px",
    color: "#111827",
  },
  featureText: {
    color: "#374151",
    lineHeight: "1.6",
    flex: 1,
  },
  codeSection: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "60px",
    marginLeft: "40px",
    marginRight: "40px",
    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
  },
  codeHeader: {
    fontSize: "18px",
    marginBottom: "15px",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  codeBlock: {
    fontFamily: "monospace, monospace",
    overflowX: "auto",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#e2e8f0",
  },
  moreInfoSection: {
    padding: "40px",
    background: "#fdfefe",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "40px",
    marginLeft: "40px",
    marginRight: "40px",
  },
  infoFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    alignItems: "flex-start",
  },
  infoImage: {
    width: "100%",
    maxWidth: "350px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  infoTextList: {
    listStyleType: "square",
    paddingLeft: "20px",
    color: "#374151",
    lineHeight: "1.8",
  },
  downloadButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#38bdf8",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
};

function Home(): React.ReactElement {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cardFeatures = [
    {
      id: 1,
      title: "DataFrames",
      icon: "https://pandas.pydata.org/docs/_images/index_getting_started.svg",
      text: "Estructuras tabulares bidimensionales como hojas de cálculo con índices en filas y columnas. Es el núcleo de Pandas.",
    },
    {
      id: 2,
      title: "Series",
      icon: "https://pandas.pydata.org/docs/_images/index_user_guide.svg",
      text: "Arreglos unidimensionales etiquetados capaces de contener cualquier tipo de dato, similar a una columna de una base de datos.",
    },
    {
      id: 3,
      title: "Manipulación de Datos",
      icon: "https://pandas.pydata.org/docs/_images/index_api.svg",
      text: "Herramientas para alinear, reindexar, fusionar, unir y transformar conjuntos de datos de forma fácil y eficiente.",
    },
    {
      id: 4,
      title: "Análisis Estadístico",
      icon: "https://pandas.pydata.org/docs/_images/index_contribute.svg",
      text: "Funciones integradas para cálculos estadísticos comunes, agrupamientos, agregaciones y operaciones de ventana.",
    },
    {
      id: 5,
      title: "Series de Tiempo",
      icon: "https://pandas.pydata.org/docs/_images/index_getting_started.svg",
      text: "Soporte robusto y flexible para indexación basada en fecha y hora, remuestreo, y operaciones de desplazamiento.",
    },
    {
      id: 6,
      title: "Visualización Rápida",
      icon: "https://pandas.pydata.org/docs/_images/index_api.svg",
      text: "Integración directa con Matplotlib para generar gráficos básicos como líneas, barras y diagramas de caja directamente desde tus DataFrames.",
    },
  ];

  return (
    <section className="page" style={styles.mainContainer}>
      <header style={styles.headerHero}>
        <img
          src="https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/source/_static/pandas_logo.png"
          alt="Pandas Logo"
          style={styles.pandasLogoHero}
        />
        <h2 style={styles.titleHero}>Domina el Análisis de Datos con Pandas</h2>
        <p style={styles.subtitleHero}>
          Pandas es la librería de Python esencial que revolucionó la ciencia de
          datos. Proporciona estructuras de datos flexibles y herramientas para
          manipulación, limpieza, análisis y visualización de conjuntos de datos
          de forma rápida y sencilla.
        </p>
      </header>

      <section style={styles.featuresGrid}>
        {cardFeatures.map((feature, index) => (
          <article
            key={feature.id}
            style={{
              ...styles.featureCard,
              ...(hoveredCard === index ? styles.featureCardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <img
              src={feature.icon}
              alt={`${feature.title} Icon`}
              style={styles.featureIcon}
            />
            <h3 style={styles.featureTitle}>{feature.title}</h3>
            <p style={styles.featureText}>{feature.text}</p>
          </article>
        ))}
      </section>

      <article style={styles.codeSection}>
        <h3 style={styles.codeHeader}>
          <svg
            style={{ width: "20px", height: "20px" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 18l6-6-6-6M8 6l-6 6 6 6M12 18V6" />
          </svg>
          Ejemplo Práctico de Manipulación
        </h3>
        <pre style={styles.codeBlock}>
          {`import pandas as pd
import numpy as np

# Crear un DataFrame de ejemplo
data = {
    'Producto': ['A', 'B', 'A', 'C', 'B'],
    'Precio': [10.5, 20.0, 15.2, np.nan, 22.5],
    'Cantidad': [100, 50, 150, 20, 80],
    'Fecha': pd.date_range(start='2023-01-01', periods=5)
}

df = pd.DataFrame(data)

# Imprimir el DataFrame original
print("--- DataFrame Original ---")
print(df)
print("\\n")

# Limpieza: Rellenar precios faltantes con la media
mean_price = df['Precio'].mean()
df['Precio'].fillna(mean_price, inplace=True)

# Cálculo: Total de ventas por fila
df['Total'] = df['Precio'] * df['Cantidad']

# Agregación: Ventas totales por producto
ventas_por_producto = df.groupby('Producto')['Total'].sum()

# Resultado
print("--- DataFrame Procesado ---")
print(df)
print("\\n")
print("--- Ventas Totales por Producto ---")
print(ventas_por_producto)`}
        </pre>
      </article>

      <article style={styles.moreInfoSection}>
        <h3
          style={{
            ...styles.featureTitle,
            marginBottom: "25px",
            textAlign: "center",
          }}
        >
          ¿Por qué Pandas es tan Poderoso?
        </h3>
        <div style={styles.infoFlex}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRadYXBHB9wMOqYz9V7AbbUGs-DNh6R7pTcdaa-1u2R2w&s=10"
            alt="Data Analysis Illustration"
            style={styles.infoImage}
          />
          <div style={{ flex: 1 }}>
            <p style={styles.featureText}>
              Pandas no es solo una herramienta, es un ecosistema completo que
              simplifica y acelera el flujo de trabajo de datos. Se integra a la
              perfección con el núcleo de Python y otras librerías científicas
              como NumPy (en la que se basa), Matplotlib, SciPy y Scikit-learn.
            </p>
            <h4
              style={{
                ...styles.featureTitle,
                fontSize: "18px",
                marginTop: "20px",
              }}
            >
              Beneficios Clave:
            </h4>
            <ul style={styles.infoTextList}>
              <li>
                <strong>Flexibilidad:</strong> Maneja datos mixtos (números,
                texto, fechas, etc.) y desordenados con facilidad.
              </li>
              <li>
                <strong>Rendimiento:</strong> La mayoría de sus operaciones
                críticas están optimizadas en C, lo que lo hace muy rápido.
              </li>
              <li>
                <strong>Limpieza de Datos:</strong> Herramientas inigualables
                para tratar valores nulos, duplicados y datos inconsistentes.
              </li>
              <li>
                <strong>I/O Extenso:</strong> Lee y escribe datos de una
                variedad enorme de fuentes y formatos (CSV, Excel, SQL, JSON,
                Parquet, etc.).
              </li>
            </ul>
            <a
              href="https://pandas.pydata.org/docs/"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.downloadButton}
            >
              Ver la Documentación Oficial
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Home;