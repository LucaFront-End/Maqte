import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CATEGORIES } from '../data/content';
import { CategoryIcon } from '../components/IconMap';
import './Categorias.css';

export default function Categorias() {
  useScrollReveal('.cat-pg-reveal');

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="reveal cat-pg-reveal">
            <span className="label-upper">Explora todo</span>
            <h1 className="display-lg" style={{ marginTop: '0.5rem' }}>
              Categorías <span style={{ color: 'var(--clr-orange)' }}>completas</span>
            </h1>
            <p style={{ color: 'var(--clr-text-2)', marginTop: '1rem', maxWidth: '560px', fontSize: '1.05rem' }}>
              7 líneas de productos industriales para construcción, agro, ferretería y más.
            </p>
          </div>
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.id} className={`cat-pg-block reveal cat-pg-reveal`} style={{ '--cat-accent': cat.accent }}>
              {/* Category Header */}
              <div className="cat-pg-header">
                <div className="cat-pg-icon"><CategoryIcon name={cat.icon} size={24} /></div>
                <div className="cat-pg-header-text">
                  <h2 className="heading-lg">{cat.label}</h2>
                  <p style={{ color: 'var(--clr-text-2)', marginTop: '0.25rem' }}>{cat.description}</p>
                </div>
                <Link to={cat.slug} className="cat-pg-see-all">
                  Ver todo <ArrowRight size={14} />
                </Link>
              </div>

              {/* Subcategories */}
              <div className="cat-pg-subs-grid">
                {cat.subcategories.map((sub, si) => (
                  <Link
                    key={si}
                    to={sub.slug}
                    className={`cat-pg-sub-card reveal cat-pg-reveal reveal-delay-${(si % 4) + 1}`}
                  >
                    <span className="cat-pg-sub-name">{sub.label}</span>
                    <ArrowRight size={14} className="cat-pg-sub-arrow" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
