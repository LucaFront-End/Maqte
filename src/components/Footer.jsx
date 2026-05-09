import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, Zap } from 'lucide-react';
import { BRAND, CATEGORIES, NAV_LINKS } from '../data/content';
import './Footer.css';

// Brand SVG icons (lucide-react removed brand icons in v1+)
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" />

      <div className="container">
        {/* Top CTA Band */}
        <div className="footer-cta-band">
          <div className="footer-cta-text">
            <span className="label-upper">¿Necesitas asesoría?</span>
            <h3 className="heading-lg">Estamos listos para ayudarte</h3>
            <p style={{ color: 'var(--clr-text-2)', marginTop: '0.5rem', maxWidth: '500px' }}>
              Nuestro equipo de expertos te orienta para elegir el equipo o herramienta perfecta para tu proyecto.
            </p>
          </div>
          <div className="footer-cta-actions">
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=Hola, necesito asesoría sobre productos`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <Zap size={16} /> Chatear por WhatsApp
            </a>
            <Link to="/contacto" className="btn btn-outline">
              Formulario de Contacto
            </Link>
          </div>
        </div>

        <div className="footer-glow-line" />

        {/* Main Grid */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#F7BC21"/>
                <path d="M8 24V8l8 10 8-10v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <div className="footer-logo-main">MAQTE</div>
                <div className="footer-logo-sub">COLOMBIA</div>
              </div>
            </div>
            <p className="footer-brand-desc">
              {BRAND.description}
            </p>
            <div className="footer-contact-list">
              <a href={`https://maps.google.com/?q=${BRAND.address}`} target="_blank" rel="noreferrer" className="footer-contact-item">
                <MapPin size={14} className="footer-contact-icon" />
                {BRAND.address}
              </a>
              <a href={`tel:${BRAND.phone}`} className="footer-contact-item">
                <Phone size={14} className="footer-contact-icon" />
                {BRAND.phone}
              </a>
              <a href={`mailto:${BRAND.email}`} className="footer-contact-item">
                <Mail size={14} className="footer-contact-icon" />
                {BRAND.email}
              </a>
            </div>
            <div className="footer-socials">
              <a href={BRAND.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="footer-social-btn">
                <InstagramIcon size={18} />
              </a>
              <a href={BRAND.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="footer-social-btn">
                <FacebookIcon size={18} />
              </a>
              <a href={BRAND.socials.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="footer-social-btn">
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-links">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="footer-link">
                    <ChevronRight size={12} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-col-title">Categorías</h4>
            <ul className="footer-links">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={cat.slug} className="footer-link">
                    <ChevronRight size={12} /> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4 className="footer-col-title">Información</h4>
            <ul className="footer-links">
              <li><Link to="/politicas-de-privacidad" className="footer-link"><ChevronRight size={12} /> Políticas de Privacidad</Link></li>
              <li><Link to="/terminos-y-condiciones" className="footer-link"><ChevronRight size={12} /> Términos y Condiciones</Link></li>
              <li><Link to="/garantias" className="footer-link"><ChevronRight size={12} /> Garantías</Link></li>
              <li><Link to="/metodos-de-pago" className="footer-link"><ChevronRight size={12} /> Métodos de Pago</Link></li>
              <li><Link to="/envios" className="footer-link"><ChevronRight size={12} /> Envíos Nacionales</Link></li>
              <li><Link to="/blog" className="footer-link"><ChevronRight size={12} /> Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} Maqte Colombia. Todos los derechos reservados.
          </p>
          <p className="footer-credits">
            Hecho con 🧡 en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
