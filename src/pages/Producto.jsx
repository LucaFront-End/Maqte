import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShoppingCart, Truck, Shield, RotateCcw,
  Phone, MessageCircle, ChevronRight, Share2,
  Heart, CheckCircle, Package, Zap, Loader, ImageOff
} from 'lucide-react';
import { useWixClient } from '../hooks/useWixClient';
import { BRAND } from '../data/content';
import { getProductImageUrl, getAllProductImages, getWixImageUrl } from '../lib/wixImageUrl';
import AddToCartButton from '../components/AddToCartButton';
import { formatPrice } from './Tienda';
import './Producto.css';

/* ─── Helpers ──────────────────────────────────────────── */
function getProductPrice(product) {
  if (product?.priceData?.price) return product.priceData.price;
  if (product?.price?.price) return product.price.price;
  return 0;
}

function getFormattedPrice(product) {
  const price = getProductPrice(product);
  if (price) return formatPrice(price);
  if (product?.priceData?.formatted?.price) return product.priceData.formatted.price;
  return 'Consultar precio';
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default function Producto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { wixClient, isReady } = useWixClient();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');
  const [activeImage, setActiveImage] = useState(0);

  // ── Fetch product by slug ──────────────────────────────
  const fetchProduct = useCallback(async () => {
    if (!isReady || !wixClient || !slug) return;
    setIsLoading(true);

    try {
      // Try exact slug match
      const result = await wixClient.products
        .queryProducts()
        .eq('slug', slug)
        .limit(1)
        .find();

      let foundProduct = result.items[0] || null;

      // Fallback: try matching by _id (in case slug is actually an ID)
      if (!foundProduct) {
        try {
          const byId = await wixClient.products
            .queryProducts()
            .eq('_id', slug)
            .limit(1)
            .find();
          foundProduct = byId.items[0] || null;
        } catch {
          // Not a valid ID, that's ok
        }
      }

      // Fallback: normalize slug comparison (strip accents)
      if (!foundProduct) {
        const normalizedInput = slug
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();

        let skip = 0;
        const pageSize = 100;
        while (true) {
          const page = await wixClient.products
            .queryProducts()
            .limit(pageSize)
            .skip(skip)
            .find();

          const match = page.items.find(p => {
            const normalizedSlug = (p.slug || '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase();
            return normalizedSlug === normalizedInput;
          });

          if (match) {
            foundProduct = match;
            break;
          }
          if (page.items.length < pageSize) break;
          skip += pageSize;
        }
      }

      setProduct(foundProduct);

      // Fetch related products
      if (foundProduct) {
        try {
          const relatedResult = await wixClient.products
            .queryProducts()
            .ne('_id', foundProduct._id)
            .limit(4)
            .find();
          setRelated(relatedResult.items || []);
        } catch {
          setRelated([]);
        }
      }
    } catch (err) {
      console.error('[Producto] Error fetching product:', err);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [wixClient, isReady, slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ── Loading State ──────────────────────────────────────
  if (isLoading) {
    return (
      <main className="producto-page">
        <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
          <Loader size={40} className="spin" style={{ color: 'var(--clr-orange)' }} />
          <p style={{ color: 'var(--clr-text-3)', marginTop: '1rem' }}>Cargando producto...</p>
        </div>
      </main>
    );
  }

  // ── Not Found ──────────────────────────────────────────
  if (!product) {
    return (
      <main className="producto-page">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h2 className="heading-lg">Producto no encontrado</h2>
          <p style={{ color: 'var(--clr-text-3)', margin: '1rem 0 2rem' }}>
            El producto que buscas no está disponible o fue eliminado.
          </p>
          <Link to="/tienda" className="producto-back-btn" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  // ── Product Data ───────────────────────────────────────
  const images = getAllProductImages(product);
  const mainImage = images[activeImage] || getProductImageUrl(product) || '/images/placeholder.png';
  const price = getProductPrice(product);
  const priceStr = getFormattedPrice(product);
  const description = stripHtml(product.description);
  const brand = product.brand || '';
  const inStock = product.stock?.inStock !== false;
  const productName = product.name || 'Producto';

  const whatsappMsg = `SW- Quisiera más información de sus productos. Me interesa: ${productName}${brand ? ` (${brand})` : ''} - ${priceStr}. ¿Está disponible?`;

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
          {brand && (
            <>
              <span>{brand}</span>
              <ChevronRight size={12} />
            </>
          )}
          <span className="current">{productName}</span>
        </div>
      </div>

      {/* Product Hero */}
      <section className="producto-hero">
        <div className="container producto-hero-grid">
          {/* Gallery */}
          <div className="producto-gallery">
            <div className="producto-gallery-main">
              <img src={mainImage} alt={productName} />
            </div>
            {images.length > 1 && (
              <div className="producto-gallery-thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`producto-thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${productName} - ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="producto-info">
            {brand && <span className="producto-brand-tag">{brand}</span>}
            <h1 className="producto-title">{productName}</h1>

            <div className="producto-rating-row">
              <span className={`producto-stock ${inStock ? '' : 'out'}`}>
                {inStock ? (
                  <><CheckCircle size={12} /> En stock</>
                ) : (
                  <><ImageOff size={12} /> Sin stock</>
                )}
              </span>
              {product.sku && (
                <span style={{ color: 'var(--clr-text-3)', fontSize: '0.8rem' }}>
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <div className="producto-price-block">
              <span className="producto-price">{priceStr}</span>
              {product.priceData?.discountedPrice && product.priceData.discountedPrice < price && (
                <span className="producto-original-price">
                  {formatPrice(price)}
                </span>
              )}
              <span className="producto-tax">IVA incluido</span>
            </div>

            {description && (
              <p className="producto-desc">
                {description.length > 220 ? (
                  <>
                    {description.substring(0, 220)}...{' '}
                    <a
                      href="#producto-tabs"
                      className="producto-desc-more-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('desc');
                        document.getElementById('producto-tabs')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Ver más
                    </a>
                  </>
                ) : (
                  description
                )}
              </p>
            )}

            {/* Add to Cart */}
            {inStock && (
              <AddToCartButton productId={product._id} productName={productName} />
            )}

            {/* Secondary actions */}
            <div className="producto-secondary-actions">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noreferrer"
                className="producto-sec-btn"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <button className="producto-sec-btn" onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: productName, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}>
                <Share2 size={14} /> Compartir
              </button>
              <a href={`tel:${BRAND.phone}`} className="producto-sec-btn">
                <Phone size={14} /> Llamar
              </a>
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
      <section className="producto-tabs-section" id="producto-tabs">
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
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>{description || 'Sin descripción disponible.'}</p>
                )}
                {product.additionalInfoSections?.map((section, i) => (
                  <div key={i}>
                    <h4>{section.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: section.description }} />
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="producto-tab-panel">
                <h3>Especificaciones técnicas</h3>
                <table className="producto-specs-table">
                  <tbody>
                    {brand && <tr><td>Marca</td><td>{brand}</td></tr>}
                    <tr><td>Modelo</td><td>{productName}</td></tr>
                    {product.sku && <tr><td>SKU</td><td>{product.sku}</td></tr>}
                    {product.weight && <tr><td>Peso</td><td>{product.weight} kg</td></tr>}
                    <tr><td>Disponibilidad</td><td>{inStock ? 'En stock' : 'Agotado'}</td></tr>
                    {product.productOptions?.map((opt, i) => (
                      <tr key={i}>
                        <td>{opt.name}</td>
                        <td>{opt.choices?.map(c => c.value).join(', ')}</td>
                      </tr>
                    ))}
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
      {related.length > 0 && (
        <section className="producto-related section-pad">
          <div className="container">
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>
              Productos <span style={{ color: 'var(--clr-orange)' }}>relacionados</span>
            </h2>
            <div className="producto-related-grid">
              {related.map(p => {
                const relImg = getProductImageUrl(p) || '/images/placeholder.png';
                const relSlug = p.slug || p._id;
                const relBrand = p.brand || '';
                const relPrice = getProductPrice(p);

                return (
                  <Link to={`/producto/${relSlug}`} key={p._id} className="producto-related-card">
                    <div className="producto-related-img">
                      <img src={relImg} alt={p.name} loading="lazy" />
                    </div>
                    <div className="producto-related-info">
                      {relBrand && <span className="producto-related-brand">{relBrand}</span>}
                      <h4 className="producto-related-name">{p.name}</h4>
                      <div className="producto-related-bottom">
                        <span className="producto-related-price">
                          {relPrice ? formatPrice(relPrice) : 'Consultar'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
