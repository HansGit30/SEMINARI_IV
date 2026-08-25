import React from 'react';

function Contact() {
  return (
    <section className="hero-section">
      <style>{`
        /* ENCABEZADO CONTACTO */
        .contact-header-container {
          max-width: 1000px;
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .contact-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #db2777;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        /* GRID PRINCIPAL (2 COLUMNAS) */
        .contact-notebook-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 2.5rem;
          max-width: 1000px;
          width: 100%;
          align-items: start;
        }

        /* TARJETA DE INFORMACIÓN (Estilo Sticky Note Grande) */
        .contact-info-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .contact-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .contact-card-sub {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        .contact-divider-line {
          height: 1px;
          background: #f1f5f9;
          margin: 1.25rem 0;
          border: none;
        }

        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .contact-icon-box {
          width: 42px;
          height: 42px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .contact-details-text span {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-details-text p {
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 600;
          margin: 0;
        }

        /* FORMULARIO ESTILO CUADERNO */
        .contact-form-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 1.25rem;
          padding: 2.25rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          position: relative;
        }

        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .form-field-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
        }

        .notebook-input {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          color: #0f172a;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }

        .notebook-input:focus {
          border-color: #9333ea;
          box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.15);
          background-color: #ffffff;
        }

        textarea.notebook-input {
          resize: vertical;
          min-height: 110px;
        }

        .notebook-submit-btn {
          width: 100%;
          background-color: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.85rem 1.5rem;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }

        .notebook-submit-btn:hover {
          background-color: #9333ea;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(147, 51, 234, 0.25);
        }

        @media (max-width: 900px) {
          .contact-notebook-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Encabezado Principal */}
      <div className="contact-header-container">
        <span className="contact-tag">PONTE EN CONTACTO</span>
        <h1 className="hero-title">
          Hablemos de tu{" "}
          <span className="inline-card shadow-purple">
            <span className="badge badge-purple">Proyecto</span>
            ✍️
          </span>
        </h1>
        <p className="hero-subtitle">
          Estamos aquí para escuchar tus ideas, resolver tus dudas y ayudarte a convertirlas en soluciones digitales.
        </p>
      </div>

      {/* Grid de Contacto estilo Hoja de Cuaderno */}
      <div className="contact-notebook-grid">
        
        {/* Columna Izquierda: Tarjeta de Datos con Chincheta Naranja */}
        <div className="contact-info-card -rotate-1">
          <div className="pin pin-orange"></div>
          
          <h3 className="contact-card-title">Información de contacto</h3>
          <p className="contact-card-sub">Encuentra diferentes formas de comunicarte con nosotros.</p>
          
          <div className="contact-divider-line"></div>

          <div className="contact-info-list">
            <div className="contact-item-row">
              <div className="contact-icon-box">✉️</div>
              <div className="contact-details-text">
                <span>Correo electrónico</span>
                <p>contacto@proyecto.com</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-icon-box">📞</div>
              <div className="contact-details-text">
                <span>Teléfono</span>
                <p>+51 990 326 787</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-icon-box">📍</div>
              <div className="contact-details-text">
                <span>Ubicación</span>
                <p>Lima, Perú</p>
              </div>
            </div>

            <div className="contact-item-row">
              <div className="contact-icon-box">⏰</div>
              <div className="contact-details-text">
                <span>Horario</span>
                <p>Lunes - Viernes, 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario con Chincheta Azul */}
        <div className="contact-form-card rotate-1">
          <div className="pin pin-blue"></div>

          <span className="contact-tag">ENVÍANOS UN MENSAJE</span>
          <h3 className="contact-card-title">Cuéntanos qué necesitas</h3>
          <p className="contact-card-sub">Completa el formulario y nos pondremos en contacto contigo.</p>
          
          <div className="contact-divider-line"></div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row-2col">
              <div className="form-field-group">
                <label>Nombre</label>
                <input type="text" className="notebook-input" placeholder="Tu nombre" />
              </div>
              <div className="form-field-group">
                <label>Correo electrónico</label>
                <input type="email" className="notebook-input" placeholder="correo@ejemplo.com" />
              </div>
            </div>

            <div className="form-field-group">
              <label>Asunto</label>
              <input type="text" className="notebook-input" placeholder="¿En qué podemos ayudarte?" />
            </div>

            <div className="form-field-group">
              <label>Mensaje</label>
              <textarea className="notebook-input" placeholder="Escribe tu mensaje..."></textarea>
            </div>

            <button type="submit" className="notebook-submit-btn">
              Enviar mensaje <span>→</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

export default Contact;