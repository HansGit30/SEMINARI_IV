function Services() {
  return (
    <section className="page">
      {}
      <style>{`
        .services-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .services-header {
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

        .services-header h2 {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .services-header p {
          color: #94a3b8;
          font-size: 15px;
        }

        /* Barra de estadísticas superior (+20 Proyectos, +10 Soluciones, etc.) */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 16px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .stat-card h3 {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
        }

        .stat-card span {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Cuadrícula principal de Servicios */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .service-card {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 20px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .service-icon-box {
          width: 45px;
          height: 45px;
          background: #1e1b4b;
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .service-number {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        .service-info h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .service-info p {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .service-divider {
          width: 100%;
          height: 1px;
          background: rgba(168, 85, 247, 0.2);
          margin: 10px 0;
        }

        .service-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .feature-check {
          color: #38bdf8;
          font-size: 14px;
        }

        .service-btn {
          background: #1e1b4b;
          border: 1px solid rgba(168, 85, 247, 0.3);
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .service-btn:hover {
          background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
          border-color: transparent;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .services-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid, .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="services-container">
        {}
        <div className="services-header">
          <span className="section-tag">NUESTROS SERVICIOS</span>
          <h2>Soluciones digitales</h2>
          <p>Desarrollamos soluciones tecnológicas modernas para transformar ideas en proyectos funcionales.</p>
        </div>

        {}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>+20</h3>
            <span>Proyectos</span>
          </div>
          <div className="stat-card">
            <h3>+10</h3>
            <span>Soluciones</span>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <span>Compromiso</span>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <span>Disponibilidad</span>
          </div>
        </div>

        {}
        <div className="services-grid">
          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">💻</div>
                <span className="service-number">01</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Desarrollo Web</h3>
                <p>Creamos sitios web modernos, rápidos y adaptables a cualquier dispositivo.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> Diseño responsive</div>
                <div className="feature-item"><span className="feature-check">✓</span> Interfaz moderna</div>
                <div className="feature-item"><span className="feature-check">✓</span> Optimización web</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>

          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">⚙️</div>
                <span className="service-number">02</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Desarrollo de Software</h3>
                <p>Desarrollamos soluciones de software enfocadas en las necesidades de cada proyecto.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> Sistemas personalizados</div>
                <div className="feature-item"><span className="feature-check">✓</span> Automatización</div>
                <div className="feature-item"><span className="feature-check">✓</span> Mantenimiento</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>

          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">📊</div>
                <span className="service-number">03</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Análisis de Datos</h3>
                <p>Transformamos datos en información útil para facilitar la toma de decisiones.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> Reportes</div>
                <div className="feature-item"><span className="feature-check">✓</span> Estadísticas</div>
                <div className="feature-item"><span className="feature-check">✓</span> Visualización de datos</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>

          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">🤖</div>
                <span className="service-number">04</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Inteligencia Artificial</h3>
                <p>Integramos herramientas de inteligencia artificial para mejorar procesos y experiencias.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> Automatización</div>
                <div className="feature-item"><span className="feature-check">✓</span> Modelos inteligentes</div>
                <div className="feature-item"><span className="feature-check">✓</span> Asistentes virtuales</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>

          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">🔒</div>
                <span className="service-number">05</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Seguridad</h3>
                <p>Implementamos buenas prácticas para proteger la información y los sistemas.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> Protección de datos</div>
                <div className="feature-item"><span className="feature-check">✓</span> Control de acceso</div>
                <div className="feature-item"><span className="feature-check">✓</span> Buenas prácticas</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>

          {}
          <div className="service-card">
            <div>
              <div className="service-card-header">
                <div className="service-icon-box">📱</div>
                <span className="service-number">06</span>
              </div>
              <div className="service-info" style={{ marginTop: '15px' }}>
                <h3>Aplicaciones</h3>
                <p>Diseñamos aplicaciones funcionales con interfaces intuitivas y fáciles de utilizar.</p>
              </div>
              <div className="service-divider"></div>
              <div className="service-features">
                <div className="feature-item"><span className="feature-check">✓</span> UI moderna</div>
                <div className="feature-item"><span className="feature-check">✓</span> Experiencia de usuario</div>
                <div className="feature-item"><span className="feature-check">✓</span> Diseño adaptable</div>
              </div>
            </div>
            <a href="#ver" className="service-btn">Ver servicio <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
