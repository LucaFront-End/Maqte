import { useState, useEffect } from 'react';
import { X, Download, BookOpen, Check, ShieldCheck } from 'lucide-react';
import './CatalogModal.css';

export default function CatalogModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '+57 ', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Open modal automatically after 5 seconds if not dismissed in session
    const hasSeen = sessionStorage.getItem('maqte_catalog_modal_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('maqte_catalog_modal_seen', 'true');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSubmitted(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("https://formsubmit.co/ajax/contacto@maqtecolombia.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Solicitud: "Descarga de Catálogo Oficial 2026",
          Nombre: formData.name,
          Teléfono: formData.phone,
          Email: formData.email,
          _template: "table",
          _captcha: "false",
          _language: "es",
          _subject: "Nueva solicitud de Catálogo — Maqte Colombia"
        })
      });
      setSubmitted(true);
      sessionStorage.setItem('maqte_catalog_modal_seen', 'true');
    } catch (err) {
      console.error("Error al solicitar catálogo:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    // Trigger download / view of catalog
    window.open('/images/maquinas/hero_showcase.png', '_blank');
  };

  return (
    <>
      {/* Floating Badge Trigger Button */}
      <button className="catalog-float-btn" onClick={handleOpen} title="Descargar Catálogo Oficial">
        <BookOpen size={18} />
        <span>Catálogo 2026</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="catalog-modal-overlay" onClick={handleClose}>
          <div className="catalog-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="catalog-modal-close" onClick={handleClose} aria-label="Cerrar">
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <div className="catalog-modal-header">
                  <span className="catalog-modal-badge">
                    <BookOpen size={14} /> EDICIÓN OFICIAL 2026
                  </span>
                  <h3 className="catalog-modal-title">
                    Descarga nuestro <span className="catalog-title-gold">Catálogo Completo</span>
                  </h3>
                  <p className="catalog-modal-sub">
                    Accede a las fichas técnicas, especificaciones y precios de nuestras 5 líneas de maquinaria bloquera y equipos industriales en Colombia.
                  </p>
                </div>

                <form className="catalog-modal-form" onSubmit={handleSubmit}>
                  <div className="catalog-form-field">
                    <label htmlFor="cat-name">Nombre completo</label>
                    <input
                      id="cat-name"
                      name="name"
                      type="text"
                      className="input"
                      placeholder="Ej. Carlos Rodríguez"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="catalog-form-field">
                    <label htmlFor="cat-phone">Teléfono / WhatsApp (Colombia)</label>
                    <input
                      id="cat-phone"
                      name="phone"
                      type="tel"
                      className="input"
                      placeholder="+57 311 000 0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="catalog-form-field">
                    <label htmlFor="cat-email">Correo electrónico</label>
                    <input
                      id="cat-email"
                      name="email"
                      type="email"
                      className="input"
                      placeholder="tu@empresa.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary catalog-submit-btn" disabled={isSubmitting}>
                    <Download size={18} />
                    {isSubmitting ? 'Procesando...' : 'Obtener Catálogo en PDF'}
                  </button>

                  <div className="catalog-form-footer">
                    <ShieldCheck size={14} /> Datos protegidos. Te enviaremos información técnica directa.
                  </div>
                </form>
              </>
            ) : (
              <div className="catalog-success-box">
                <div className="catalog-success-icon">
                  <Check size={28} />
                </div>
                <h3 className="catalog-modal-title">¡Solicitud recibida con éxito!</h3>
                <p className="catalog-modal-sub">
                  Gracias por tu interés en Maqte Colombia. Ya puedes descargar nuestro catálogo en formato digital.
                </p>

                <button className="btn btn-primary catalog-submit-btn" onClick={handleDownloadPdf}>
                  <Download size={18} /> Abrir / Descargar Catálogo PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
