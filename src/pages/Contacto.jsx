import { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle, Clock, Zap } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BRAND } from '../data/content';
import './Contacto.css';

export default function Contacto() {
  useScrollReveal('.contact-reveal');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 2: integrate with Wix Headless API
    setSent(true);
  };

  return (
    <main>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="reveal contact-reveal">
            <span className="label-upper">Estamos aquí</span>
            <h1 className="display-lg" style={{ marginTop: '0.5rem' }}>
              Contáct<span style={{ color: 'var(--clr-orange)' }}>anos</span>
            </h1>
            <p style={{ color: 'var(--clr-text-2)', marginTop: '1rem', maxWidth: '560px', fontSize: '1.05rem' }}>
              Nuestro equipo está listo para asesorarte. Cuéntanos tu proyecto y te ayudamos a encontrar la solución ideal.
            </p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container contact-grid">

          {/* Info Panel */}
          <div className="contact-info">
            <div className="reveal contact-reveal">
              <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
                Información de contacto
              </h2>
              <p style={{ color: 'var(--clr-text-2)', marginBottom: '2rem' }}>
                Múltiples canales para atenderte de la mejor manera.
              </p>
            </div>

            <div className="contact-info-items">
              <div className="contact-info-card reveal contact-reveal reveal-delay-1">
                <div className="contact-info-icon"><MapPin size={22} /></div>
                <div>
                  <div className="contact-info-label">Dirección</div>
                  <div className="contact-info-value">{BRAND.address}</div>
                </div>
              </div>
              <a href={`tel:${BRAND.phone}`} className="contact-info-card reveal contact-reveal reveal-delay-2">
                <div className="contact-info-icon"><Phone size={22} /></div>
                <div>
                  <div className="contact-info-label">Teléfono</div>
                  <div className="contact-info-value">{BRAND.phone}</div>
                </div>
              </a>
              <a href={`mailto:${BRAND.email}`} className="contact-info-card reveal contact-reveal reveal-delay-3">
                <div className="contact-info-icon"><Mail size={22} /></div>
                <div>
                  <div className="contact-info-label">Email</div>
                  <div className="contact-info-value">{BRAND.email}</div>
                </div>
              </a>
              <div className="contact-info-card reveal contact-reveal reveal-delay-4">
                <div className="contact-info-icon"><Clock size={22} /></div>
                <div>
                  <div className="contact-info-label">Horario</div>
                  <div className="contact-info-value">Lun–Sáb: 8am – 6pm</div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hola, me comunico desde el sitio web`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-cta reveal contact-reveal reveal-delay-5"
            >
              <MessageCircle size={22} />
              <div>
                <div className="whatsapp-cta-title">Chat por WhatsApp</div>
                <div className="whatsapp-cta-sub">Respuesta en minutos</div>
              </div>
              <Zap size={18} style={{ marginLeft: 'auto', opacity: 0.7 }} />
            </a>
          </div>

          {/* Form */}
          <div className="contact-form-wrap reveal contact-reveal">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">✅</div>
                <h3 className="heading-md">¡Mensaje enviado!</h3>
                <p style={{ color: 'var(--clr-text-2)', marginTop: '0.5rem' }}>
                  Te responderemos en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3 className="heading-md" style={{ marginBottom: '1.75rem' }}>Envíanos un mensaje</h3>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-label" htmlFor="contact-name">Nombre completo</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className="input"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-label" htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className="input"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-label" htmlFor="contact-phone">Teléfono</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="input"
                      placeholder="+57 300 000 0000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-label" htmlFor="contact-subject">Asunto</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      className="input"
                      placeholder="Cotización, consulta..."
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="contact-form-group">
                  <label className="contact-label" htmlFor="contact-message">Mensaje</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className="input"
                    style={{ resize: 'vertical', minHeight: '130px' }}
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} /> Enviar mensaje
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
