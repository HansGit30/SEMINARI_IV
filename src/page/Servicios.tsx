import React from 'react';

function Services() {
  return (
    <section className="hero-section">
      <style>{`
        /* ENCABEZADO SERVICES */
        .services-header-container {
          max-width: 1000px;
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .services-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #9333ea;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        /* BARRA DE ESTADÍSTICAS */
        .stats-notebook-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 4rem;
          width: 100%;
          max-width: 900px;
        }

        .stat-notebook-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform 0.2s ease;
        }

        .stat-notebook-card:hover {
          transform: translateY(-3px);
        }

        .stat-notebook-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-notebook-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
        }

        /* BOTÓN DE NOTA ADHESIVA */
        .sticky-note-btn {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.6rem 1rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.65rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          text-decoration: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .sticky-note-btn:hover {
          transform: translateY(-2px);
          background-color: #f8fafc;
        }

        .service-features-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.75rem;
        }

        .service-feature-item {
          font-size: 0.85rem;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .service-feature-check {
          font-weight: 800;
          color: #10b981;
        }

        /* GRID DE SERVICIOS (3 COLUMNAS) */
        .services-notes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem 2rem;
          max-width: 1000px;
          width: 100%;
        }

        @media (max-width: 900px) {
          .services-notes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .services-notes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* 1. Encabezado principal */}
      <div className="services-header-container">
        <span className="services-tag">NUESTROS SERVICIOS</span>
        <h1 className="hero-title">
          Soluciones{" "}
          <span className="inline-card shadow-orange">
            <span className="badge badge-orange">Digitales</span>
            ⚡
          </span>{" "}
          hechas a medida.
        </h1>
        <p className="hero-subtitle">
          Desarrollamos soluciones tecnológicas modernas para transformar ideas en proyectos funcionales.
        </p>
      </div>

      {/* 2. Estadísticas estilo cuaderno */}
      <div className="stats-notebook-container">
        <div className="stat-notebook-card">
          <span className="stat-notebook-number text-purple">+20</span>
          <span className="stat-notebook-label">Proyectos</span>
        </div>
        <div className="stat-notebook-card">
          <span className="stat-notebook-number text-orange">+10</span>
          <span className="stat-notebook-label">Soluciones</span>
        </div>
        <div className="stat-notebook-card">
          <span className="stat-notebook-number text-green">100%</span>
          <span className="stat-notebook-label">Compromiso</span>
        </div>
        <div className="stat-notebook-card">
          <span className="stat-notebook-number text-purple">24/7</span>
          <span className="stat-notebook-label">Disponibilidad</span>
        </div>
      </div>

      {/* 3. Grid de Servicios (6 Notas Adhesivas) */}
      <div className="services-notes-grid">
        {/* Servicio 01 */}
        <div className="sticky-note -rotate-3">
          <div className="pin pin-orange"></div>
          <div className="note-content orange">
            <span className="note-number">01. 💻</span>
            <h3 className="note-title">Desarrollo Web</h3>
            <p className="note-desc">
              Creamos sitios web modernos, rápidos y adaptables a cualquier dispositivo.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Diseño responsive</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Interfaz moderna</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Optimización web</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>

        {/* Servicio 02 */}
        <div className="sticky-note rotate-2">
          <div className="pin pin-blue"></div>
          <div className="note-content blue">
            <span className="note-number">02. ⚙️</span>
            <h3 className="note-title">Desarrollo de Software</h3>
            <p className="note-desc">
              Desarrollamos soluciones de software enfocadas en las necesidades de cada proyecto.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Sistemas personalizados</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Automatización</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Mantenimiento</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>

        {/* Servicio 03 */}
        <div className="sticky-note -rotate-2">
          <div className="pin pin-purple"></div>
          <div className="note-content purple">
            <span className="note-number">03. 📊</span>
            <h3 className="note-title">Análisis de Datos</h3>
            <p className="note-desc">
              Transformamos datos en información útil para facilitar la toma de decisiones.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Reportes</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Estadísticas</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Visualización de datos</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>

        {/* Servicio 04 */}
        <div className="sticky-note rotate-3">
          <div className="pin pin-purple"></div>
          <div className="note-content purple">
            <span className="note-number">04. 🤖</span>
            <h3 className="note-title">Inteligencia Artificial</h3>
            <p className="note-desc">
              Integramos herramientas de inteligencia artificial para mejorar procesos y experiencias.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Automatización</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Modelos inteligentes</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Asistentes virtuales</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>

        {/* Servicio 05 */}
        <div className="sticky-note -rotate-3">
          <div className="pin pin-orange"></div>
          <div className="note-content orange">
            <span className="note-number">05. 🔒</span>
            <h3 className="note-title">Seguridad</h3>
            <p className="note-desc">
              Implementamos buenas prácticas para proteger la información y los sistemas.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Protección de datos</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Control de acceso</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Buenas prácticas</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>

        {/* Servicio 06 */}
        <div className="sticky-note rotate-2">
          <div className="pin pin-blue"></div>
          <div className="note-content blue">
            <span className="note-number">06. 📱</span>
            <h3 className="note-title">Aplicaciones</h3>
            <p className="note-desc">
              Diseñamos aplicaciones funcionales con interfaces intuitivas y fáciles de utilizar.
            </p>
            <div className="service-features-list">
              <div className="service-feature-item"><span className="service-feature-check">✓</span> UI moderna</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Experiencia de usuario</div>
              <div className="service-feature-item"><span className="service-feature-check">✓</span> Diseño adaptable</div>
            </div>
            <a href="#ver" className="sticky-note-btn">
              Ver servicio <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;