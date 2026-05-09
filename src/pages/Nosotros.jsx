import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Eye, Award } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { STATS, BRAND } from '../data/content';
import './Nosotros.css';

const TIMELINE = [
  { year: '2012', title: 'Fundación', desc: 'Nace Maqte Colombia en Florencia, Caquetá, con el sueño de democratizar el acceso a maquinaria industrial en la región.' },
  { year: '2015', title: 'Expansión Regional', desc: 'Ampliamos nuestra cobertura a todo el Caquetá y comenzamos distribución a departamentos vecinos.' },
  { year: '2018', title: 'Distribuidores Oficiales', desc: 'Firmamos alianzas con Bosch, Makita y Honda como distribuidores oficiales en Colombia.' },
  { year: '2022', title: 'Tienda Virtual', desc: 'Lanzamos nuestra plataforma digital para llegar a todo el territorio nacional.' },
  { year: 'Hoy', title: 'Líderes Regionales', desc: 'Más de 500 productos, 12 marcas aliadas y miles de clientes satisfechos en todo Colombia.' },
];

export default function Nosotros() {
  useScrollReveal('.nos-reveal');

  return (
    <main>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="reveal nos-reveal">
            <span className="label-upper">Quiénes somos</span>
            <h1 className="display-lg" style={{ marginTop: '0.5rem' }}>
              Construimos <span style={{ color: 'var(--clr-orange)' }}>Colombia</span>
            </h1>
            <p style={{ color: 'var(--clr-text-2)', marginTop: '1rem', maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.75 }}>
              Desde el corazón de la Amazonía colombiana, llevamos más de una década 
              siendo el aliado industrial de quienes construyen el país.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="section-pad">
        <div className="container">
          <div className="nos-mv-grid">
            <div className="nos-mv-card reveal nos-reveal">
              <div className="nos-mv-icon"><Target size={28} /></div>
              <h3 className="heading-md" style={{ margin: '1rem 0 0.5rem' }}>Misión</h3>
              <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8 }}>
                Proveer a los profesionales, empresas y emprendedores colombianos de 
                maquinaria, herramientas y ferretería de alta calidad, con asesoría 
                especializada y los mejores precios del mercado.
              </p>
            </div>
            <div className="nos-mv-card reveal nos-reveal reveal-delay-2">
              <div className="nos-mv-icon" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--clr-blue)' }}>
                <Eye size={28} />
              </div>
              <h3 className="heading-md" style={{ margin: '1rem 0 0.5rem' }}>Visión</h3>
              <p style={{ color: 'var(--clr-text-2)', lineHeight: 1.8 }}>
                Ser la plataforma líder de distribución industrial en Colombia, reconocida 
                por nuestra excelencia en servicio, amplitud de catálogo y presencia 
                digital a nivel nacional.
              </p>
            </div>
            <div className="nos-mv-card reveal nos-reveal reveal-delay-3">
              <div className="nos-mv-icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--clr-green)' }}>
                <Award size={28} />
              </div>
              <h3 className="heading-md" style={{ margin: '1rem 0 0.5rem' }}>Valores</h3>
              <ul style={{ color: 'var(--clr-text-2)', lineHeight: 2, paddingLeft: '1rem', listStyle: 'disc' }}>
                <li>Honestidad y transparencia</li>
                <li>Calidad garantizada</li>
                <li>Servicio personalizado</li>
                <li>Compromiso con Colombia</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="nos-stats-section">
        <div className="container nos-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className={`nos-stat reveal nos-reveal reveal-delay-${i + 1}`}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad">
        <div className="container">
          <div className="section-header nos-reveal reveal" style={{ marginBottom: '3rem' }}>
            <span className="label-upper">Nuestra historia</span>
            <h2 className="heading-xl">
              Un camino de <span style={{ color: 'var(--clr-orange)' }}>crecimiento</span>
            </h2>
          </div>
          <div className="nos-timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`nos-timeline-item reveal nos-reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="nos-timeline-year">{item.year}</div>
                <div className="nos-timeline-connector">
                  <div className="nos-timeline-dot" />
                  {i < TIMELINE.length - 1 && <div className="nos-timeline-line" />}
                </div>
                <div className="nos-timeline-content">
                  <h4 className="nos-timeline-title">{item.title}</h4>
                  <p className="nos-timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: 'var(--clr-bg-2)', borderTop: '1px solid var(--clr-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="heading-xl reveal nos-reveal" style={{ marginBottom: '1.5rem' }}>
            ¿Listo para trabajar juntos?
          </h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contacto" className="btn btn-primary">
              Contactarnos <ArrowRight size={16} />
            </Link>
            <Link to="/tienda" className="btn btn-outline">
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
