import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BRANDS, CATEGORIES } from '../data/content';
import './Marcas.css';

export default function Marcas() {
  useScrollReveal('.marc-reveal');

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    brands: BRANDS.filter(b => b.category === cat.label),
  })).filter(cat => cat.brands.length > 0);

  return (
    <main>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="reveal marc-reveal">
            <span className="label-upper">Distribuidores oficiales</span>
            <h1 className="display-lg" style={{ marginTop: '0.5rem' }}>
              Nuestras <span style={{ color: 'var(--clr-orange)' }}>Marcas</span>
            </h1>
            <p style={{ color: 'var(--clr-text-2)', marginTop: '1rem', maxWidth: '560px', fontSize: '1.05rem' }}>
              Trabajamos exclusivamente con las marcas más reconocidas del mercado industrial. 
              Autenticidad y calidad en cada producto.
            </p>
          </div>
        </div>
      </div>

      {/* All Brands Grid */}
      <section className="section-pad">
        <div className="container">
          <div className="marcas-all-grid">
            {BRANDS.map((brand, i) => (
              <div
                key={i}
                className={`marca-card reveal marc-reveal reveal-delay-${(i % 5) + 1}`}
              >
                <div className="marca-card-logo">
                  <span className="marca-card-name">{brand.name}</span>
                </div>
                <div className="marca-card-body">
                  <div className="marca-card-cat">{brand.category}</div>
                  <Link to={`/tienda?marca=${brand.name.toLowerCase()}`} className="marca-card-link">
                    Ver productos <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grouped by Category */}
      <section className="section-pad" style={{ background: 'var(--clr-bg-2)', borderTop: '1px solid var(--clr-border)' }}>
        <div className="container">
          <h2 className="heading-xl reveal marc-reveal" style={{ marginBottom: '3rem' }}>
            Por <span style={{ color: 'var(--clr-orange)' }}>categoría</span>
          </h2>
          <div className="marcas-cat-groups">
            {grouped.map((group, i) => (
              <div key={group.id} className={`marcas-group reveal marc-reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="marcas-group-header" style={{ '--cat-accent': group.accent }}>
                  <span className="marcas-group-icon">{group.icon}</span>
                  <h3 className="marcas-group-name">{group.label}</h3>
                </div>
                <div className="marcas-group-chips">
                  {group.brands.map((b, j) => (
                    <span key={j} className="marcas-chip">{b.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ borderTop: '1px solid var(--clr-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="label-upper">¿No encuentras tu marca?</span>
          <h2 className="heading-xl" style={{ margin: '0.5rem 0 1.5rem' }}>
            Consúltanos
          </h2>
          <Link to="/contacto" className="btn btn-primary">
            Solicitar marca específica <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
