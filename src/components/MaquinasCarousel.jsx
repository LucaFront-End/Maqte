import { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ShoppingBag, MessageCircle,
  Eye, Sparkles, ArrowRight
} from 'lucide-react';
import { BRAND, MACHINE_CATALOG_2026 } from '../data/content';
import './MaquinasCarousel.css';

const CAROUSEL_FILTERS = [
  { id: 'all', label: 'Todas (10)' },
  { id: 'artesanal', label: 'Artesanal' },
  { id: 'semiindustrial', label: 'Semiindustrial' },
  { id: 'hidraulica-compacta', label: 'Hidráulica Compacta' },
  { id: 'hidraulica-industrial', label: 'Industrial / PLC' },
  { id: 'complementarios', label: 'Complementarios' },
];

export default function MaquinasCarousel({
  excludeId = null,
  title = 'Explora nuestra',
  highlight = 'Maquinaria en Detalle',
  subtitle = 'Compara precios, inicia tu compra directa, solicita cotización formal o entra a la página individual de cada equipo.',
}) {
  const trackRef = useRef(null);
  const [lineFilter, setLineFilter] = useState('all');

  const items = useMemo(() => {
    return MACHINE_CATALOG_2026.filter(item => {
      if (excludeId && item.id === excludeId) return false;
      if (lineFilter !== 'all' && item.lineId !== lineFilter) return false;
      return true;
    });
  }, [excludeId, lineFilter]);

  const scrollTrack = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = 350;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="mq-carousel-section">
      <div className="container">
        <div className="mq-carousel-top">
          <div>
            <span className="mq-carousel-eyebrow">
              <Sparkles size={13} /> Catálogo Interactivo 2026 · Páginas de Producto
            </span>
            <h2 className="mq-carousel-title">
              {title} <span>{highlight}</span>
            </h2>
            <p className="mq-carousel-sub">{subtitle}</p>
          </div>

          <div className="mq-carousel-controls">
            <div className="mq-carousel-pills">
              {CAROUSEL_FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`mq-carousel-pill ${lineFilter === f.id ? 'active' : ''}`}
                  onClick={() => setLineFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="mq-carousel-arrows">
              <button
                type="button"
                className="mq-carousel-arrow"
                onClick={() => scrollTrack(-1)}
                aria-label="Anterior"
              >
                <ChevronLeft size={19} />
              </button>
              <button
                type="button"
                className="mq-carousel-arrow"
                onClick={() => scrollTrack(1)}
                aria-label="Siguiente"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        </div>

        <div className="mq-carousel-track" ref={trackRef}>
          {items.map(item => {
            const buyWhatsappMsg = `SW- Hola Maqte Colombia, quiero COMPRAR la Ficha ${item.code}: ${item.name} (${item.price}). Por favor indíquenme los datos de pago y despacho.`;

            return (
              <article key={item.id} className="mq-carousel-card">
                <Link to={`/maquinas/${item.id}`} className="mq-carousel-img-wrap">
                  <div className="mq-carousel-badges">
                    <span className="mq-carousel-code">FICHA {item.code}</span>
                    <span className="mq-carousel-line">{item.line}</span>
                  </div>
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div className="mq-carousel-img-hover">
                    <span>
                      <Eye size={15} /> Ver página del producto
                    </span>
                  </div>
                </Link>

                <div className="mq-carousel-body">
                  <Link to={`/maquinas/${item.id}`} className="mq-carousel-name-link">
                    <h3 className="mq-carousel-name">{item.name}</h3>
                  </Link>
                  <p className="mq-carousel-desc">{item.description}</p>

                  <div className="mq-carousel-price-box">
                    <div>
                      <span className="mq-carousel-price-lbl">Precio Base</span>
                      <strong className="mq-carousel-price-val">{item.price}</strong>
                      {item.previousPrice && (
                        <del className="mq-carousel-price-old">{item.previousPrice}</del>
                      )}
                    </div>
                    {item.equippedPrice && (
                      <div className="mq-carousel-equipped-pill">
                        <span>Línea Equipada</span>
                        <strong>{item.equippedPrice}</strong>
                      </div>
                    )}
                  </div>

                  {/* 3 Action Buttons: Comprar, Cotizar, Ver detalles */}
                  <div className="mq-carousel-actions">
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(buyWhatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mq-c-btn mq-c-btn-buy"
                    >
                      <ShoppingBag size={14} /> Comprar
                    </a>
                    <a
                      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(item.whatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mq-c-btn mq-c-btn-quote"
                    >
                      <MessageCircle size={14} /> Cotizar
                    </a>
                    <Link
                      to={`/maquinas/${item.id}`}
                      className="mq-c-btn mq-c-btn-details"
                    >
                      <Eye size={14} /> Ver detalles <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

