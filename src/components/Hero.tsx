import { Database, LineChart, Code2, Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import "./Hero.css";

const steps = [
  {
    number: "01",
    title: "Fuentes de Datos",
    description:
      "Identifica y conecta con APIs, bases de datos SQL/NoSQL, archivos CSV o páginas web (Web Scraping) para obtener la información bruta.",
    color: "orange",
    pinColor: "pin-orange",
    rotation: "-rotate-3",
  },
  {
    number: "02",
    title: "Limpieza y Transformación",
    description:
      "Elimina valores nulos, registros duplicados y estandariza los formatos usando bibliotecas como Pandas y NumPy.",
    color: "blue",
    pinColor: "pin-blue",
    rotation: "rotate-2",
  },
  {
    number: "03",
    title: "Validación y Calidad",
    description:
      "Asegura la integridad de la estructura de los datos verificando tipos, rangos y esquemas antes de guardarlos.",
    color: "purple",
    pinColor: "pin-purple",
    rotation: "-rotate-2",
  },
  {
    number: "04",
    title: "Carga y Almacenamiento",
    description:
      "Guarda los datasets optimizados en un Data Warehouse o base de datos lista para análisis visual y modelos de ML.",
    color: "orange",
    pinColor: "pin-orange",
    rotation: "rotate-3",
  },
];

const testimonials = [
  {
    category: "EXTRACCIÓN DE DATOS",
    quote: "La automatización del scraping redujo nuestros tiempos de ingesta de 12 horas a solo 15 minutos diarios.",
    name: "Carlos Mendoza",
    role: "Lead Data Engineer · TechCorp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  },
  {
    category: "LIMPIEZA & ETL",
    quote: "Logramos estandarizar bases de datos legacy complejas sin perder integridad en las transacciones.",
    rating: "4.9",
    name: "Ana Belén",
    role: "Head of Analytics · DataFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    category: "INGENIERÍA DE DATOS",
    quote: "La arquitectura de extracción soporta más de 5 millones de eventos por segundo sin caídas.",
    name: "Miguel Torres",
    role: "Architect · CloudData",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  },
  {
    category: "VISUALIZACIÓN",
    quote: "Los tableros procesan datos limpios en tiempo real ofreciendo métricas claras para decisiones rápidas.",
    name: "Sofía Ramos",
    role: "BI Manager · Analytics",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
];

function Hero() {
  return (
    <section className="hero-section">
      {/* 1. Header del Hero */}
      <div className="hero-header-container">
        <h1 className="hero-title">
          Estudio analítico enfocado en{" "}
          <span className="inline-card shadow-purple">
            <LineChart className="card-icon text-purple" />
            <span className="badge badge-purple">Pandas</span>
          </span>{" "}
          transformar datos,{" "}
          <span className="inline-card shadow-orange">
            <Database className="card-icon text-orange" />
            <span className="badge badge-orange">Empresas</span>
          </span>{" "}
          software, y{" "}
          <span className="inline-card shadow-green">
            <Code2 className="card-icon text-green" />
            <span className="badge badge-green">NumPy</span>
          </span>{" "}
          visualización.
        </h1>
        <p className="hero-subtitle">
          Nuestra misión es hacer un análisis de datos visualmente atractivo, útil y de alto rendimiento.
        </p>
      </div>

      {/* 2. Grid de Notas Adhesivas */}
      <div className="notes-grid">
        {steps.map((step) => (
          <div key={step.number} className={`sticky-note ${step.rotation}`}>
            <div className={`pin ${step.pinColor}`}></div>
            <div className={`note-content ${step.color}`}>
              <span className="note-number">{step.number}</span>
              <h3 className="note-title">{step.title}</h3>
              <p className="note-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Estilizado (Testimonios en fila y fotos en burbuja) */}
      <div className="hero-footer-testimonials">
        <div className="cards-slider">
          {testimonials.map((item, index) => (
            <div key={index} className="testimonial-card">
              <span className="card-category">{item.category}</span>
              <p className="card-quote">"{item.quote}"</p>
              
              {item.rating && (
                <div className="card-rating">
                  <Star className="star-icon" />
                  <span>{item.rating}</span>
                </div>
              )}

              <div className="card-user">
                <img src={item.avatar} alt={item.name} className="user-avatar" />
                <div className="user-info">
                  <h4 className="user-name">{item.name}</h4>
                  <p className="user-role">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginador */}
        <div className="slider-paginator">
          <button className="paginator-btn"><ChevronLeft size={16} /></button>
          <span className="paginator-text">2 / 30</span>
          <div className="paginator-bar"><div className="paginator-fill"></div></div>
          <button className="paginator-btn"><ChevronRight size={16} /></button>
        </div>

        {/* Título de Impacto */}
        <h2 className="testimonials-title">
          ¡Más de 250 pipelines de datos procesados en todo el país!
        </h2>

        {/* Burbujas Flotantes */}
        <div className="bubbles-grid">
          <div className="bubble bubble-sm">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="Data" />
          </div>
          <div className="bubble bubble-md">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200" alt="Data" />
          </div>
          <div className="bubble bubble-lg bubble-video">
            <button className="play-btn"><Play size={22} fill="#fff" color="#fff" /></button>
          </div>
          <div className="bubble bubble-md">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Data" />
          </div>
          <div className="bubble bubble-sm">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=150" alt="Data" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;