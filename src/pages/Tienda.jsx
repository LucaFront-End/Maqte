import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, SlidersHorizontal, Grid, LayoutList,
  Star, ShoppingCart, Eye, Flame, Sparkles, Percent, ChevronDown
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CATEGORIES, BRAND } from '../data/content';
import { CategoryIcon } from '../components/IconMap';
import './Tienda.css';

/* ─── Product Catalog Data ─────────────────────────────── */
const PRODUCTS = [
  { id: 'bosch-gsb13re', name: 'Taladro Percutor GSB 13 RE', brand: 'Bosch', category: 'herramientas', price: 289900, badge: 'hot', rating: 4.8, reviews: 124, img: '/images/products/bosch-gsb13re.png', desc: '800W de potencia. Ideal para concreto, madera y metal.' },
  { id: 'dewalt-d25133k', name: 'Rotomartillo SDS Plus D25133K', brand: 'DeWalt', category: 'herramientas', price: 689000, badge: 'new', rating: 4.9, reviews: 87, img: '/images/products/dewalt-d25133k.jpg', desc: '800W, 3 modos. Perforación profesional en concreto.' },
  { id: 'makita-ga4530', name: 'Amoladora GA4530 4½"', brand: 'Makita', category: 'herramientas', price: 199900, badge: null, rating: 4.7, reviews: 203, img: '/images/products/makita-ga4530.png', desc: '720W, compacta y liviana. Corte y desbaste profesional.' },
  { id: 'husqvarna-143r', name: 'Guadaña a Gasolina 143R-II', brand: 'Husqvarna', category: 'agro', price: 1290000, badge: 'hot', rating: 4.9, reviews: 56, img: '/images/products/husqvarna-143r.webp', desc: '40.1cc, uso profesional. Eje recto, arnés incluido.' },
  { id: 'stihl-ms250', name: 'Motosierra MS 250', brand: 'Stihl', category: 'agro', price: 1850000, badge: null, rating: 5.0, reviews: 178, img: '/images/products/stihl-ms250.png', desc: '45.4cc, espada 18". La más vendida para uso forestal.' },
  { id: 'honda-ep2500', name: 'Generador Eléctrico EP2500', brand: 'Honda', category: 'maquinaria', price: 3200000, badge: 'new', rating: 4.8, reviews: 42, img: '/images/products/honda-ep2500.png', desc: '2.2kVA, motor GX160. Confiabilidad Honda garantizada.' },
  { id: 'karcher-k3', name: 'Hidrolavadora K3 Premium', brand: 'Karcher', category: 'maquinaria', price: 650000, badge: 'sale', rating: 4.6, reviews: 315, img: '/images/products/karcher-k3.jpg', desc: '120 bar, 380 L/H. Limpieza potente para hogar y taller.' },
  { id: 'ingco-mma200', name: 'Soldador Inversor MMA 200A', brand: 'Ingco', category: 'herramientas', price: 385000, badge: null, rating: 4.5, reviews: 92, img: '/images/products/ingco-mma200.png', desc: 'IGBT 200A, ciclo 60%. Electrodo hasta 4mm.' },
];

const SORT_OPTIONS = [
  { label: 'Más relevantes', value: 'relevance' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Mejor calificación', value: 'rating' },
];

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export { PRODUCTS, formatPrice };

export default function Tienda() {
  useScrollReveal('.tienda-reveal');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');

  /* Filter */
  let filtered = PRODUCTS.filter(p => {
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  /* Sort */
  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const filterCats = [
    { id: 'all', label: 'Todos' },
    ...CATEGORIES.filter(c => PRODUCTS.some(p => p.category === c.id)).map(c => ({ id: c.id, label: c.label }))
  ];

  return (
    <main className="tienda-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="reveal tienda-reveal">
            <span className="label-upper">Catálogo completo</span>
            <h1 className="display-lg" style={{ color: 'white', marginTop: '0.5rem' }}>
              Nuestra <span style={{ color: 'var(--clr-orange)' }}>Tienda</span>
            </h1>
            <p style={{ color: '#aaa', marginTop: '1rem', maxWidth: '560px', fontSize: '1.05rem' }}>
              {PRODUCTS.length} productos industriales con precios de distribuidor y envío a todo Colombia.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <section className="tienda-toolbar-wrap">
        <div className="container tienda-toolbar">
          <div className="tienda-toolbar-top">
            <div className="tienda-search">
              <Search size={16} className="tienda-search-icon" />
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="tienda-search-input"
              />
            </div>

            <div className="tienda-toolbar-right">
              <div className="tienda-sort">
                <SlidersHorizontal size={14} />
                <select value={sort} onChange={e => setSort(e.target.value)} className="tienda-sort-select">
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="tienda-view-toggle hide-mobile">
                <button className={`tienda-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                  <Grid size={16} />
                </button>
                <button className={`tienda-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                  <LayoutList size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="tienda-filters">
            {filterCats.map(c => (
              <button
                key={c.id}
                className={`tienda-filter-btn ${activeCategory === c.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-pad" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="tienda-results-header">
            <span className="tienda-results-count">
              {filtered.length} producto{filtered.length !== 1 && 's'}
            </span>
          </div>

          <div className={`tienda-products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filtered.map((product, i) => (
              <Link
                to={`/producto/${product.id}`}
                key={product.id}
                className={`tienda-product-card reveal tienda-reveal reveal-delay-${(i % 4) + 1}`}
              >
                {product.badge && (
                  <span className={`tienda-badge ${product.badge}`}>
                    {product.badge === 'hot' ? <><Flame size={10} /> Popular</> : product.badge === 'new' ? <><Sparkles size={10} /> Nuevo</> : <><Percent size={10} /> Oferta</>}
                  </span>
                )}

                <div className="tienda-product-img">
                  <img src={product.img} alt={product.name} loading="lazy" />
                  <div className="tienda-product-overlay">
                    <span className="tienda-overlay-btn"><Eye size={16} /> Ver producto</span>
                  </div>
                </div>

                <div className="tienda-product-info">
                  <span className="tienda-product-brand">{product.brand}</span>
                  <h3 className="tienda-product-name">{product.name}</h3>
                  <p className="tienda-product-desc">{product.desc}</p>
                  <div className="tienda-product-bottom">
                    <span className="tienda-product-price">{formatPrice(product.price)}</span>
                    <span className="tienda-product-rating">
                      <Star size={12} fill="#F7BC21" stroke="none" /> {product.rating}
                      <span className="tienda-rating-count">({product.reviews})</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="tienda-empty">
              <Search size={40} />
              <p>No encontramos productos con esos filtros.</p>
              <button className="tienda-empty-btn" onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories Sidebar Section */}
      <section className="tienda-cats-section section-pad">
        <div className="container">
          <h2 className="heading-lg reveal tienda-reveal" style={{ marginBottom: '2rem' }}>
            Explorar por <span style={{ color: 'var(--clr-orange)' }}>categoría</span>
          </h2>
          <div className="tienda-categories-grid">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className={`tienda-cat-block reveal tienda-reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="tienda-cat-header" style={{ '--cat-accent': cat.accent }}>
                  <span className="tienda-cat-icon"><CategoryIcon name={cat.icon} size={22} /></span>
                  <div>
                    <h3 className="tienda-cat-name">{cat.label}</h3>
                    <p className="tienda-cat-desc">{cat.description}</p>
                  </div>
                </div>
                <ul className="tienda-sub-list">
                  {cat.subcategories.slice(0, 4).map((sub) => (
                    <li key={sub.slug}>
                      <Link to={sub.slug} className="tienda-sub-link">
                        <ArrowRight size={12} />
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={cat.slug} className="tienda-cat-btn" style={{ '--cat-accent': cat.accent }}>
                  Ver todo <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
