function About() {
  return (
    <section className="page">
      {}
      <style>{`
        .about-container {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }

        .about-header {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-tag {
          color: #f43f5e;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .about-card-large, .about-card-medium, .about-banner {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .about-card-large h3, .about-card-medium h3, .about-header h2, .values-header h2, .tech-header h2, .about-banner h3 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }

        .about-card-large p, .about-card-medium p, .about-header p, .values-header p, .tech-header p, .about-banner p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .about-grid-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        /* Cuadrícula de 4 valores */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .value-card {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 16px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .value-card h4 {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }

        .value-card p {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Sección de tecnologías */
        .tech-section {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 20px;
          padding: 35px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tech-content-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .tech-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .tech-badge {
          background: #1e1b4b;
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #cbd5e1;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .values-grid {
            grid-template-columns: 1fr 1fr;
          }
          .about-grid-two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-container">
        {}
        <div className="about-header">
          <span className="section-tag">SOBRE NOSOTROS</span>
          <h2>Conoce nuestro proyecto</h2>
          <p>Somos un equipo enfocado en crear soluciones digitales modernas, eficientes y fáciles de utilizar.</p>
        </div>

        {}
        <div className="about-card-large">
          <div className="card-icon">🚀</div>
          <h3>¿Quiénes somos?</h3>
          <p>Somos un equipo de estudiantes y desarrolladores interesados en la tecnología, el desarrollo de software y la creación de experiencias digitales. Nuestro proyecto busca combinar funcionalidad, diseño y tecnología para ofrecer una plataforma útil y sencilla.</p>
          <p>Trabajamos utilizando herramientas modernas de desarrollo web y aplicando buenas prácticas para construir una aplicación organizada, responsive y fácil de mantener.</p>
        </div>

        {}
        <div className="about-grid-two">
          <div className="about-card-medium">
            <div className="card-icon">🎯</div>
            <h3>Nuestra misión</h3>
            <p>Crear soluciones tecnológicas que permitan gestionar información de manera rápida, organizada y eficiente, brindando una experiencia agradable para nuestros usuarios.</p>
          </div>
          <div className="about-card-medium">
            <div className="card-icon">🔭</div>
            <h3>Nuestra visión</h3>
            <p>Convertir nuestro proyecto en una plataforma moderna, escalable y confiable que pueda adaptarse a las necesidades de diferentes usuarios y organizaciones.</p>
          </div>
        </div>

        {}
        <div className="about-header" style={{ gap: '15px' }}>
          <div>
            <span className="section-tag">NUESTROS VALORES</span>
            <h2>Lo que nos representa</h2>
          </div>
          <p>Principios que guían nuestro trabajo y desarrollo.</p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="card-icon">💡</div>
            <h4>Innovación</h4>
            <p>Buscamos nuevas ideas y formas de mejorar nuestras soluciones.</p>
          </div>
          <div className="value-card">
            <div className="card-icon">💛</div>
            <h4>Trabajo en equipo</h4>
            <p>Colaboramos para alcanzar objetivos y resolver problemas.</p>
          </div>
          <div className="value-card">
            <div className="card-icon">⚡</div>
            <h4>Eficiencia</h4>
            <p>Desarrollamos soluciones rápidas, organizadas y funcionales.</p>
          </div>
          <div className="value-card">
            <div className="card-icon">🛡️</div>
            <h4>Responsabilidad</h4>
            <p>Nos comprometemos con la calidad y seguridad de nuestro proyecto.</p>
          </div>
        </div>

        {}
        <div className="tech-section">
          <div>
            <span className="section-tag">TECNOLOGÍA</span>
            <h2>Herramientas que utilizamos</h2>
          </div>
          <div className="tech-content-row">
            <p>Nuestro proyecto se desarrolla utilizando tecnologías actuales para crear una experiencia moderna y funcional.</p>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">CSS</span>
              <span className="tech-badge">JavaScript</span>
              <span className="tech-badge">HTML</span>
            </div>
          </div>
        </div>

        {}
        <div className="about-banner">
          <div className="card-icon">✨</div>
          <h3>Construimos pensando en el futuro</h3>
          <p>Cada parte del proyecto representa nuestro aprendizaje, creatividad y compromiso con el desarrollo de soluciones tecnológicas.</p>
        </div>
      </div>
    </section>
  );
}

export default About;