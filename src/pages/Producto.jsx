import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShoppingCart, Truck, Shield, RotateCcw,
  Phone, MessageCircle, ChevronRight, Minus, Plus, Share2,
  Heart, CheckCircle, Package, Zap
} from 'lucide-react';
import { BRAND } from '../data/content';
import { PRODUCTS, formatPrice } from './Tienda';
import './Producto.css';

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  if (!product) {
    return (
      <main className="producto-page">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h2 className="heading-lg">Producto no encontrado</h2>
          <Link to="/tienda" className="producto-back-btn" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  if (related.length < 4) {
    const extra = PRODUCTS.filter(p => p.id !== product.id && !related.includes(p)).slice(0, 4 - related.length);
    related.push(...extra);
  }

  const whatsappMsg = `Hola, me interesa el producto: ${product.name} (${product.brand}) - ${formatPrice(product.price)}. ¿Está disponible?`;

  const FEATURES = [
    { icon: Truck, label: 'Envío gratis', desc: 'A todo Colombia' },
    { icon: Shield, label: 'Garantía', desc: '1 año de fábrica' },
    { icon: RotateCcw, label: 'Devolución', desc: '30 días sin costo' },
    { icon: Package, label: 'Original', desc: '100% certificado' },
  ];

  return (
    <main className="producto-page">
      {/* Breadcrumb */}
      <div className="producto-breadcrumb-wrap">
        <div className="container producto-breadcrumb">
          <Link to="/">Inicio</Link>
          <ChevronRight size={12} />
          <Link to="/tienda">Tienda</Link>
          <ChevronRight size={12} />
          <span>{product.brand}</span>
          <ChevronRight size={12} />
          <span className="current">{product.name}</span>
        </div>
      </div>

      {/* Product Hero */}
      <section className="producto-hero">
        <div className="container producto-hero-grid">
          {/* Gallery */}
          <div className="producto-gallery">
            <div className="producto-gallery-main">
              <img src={product.img} alt={product.name} />
            </div>
            <div className="producto-gallery-thumbs">
              <div className="producto-thumb active">
                <img src={product.img} alt={product.name} />
              </div>
              <div className="producto-thumb">
                <img src={product.img} alt={product.name} style={{ opacity: 0.6 }} />
              </div>
              <div className="producto-thumb">
                <img src={product.img} alt={product.name} style={{ opacity: 0.4 }} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="producto-info">
            <span className="producto-brand-tag">{product.brand}</span>
            <h1 className="producto-title">{product.name}</h1>

            <div className="producto-rating-row">
              <div className="producto-stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.round(product.rating) ? '#F7BC21' : 'none'} stroke={s <= Math.round(product.rating) ? 'none' : 'var(--clr-text-3)'} />
                ))}
              </div>
              <span className="producto-rating-text">{product.rating} ({product.reviews} reseñas)</span>
              <span className="producto-stock"><CheckCircle size={12} /> En stock</span>
            </div>

            <div className="producto-price-block">
              <span className="producto-price">{formatPrice(product.price)}</span>
              <span className="producto-tax">IVA incluido</span>
            </div>

            <p className="producto-desc">{product.desc}</p>

            {/* Quantity + CTA */}
            <div className="producto-actions">
              <div className="producto-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="producto-qty-btn"><Minus size={14} /></button>
                <span className="producto-qty-num">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="producto-qty-btn"><Plus size={14} /></button>
              </div>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="producto-cta-btn"
              >
                <ShoppingCart size={18} /> Cotizar por WhatsApp
              </a>
            </div>

            <div className="producto-secondary-actions">
              <button className="producto-sec-btn"><Heart size={14} /> Guardar</button>
              <button className="producto-sec-btn"><Share2 size={14} /> Compartir</button>
              <a href={`tel:${BRAND.phone}`} className="producto-sec-btn"><Phone size={14} /> Llamar</a>
            </div>

            {/* Trust Badges */}
            <div className="producto-trust">
              {FEATURES.map((f, i) => (
                <div key={i} className="producto-trust-item">
                  <f.icon size={18} />
                  <div>
                    <span className="producto-trust-label">{f.label}</span>
                    <span className="producto-trust-desc">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="producto-tabs-section">
        <div className="container">
          <div className="producto-tabs">
            {[
              { id: 'desc', label: 'Descripción' },
              { id: 'specs', label: 'Especificaciones' },
              { id: 'shipping', label: 'Envíos' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`producto-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="producto-tab-content">
            {activeTab === 'desc' && (
              <div className="producto-tab-panel">
                <h3>Acerca de este producto</h3>
                <p>{product.desc}</p>
                <p>Producto original {product.brand} con garantía de fábrica. Respaldado por la red de distribución de Maqte Colombia con soporte técnico y repuestos disponibles.</p>
                <ul>
                  <li>Producto 100% original con certificación de marca</li>
                  <li>Garantía de 1 año por defectos de fabricación</li>
                  <li>Soporte técnico especializado</li>
                  <li>Repuestos y accesorios disponibles</li>
                </ul>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="producto-tab-panel">
                <h3>Especificaciones técnicas</h3>
                <table className="producto-specs-table">
                  <tbody>
                    <tr><td>Marca</td><td>{product.brand}</td></tr>
                    <tr><td>Modelo</td><td>{product.name}</td></tr>
                    <tr><td>Categoría</td><td style={{ textTransform: 'capitalize' }}>{product.category}</td></tr>
                    <tr><td>Garantía</td><td>1 año de fábrica</td></tr>
                    <tr><td>Condición</td><td>Nuevo, sellado de fábrica</td></tr>
                    <tr><td>Certificación</td><td>Original {product.brand}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="producto-tab-panel">
                <h3>Información de envío</h3>
                <div className="producto-shipping-grid">
                  <div className="producto-shipping-card">
                    <Truck size={20} />
                    <h4>Envío a todo Colombia</h4>
                    <p>Cubrimos las principales ciudades y municipios. Envíos por transportadora de confianza.</p>
                  </div>
                  <div className="producto-shipping-card">
                    <Zap size={20} />
                    <h4>Despacho en 24-48h</h4>
                    <p>Procesamos tu pedido y despachamos en máximo 2 días hábiles.</p>
                  </div>
                  <div className="producto-shipping-card">
                    <RotateCcw size={20} />
                    <h4>Devolución gratuita</h4>
                    <p>30 días para devolución sin costo si el producto no cumple tus expectativas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="producto-related section-pad">
        <div className="container">
          <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>
            Productos <span style={{ color: 'var(--clr-orange)' }}>relacionados</span>
          </h2>
          <div className="producto-related-grid">
            {related.map(p => (
              <Link to={`/producto/${p.id}`} key={p.id} className="producto-related-card">
                <div className="producto-related-img">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <div className="producto-related-info">
                  <span className="producto-related-brand">{p.brand}</span>
                  <h4 className="producto-related-name">{p.name}</h4>
                  <div className="producto-related-bottom">
                    <span className="producto-related-price">{formatPrice(p.price)}</span>
                    <span className="producto-related-rating">
                      <Star size={10} fill="#F7BC21" stroke="none" /> {p.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
