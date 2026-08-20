function Contact() {
  return (
    <section className="page">
      {}
      <style>{`
        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .contact-header {
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

        .contact-header h2 {
          font-size: 38px;
          font-weight: 800;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .contact-header p {
          color: #94a3b8;
          font-size: 15px;
        }

        /* Cuadrícula principal de Contacto (2 columnas) */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }

        .contact-card, .form-card {
          background: #16103a;
          border: 1px solid rgba(168, 85, 247, 0.25);
          border-radius: 20px;
          padding: 35px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-info-group {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .contact-icon-box {
          width: 40px;
          height: 40px;
          background: #1e1b4b;
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .contact-details span {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 2px;
        }

        .contact-details p {
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
        }

        .contact-divider {
          width: 100%;
          height: 1px;
          background: rgba(168, 85, 247, 0.2);
        }

        /* Estilos del formulario */
        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          color: #cbd5e1;
          font-weight: 500;
        }

        .form-control {
          background: #110d2b;
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 10px;
          padding: 12px 15px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          border-color: #c084fc;
          box-shadow: 0 0 10px rgba(192, 132, 252, 0.3);
        }

        textarea.form-control {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
          color: #ffffff;
          border: none;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
        }

        .submit-btn:hover {
          opacity: 0.9;
          box-shadow: 0 0 20px rgba(219, 39, 119, 0.6);
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .form-group-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="contact-container">
        {}
        <div className="contact-header">
          <span className="section-tag">PONTE EN CONTACTO</span>
          <h2>Hablemos de tu proyecto</h2>
          <p>Estamos aquí para escuchar tus ideas, resolver tus dudas y ayudarte a convertirlas en soluciones digitales.</p>
        </div>

        {}
        <div className="contact-grid">
          {}
          <div className="contact-card">
            <div>
              <h3>Información de contacto</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '5px' }}>Encuentra diferentes formas de comunicarte con nosotros.</p>
            </div>
            
            <div className="contact-divider"></div>

            <div className="contact-info-group">
              <div className="contact-item">
                <div className="contact-icon-box">✉️</div>
                <div className="contact-details">
                  <span>Correo electrónico</span>
                  <p>contacto@proyecto.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">📞</div>
                <div className="contact-details">
                  <span>Teléfono</span>
                  <p>+51 990 326 787</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">📍</div>
                <div className="contact-details">
                  <span>Ubicación</span>
                  <p>Lima, Perú</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-box">⏰</div>
                <div className="contact-details">
                  <span>Horario</span>
                  <p>Lunes - Viernes, 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="form-card">
            <div>
              <span className="section-tag">ENVÍANOS UN MENSAJE</span>
              <h3 style={{ fontSize: '22px', color: '#ffffff', marginTop: '5px' }}>Cuéntanos qué necesitas</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '5px' }}>Completa el formulario y nos pondremos en contacto contigo.</p>
            </div>

            <div className="contact-divider"></div>

            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" className="form-control" placeholder="Tu nombre" />
                </div>
                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input type="email" className="form-control" placeholder="correo@ejemplo.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Asunto</label>
                <input type="text" className="form-control" placeholder="¿En qué podemos ayudarte?" />
              </div>

              <div className="form-group">
                <label>Mensaje</label>
                <textarea className="form-control" placeholder="Escribe tu mensaje..."></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Enviar mensaje <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;