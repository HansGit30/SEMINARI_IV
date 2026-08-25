import React from 'react';

const cardsData = [
  {
    id: 1,
    category: "Ciencia de Datos",
    title: "Modelos Predictivos",
    color: "#fff1f2",
    rotate: -10,
    translateY: 20,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    category: "Análisis de Datos",
    title: "Métricas & Dashboards",
    color: "#eff6ff",
    rotate: 0,
    translateY: 0,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    category: "Big Data",
    title: "Procesamiento en Tiempo Real",
    color: "#f0fdf4",
    rotate: 10,
    translateY: 20,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=400&auto=format&fit=crop",
  },
];

const HomeDashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Badge superior */}


      {/* 3 Tarjetas con Imágenes de Análisis de Datos */}
      <div style={styles.cardsWrapper}>
        {cardsData.map((card) => (
          <div
            key={card.id}
            style={{
              ...styles.card,
              backgroundColor: card.color,
              transform: `rotate(${card.rotate}deg) translateY(${card.translateY}px)`,
            }}
          >
            {/* Contenedor de Imagen */}
            <div style={styles.imageContainer}>
              <img src={card.image} alt={card.title} style={styles.cardImage} />
            </div>

            <div style={styles.cardBody}>
              <span style={styles.cardCategory}>{card.category}</span>
              <p style={styles.cardTitle}>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div style={styles.contentSection}>
        <h1 style={styles.title}>
          Ofrecemos lo que importa <br />
          – resultados de <span style={styles.gemEmoji}>💎</span> primer nivel
        </h1>

        <p style={styles.subtitle}>
          Ya seas un fundador de startup o un líder analítico, conocemos tus <br />
          desafíos con los datos y estamos aquí para ayudarte a resolverlos.
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  badgeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 16px",
    borderRadius: "20px",
    border: "1px solid #e4e4e7",
    backgroundColor: "#fafafa",
    marginBottom: "28px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  wandIcon: {
    fontSize: "14px",
  },
  badgeText: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#18181b",
  },
  cardsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    marginBottom: "40px",
    height: "280px",
  },
  card: {
    width: "210px",
    height: "260px",
    borderRadius: "24px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxSizing: "border-box",
    transition: "transform 0.3s ease",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "130px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
  },
  cardCategory: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 600,
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
    lineHeight: "1.3",
  },
  contentSection: {
    textAlign: "center",
    maxWidth: "720px",
  },
  title: {
    fontSize: "42px",
    fontWeight: 800,
    color: "#09090b",
    letterSpacing: "-1.5px",
    lineHeight: "1.2",
    margin: "0 0 16px 0",
  },
  gemEmoji: {
    display: "inline-block",
  },
  subtitle: {
    fontSize: "15px",
    color: "#71717a",
    lineHeight: "1.6",
    margin: 0,
    fontWeight: 400,
  },
};

export default HomeDashboard;