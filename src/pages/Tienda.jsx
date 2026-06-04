import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, Search, SlidersHorizontal, Grid, LayoutList,
  Eye, Percent, Loader, X
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useWixClient } from '../hooks/useWixClient';
import { CATEGORIES, BRAND } from '../data/content';
import { CategoryIcon } from '../components/IconMap';
import { getProductImageUrl } from '../lib/wixImageUrl';
import AddToCartButton from '../components/AddToCartButton';
import './Tienda.css';

/* ─── Sorting ──────────────────────────────────────────── */
const SORT_OPTIONS = [
  { label: 'Más relevantes', value: 'relevance' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Nombre A-Z', value: 'name-asc' },
];

const formatPrice = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export { formatPrice };

/* ─── Helpers ──────────────────────────────────────────── */
function getProductPrice(product) {
  if (product.priceData?.price) return product.priceData.price;
  if (product.price?.price) return product.price.price;
  return 0;
}

function getFormattedPrice(product) {
  const price = getProductPrice(product);
  if (price) return formatPrice(price);
  if (product.priceData?.formatted?.price) return product.priceData.formatted.price;
  return 'Consultar';
}

function hasDiscount(product) {
  const dp = product.priceData?.discountedPrice;
  const op = product.priceData?.price;
  return dp && op && dp < op;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default function Tienda() {
  // Only reveal static elements. Product cards are async so they use CSS animation instead.
  useScrollReveal('.tienda-reveal');

  const [searchParams, setSearchParams] = useSearchParams();
  const { wixClient, isReady } = useWixClient();

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]); // Wix collections for filter tabs
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeCollection, setActiveCollection] = useState('all'); // Wix collection _id or 'all'
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ── Sync search from URL ──────────────────────────────
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  // ── Fetch products + collections from Wix ─────────────
  const fetchData = useCallback(async () => {
    if (!isReady || !wixClient) return;
    setIsLoading(true);
    setLoadError(null);

    try {
      // Fetch products (paginated)
      const allItems = [];
      let skip = 0;
      const limit = 100;
      while (true) {
        const result = await wixClient.products
          .queryProducts()
          .skip(skip)
          .limit(limit)
          .find();
        allItems.push(...result.items);
        if (!result.hasNext()) break;
        skip += limit;
      }
      setProducts(allItems);

      // Fetch collections for filter tabs
      try {
        const colResult = await wixClient.collections
          .queryCollections()
          .limit(50)
          .find();

        // Filter out "All Products" (Wix default collection)
        const filtered = (colResult.items || []).filter(
          c => c.name && c.name !== 'All Products' && c.name !== 'Featured Products'
        );
        setCollections(filtered);
      } catch (colErr) {
        console.warn('[Tienda] Could not fetch collections:', colErr);
        setCollections([]);
      }
    } catch (err) {
      console.error('[Tienda] Error fetching products:', err);
      setLoadError('No se pudieron cargar los productos. Intenta recargar la página.');
    } finally {
      setIsLoading(false);
    }
  }, [wixClient, isReady]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Scroll back to top of products list on collection filter change ──
  useEffect(() => {
    const layout = document.querySelector('.tienda-layout');
    if (layout) {
      const rect = layout.getBoundingClientRect();
      if (rect.top < 130) {
        window.scrollTo({
          top: window.scrollY + rect.top - 130,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCollection]);

  // ── Filter & Sort ──────────────────────────────────────
  let filtered = products.filter(p => {
    const name = (p.name || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const desc = stripHtml(p.description).toLowerCase();
    const term = searchTerm.toLowerCase().trim();

    const matchSearch = !term ||
      name.includes(term) ||
      brand.includes(term) ||
      desc.includes(term);

    const matchCollection = activeCollection === 'all' ||
      (p.collectionIds && p.collectionIds.includes(activeCollection));

    return matchSearch && matchCollection;
  });

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => getProductPrice(a) - getProductPrice(b));
  if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => getProductPrice(b) - getProductPrice(a));
  if (sort === 'name-asc') filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const handleSearch = (val) => {
    setSearchTerm(val);
    if (val) setSearchParams({ q: val });
    else setSearchParams({});
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const getCollectionCount = (colId) => {
    if (colId === 'all') return products.length;
    return products.filter(p => p.collectionIds && p.collectionIds.includes(colId)).length;
  };

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
              {isLoading
                ? 'Cargando productos...'
                : `${products.length} productos disponibles con envío a todo Colombia.`}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <section className="tienda-toolbar-wrap">
        <div className="container tienda-toolbar">
          <div className="tienda-toolbar-top">
            {/* Search */}
            <div className="tienda-search">
              <Search size={16} className="tienda-search-icon" />
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="tienda-search-input"
              />
              {searchTerm && (
                <button className="tienda-search-clear" onClick={clearSearch} title="Limpiar">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="tienda-toolbar-right">
              {/* Mobile Filter Button */}
              <button className="tienda-filter-trigger" onClick={() => setShowMobileFilters(true)} title="Filtros">
                <SlidersHorizontal size={14} />
                <span>Filtros</span>
                {activeCollection !== 'all' && <span className="tienda-trigger-badge">1</span>}
              </button>

              <div className="tienda-sort">
                <SlidersHorizontal size={14} className="hide-mobile" />
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
        </div>
      </section>

      {/* Results & Sidebar */}
      <section className="section-pad" style={{ paddingTop: '2rem' }}>
        <div className="container tienda-layout">
          {/* Sidebar (Desktop sticky / Mobile drawer) */}
          <aside className={`tienda-sidebar ${showMobileFilters ? 'open' : ''}`}>
            <div className="tienda-sidebar-header">
              <h3>Categorías</h3>
              <button className="tienda-sidebar-close" onClick={() => setShowMobileFilters(false)} title="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="tienda-sidebar-section">
              <div className="tienda-sidebar-list">
                <button
                  className={`tienda-sidebar-item ${activeCollection === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCollection('all');
                    setShowMobileFilters(false);
                  }}
                >
                  <span className="tienda-sidebar-name">Todos los productos</span>
                  <span className="tienda-sidebar-count">{products.length}</span>
                </button>
                {collections.map(col => {
                  const count = getCollectionCount(col._id);
                  return (
                    <button
                      key={col._id}
                      className={`tienda-sidebar-item ${activeCollection === col._id ? 'active' : ''}`}
                      onClick={() => {
                        setActiveCollection(col._id);
                        setShowMobileFilters(false);
                      }}
                    >
                      <span className="tienda-sidebar-name">{col.name}</span>
                      <span className="tienda-sidebar-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Backdrop for mobile drawer */}
          {showMobileFilters && (
            <div className="tienda-sidebar-overlay" onClick={() => setShowMobileFilters(false)} />
          )}

          {/* Main Content Area */}
          <div className="tienda-content">
            {isLoading && (
              <div className="tienda-loading">
                <Loader size={32} className="spin" />
                <p>Cargando productos...</p>
              </div>
            )}

            {loadError && (
              <div className="tienda-empty">
                <p>{loadError}</p>
                <button className="tienda-empty-btn" onClick={fetchData}>Reintentar</button>
              </div>
            )}

            {!isLoading && !loadError && (
              <>
                <div className="tienda-results-header">
                  <span className="tienda-results-count">
                    {filtered.length} producto{filtered.length !== 1 && 's'}
                    {searchTerm && ` para "${searchTerm}"`}
                  </span>
                  {(searchTerm || activeCollection !== 'all') && (
                    <button
                      className="tienda-clear-filters"
                      onClick={() => { clearSearch(); setActiveCollection('all'); }}
                    >
                      <X size={12} /> Limpiar filtros
                    </button>
                  )}
                </div>

                <div className={`tienda-products-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                  {filtered.map((product) => {
                    const imageUrl = getProductImageUrl(product) || '/images/placeholder.png';
                    const price = getProductPrice(product);
                    const desc = stripHtml(product.description);
                    const slug = product.slug || product._id;
                    const brand = product.brand || '';

                    return (
                      <div key={product._id} className="tienda-product-card">
                        {hasDiscount(product) && (
                          <span className="tienda-badge sale">
                            <Percent size={10} /> Oferta
                          </span>
                        )}

                        <Link to={`/producto/${slug}`} className="tienda-product-link">
                          <div className="tienda-product-img">
                            <img src={imageUrl} alt={product.name} loading="lazy" />
                            <div className="tienda-product-overlay">
                              <span className="tienda-overlay-btn"><Eye size={16} /> Ver producto</span>
                            </div>
                          </div>

                          <div className="tienda-product-info">
                            {brand && <span className="tienda-product-brand">{brand}</span>}
                            <h3 className="tienda-product-name">{product.name}</h3>
                            {desc && (
                              <p className="tienda-product-desc">
                                {desc.length > 80 ? desc.substring(0, 80) + '...' : desc}
                              </p>
                            )}
                            <div className="tienda-product-bottom">
                              <span className="tienda-product-price">
                                {price ? formatPrice(price) : 'Consultar'}
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Quick add to cart */}
                        <div className="tienda-product-cart-action">
                          <AddToCartButton productId={product._id} compact />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div className="tienda-empty">
                    <Search size={40} />
                    <p>No encontramos productos con esos filtros.</p>
                    <button
                      className="tienda-empty-btn"
                      onClick={() => { clearSearch(); setActiveCollection('all'); }}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Categories section */}
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
