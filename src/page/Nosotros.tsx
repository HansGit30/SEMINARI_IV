import React from 'react';

function About() {
  return (
    <section className="hero-section">
      <style>{`
        /* ENCABEZADO ABOUT */
        .about-header-container {
          max-width: 1000px;
          text-align: center;
          margin-bottom: 4rem;
        }

        .about-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #9333ea;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        /* BANNER FINAL */
        .about-banner-card {
          margin-top: 5rem;
          width: 100%;
          max-width: 900px;
          background: #ffffff;
          border-radius: 1.25rem;
          padding: 2.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
          text-align: center;
          position: relative;
        }

        .about-banner-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }

        /* SECCIÓN TECNOLOGÍAS */
        .tech-container {
          margin-top: 5rem;
          width: 100%;
          max-width: 900px;
          text-align: center;
        }

        .tech-badges-list {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .tech-pill {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
          box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .tech-pill:hover {
          transform: translateY(-2px);
        }

        /* EXTENSIÓN PARA GRID DE 4 VALORES */
        .values-notes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          max-width: 1100px;
          width: 100%;
          margin-top: 2rem;
        }

        @media (max-width: 900px) {
          .values-notes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .values-notes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* 1. Encabezado principal */}
      <div className="about-header-container">
        <span className="about-tag">SOBRE NOSOTROS</span>
        <h1 className="hero-title">
          Conoce nuestro{" "}
          <span className="inline-card shadow-purple">
            <span className="badge badge-purple">Proyecto</span>
            🚀
          </span>{" "}
          y al equipo que lo impulsa.
        </h1>
        <p className="hero-subtitle">
          Somos un equipo enfocado en crear soluciones digitales modernas, eficientes y fáciles de utilizar.
        </p>
      </div>

      {/* 2. Tarjeta principal: ¿Quiénes somos? */}
      <div className="notes-grid" style={{ maxWidth: '900px', marginBottom: '4rem' }}>
        <div className="sticky-note -rotate-2" style={{ gridColumn: '1 / -1' }}>
          <div className="pin pin-purple"></div>
          <div className="note-content purple">
            <span className="note-number">🚀</span>
            <h3 className="note-title" style={{ fontSize: '1.75rem' }}>¿Quiénes somos?</h3>
            <p className="note-desc" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
              Somos un equipo de estudiantes y desarrolladores interesados en la tecnología, el desarrollo de software y la creación de experiencias digitales. Nuestro proyecto busca combinar funcionalidad, diseño y tecnología para ofrecer una plataforma útil y sencilla.
            </p>
            <p className="note-desc" style={{ fontSize: '1rem' }}>
              Trabajamos utilizando herramientas modernas de desarrollo web y aplicando buenas prácticas para construir una aplicación organizada, responsive y fácil de mantener.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Misión y Visión (Grid de 2 columnas) */}
      <div className="notes-grid">
        <div className="sticky-note -rotate-3">
          <div className="pin pin-orange"></div>
          <div className="note-content orange">
            <span className="note-number">🎯</span>
            <h3 className="note-title">Nuestra misión</h3>
            <p className="note-desc">
              Crear soluciones tecnológicas que permitan gestionar información de manera rápida, organizada y eficiente, brindando una experiencia agradable para nuestros usuarios.
            </p>
          </div>
        </div>

        <div className="sticky-note rotate-2">
          <div className="pin pin-blue"></div>
          <div className="note-content blue">
            <span className="note-number">🔭</span>
            <h3 className="note-title">Nuestra visión</h3>
            <p className="note-desc">
              Convertir nuestro proyecto en una plataforma moderna, escalable y confiable que pueda adaptarse a las necesidades de diferentes usuarios y organizaciones.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Nuestros Valores (Grid de 4 notas adhesivas) */}
      <div className="about-header-container" style={{ marginTop: '5rem', marginBottom: '1rem' }}>
        <span className="about-tag">NUESTROS VALORES</span>
        <h2 className="hero-title" style={{ fontSize: '2.5rem' }}>Lo que nos representa</h2>
        <p className="hero-subtitle" style={{ marginTop: '0.5rem' }}>Principios que guían nuestro trabajo y desarrollo.</p>
      </div>

      <div className="values-notes-grid">
        <div className="sticky-note -rotate-3">
          <div className="pin pin-orange"></div>
          <div className="note-content orange">
            <span className="note-number">💡</span>
            <h3 className="note-title" style={{ fontSize: '1.1rem' }}>Innovación</h3>
            <p className="note-desc">Buscamos nuevas ideas y formas de mejorar nuestras soluciones.</p>
          </div>
        </div>

        <div className="sticky-note rotate-2">
          <div className="pin pin-purple"></div>
          <div className="note-content purple">
            <span className="note-number">💛</span>
            <h3 className="note-title" style={{ fontSize: '1.1rem' }}>Trabajo en equipo</h3>
            <p className="note-desc">Colaboramos para alcanzar objetivos y resolver problemas.</p>
          </div>
        </div>

        <div className="sticky-note -rotate-2">
          <div className="pin pin-blue"></div>
          <div className="note-content blue">
            <span className="note-number">⚡</span>
            <h3 className="note-title" style={{ fontSize: '1.1rem' }}>Eficiencia</h3>
            <p className="note-desc">Desarrollamos soluciones rápidas, organizadas y funcionales.</p>
          </div>
        </div>

        <div className="sticky-note rotate-3">
          <div className="pin pin-orange"></div>
          <div className="note-content orange">
            <span className="note-number">🛡️</span>
            <h3 className="note-title" style={{ fontSize: '1.1rem' }}>Responsabilidad</h3>
            <p className="note-desc">Nos comprometemos con la calidad y seguridad de nuestro proyecto.</p>
          </div>
        </div>
      </div>

      {/* 5. Tecnologías utilizadas */}
      <div className="tech-container">
        <span className="about-tag">TECNOLOGÍA</span>
        <h2 className="hero-title" style={{ fontSize: '2.25rem' }}>Herramientas que utilizamos</h2>
        <p className="hero-subtitle" style={{ marginTop: '0.5rem' }}>
          Nuestro proyecto se desarrolla utilizando tecnologías actuales para crear una experiencia moderna y funcional.
        </p>
        <div className="tech-badges-list">
          <span className="tech-pill">React</span>
          <span className="tech-pill">TypeScript</span>
          <span className="tech-pill">CSS3</span>
          <span className="tech-pill">JavaScript</span>
          <span className="tech-pill">HTML5</span>
        </div>
      </div>

      {/* 6. Banner de Cierre */}
      <div className="about-banner-card">
        <div className="pin pin-purple"></div>
        <h3 className="about-banner-title">✨ Construimos pensando en el futuro</h3>
        <p className="hero-subtitle" style={{ marginTop: 0 }}>
          Cada parte del proyecto representa nuestro aprendizaje, creatividad y compromiso con el desarrollo de soluciones tecnológicas.
        </p>
      </div>
    </section>
  );
}

export default About;