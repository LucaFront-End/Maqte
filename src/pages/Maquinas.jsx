import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, Zap, Gauge,
  Sparkles, Cpu, MessageCircle, ChevronDown,
  ShieldCheck, Wrench, Check, Award, Phone,
  FileText, Layers, Info, Tag
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  BRAND,
  MACHINE_CATALOG_2026,
  CATALOG_CONDITIONS,
  INNOVATION_ITEMS
} from '../data/content';
import './Maquinas.css';

const LINE_FILTERS = [
  { id: 'all', label: 'Todas las Fichas', count: 10 },
  { id: 'artesanal', label: 'Línea Artesanal', count: 3 },
  { id: 'semiindustrial', label: 'Línea Semiindustrial', count: 2 },
  { id: 'hidraulica-compacta', label: 'Hidráulica Compacta', count: 1 },
  { id: 'hidraulica-industrial', label: 'Hidráulica Industrial', count: 2 },
  { id: 'complementarios', label: 'Equipos Complementarios', count: 2 },
];

export default function Maquinas() {
  useScrollReveal('.maq-reveal');

  // Filter state for the 10 catalog fichas
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');
  const [activeFichaCode, setActiveFichaCode] = useState(null);

  // Calculator State (3 Questions mapped to the 2026 Catalog)
  const [scaleTarget, setScaleTarget] = useState('artesanal-ponedora');
  const [budgetRange, setBudgetRange] = useState('8m-22m');
  const [operationMode, setOperationMode] = useState('ponedora-movil');

  const filteredCatalog = useMemo(() => {
    if (selectedLineFilter === 'all') return MACHINE_CATALOG_2026;
    return MACHINE_CATALOG_2026.filter(item => item.lineId === selectedLineFilter);
  }, [selectedLineFilter]);

  // Match recommendation logic for the 8 block machines (01 to 08)
  const recommendedMachine = useMemo(() => {
    const scores = {
      '01': 0,
      '02': 0,
      '03': 0,
      '04': 0,
      '05': 0,
      '06': 0,
      '07': 0,
      '08': 0,
    };

    // Question 1: Scale target
    if (scaleTarget === 'artesanal-manual') {
      scores['01'] += 45;
      scores['02'] += 50;
      scores['03'] += 15;
    } else if (scaleTarget === 'artesanal-ponedora') {
      scores['03'] += 50;
      scores['02'] += 20;
      scores['04'] += 20;
    } else if (scaleTarget === 'semiindustrial') {
      scores['04'] += 45;
      scores['05'] += 50;
      scores['06'] += 20;
    } else if (scaleTarget === 'hidraulica-compacta') {
      scores['06'] += 55;
      scores['05'] += 20;
      scores['07'] += 20;
    } else if (scaleTarget === 'hidraulica-industrial') {
      scores['07'] += 50;
      scores['08'] += 55;
      scores['06'] += 15;
    }

    // Question 2: Budget range
    if (budgetRange === '1m-3m') {
      scores['01'] += 45;
      scores['02'] += 45;
    } else if (budgetRange === '8m-22m') {
      scores['03'] += 40;
      scores['04'] += 40;
      scores['05'] += 45;
    } else if (budgetRange === '28m-66m') {
      scores['06'] += 50;
      scores['05'] += 15;
    } else if (budgetRange === '88m-130m') {
      scores['07'] += 50;
      scores['08'] += 35;
    } else if (budgetRange === '130m-190m') {
      scores['08'] += 55;
      scores['07'] += 25;
    }

    // Question 3: Operation mode
    if (operationMode === 'manual-compacta') {
      scores['01'] += 35;
      scores['04'] += 20;
    } else if (operationMode === 'manual-vibracion') {
      scores['02'] += 38;
      scores['04'] += 35;
    } else if (operationMode === 'ponedora-movil') {
      scores['03'] += 38;
      scores['05'] += 38;
    } else if (operationMode === 'hidraulica-manual') {
      scores['06'] += 35;
      scores['07'] += 38;
    } else if (operationMode === 'plc-automatica') {
      scores['08'] += 50;
    }

    let bestCode = '03';
    let maxScore = -1;
    Object.keys(scores).forEach(code => {
      if (scores[code] > maxScore) {
        maxScore = scores[code];
        bestCode = code;
      }
    });

    return MACHINE_CATALOG_2026.find(m => m.code === bestCode) || MACHINE_CATALOG_2026[2];
  }, [scaleTarget, budgetRange, operationMode]);

  const dynamicWhatsappUrl = useMemo(() => {
    const text =
      `SW- Hola, utilicé el Asesor de Selección en la página de Maqte Colombia.\n\n` +
      `🎯 Equipo recomendado: Ficha ${recommendedMachine.code} — ${recommendedMachine.name} (${recommendedMachine.line})\n` +
      `💰 Referencia comercial: ${recommendedMachine.price}${recommendedMachine.equippedPrice ? ` (Línea equipada: ${recommendedMachine.equippedPrice})` : ''}\n\n` +
      `Me gustaría recibir asesoría técnica y cotización formal.`;
    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [recommendedMachine]);

  const scrollToFicha = (code) => {
    setSelectedLineFilter('all');
    setActiveFichaCode(code);
    setTimeout(() => {
      const listEl = document.querySelector('.fichas-list');
      const cardEl = document.getElementById(`ficha-${code}`);
      if (listEl && cardEl) {
        const cards = Array.from(listEl.querySelectorAll('.ficha-card'));
        const targetIdx = cards.indexOf(cardEl);
        if (targetIdx !== -1) {
          const listTop = listEl.getBoundingClientRect().top + window.scrollY;
          const styles = window.getComputedStyle(listEl);
          const gap = parseFloat(styles.rowGap || styles.gap) || 64;
          let offsetBefore = 0;
          for (let i = 0; i < targetIdx; i++) {
            offsetBefore += cards[i].offsetHeight + gap;
          }
          const stickyTop = 84 + targetIdx * 16;
          window.scrollTo({
            top: Math.max(0, listTop + offsetBefore - stickyTop),
            behavior: 'smooth'
          });
          return;
        }
      }
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  return (
    <main className="maquinas-page">
      {/* ─── HERO SECTION (EDICIÓN COMERCIAL 2026) ─── */}
      <section className="page-hero maquinas-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="maquinas-hero-grid">
            {/* Left Content Column */}
            <div className="maquinas-hero-left reveal-left maq-reveal">
              <span className="hero-badge-tag">
                <Zap size={14} className="hero-badge-icon" />
                Edición Comercial 2026 · Precios en Pesos Colombianos
              </span>
              <h1 className="display-lg hero-main-title">
                Catálogo de <span className="hero-gold-text">Maquinaria Bloquera</span>
              </h1>
              <p className="maquinas-hero-sub">
                Soluciones profesionales para fabricación de bloques y prefabricados: equipos manuales, ponedoras móviles, sistemas hidráulicos, plantas automáticas PLC Kinco y equipos complementarios.
              </p>

              {/* Spec Stat Badges Bar */}
              <div className="hero-stats-row">
                <div className="hero-stat-chip reveal maq-reveal reveal-delay-1">
                  <Layers size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">10 Fichas Oficiales</span>
                    <span className="hero-stat-lbl">8 Bloqueras + 2 Complementos</span>
                  </div>
                </div>

                <div className="hero-stat-chip reveal maq-reveal reveal-delay-2">
                  <Tag size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">Desde $1.300.000</span>
                    <span className="hero-stat-lbl">Precios Base COP</span>
                  </div>
                </div>

                <div className="hero-stat-chip reveal maq-reveal reveal-delay-3">
                  <Cpu size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">PLC Kinco & HMI 7”</span>
                    <span className="hero-stat-lbl">Automatización Industrial</span>
                  </div>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="maquinas-hero-actions reveal maq-reveal reveal-delay-4">
                <a href="#fichas" className="btn btn-primary hero-btn-main">
                  <FileText size={18} /> Ver las 10 Fichas Técnicas
                </a>
                <a href="#portafolio" className="btn btn-outline hero-btn-sub">
                  Guía Rápida de Precios <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Showcase Frame */}
            <div className="maquinas-hero-right reveal-right maq-reveal reveal-delay-2">
              <div className="hero-showcase-frame">
                <img
                  src="/images/maquinas/08-bloquera-hidraulica-automatica-plc.png"
                  alt="Bloquera hidráulica automática PLC Maqte Colombia"
                  className="hero-showcase-img"
                />
                <div className="hero-img-gradient-overlay" />
                <div className="hero-top-badge">
                  <Award size={14} /> Florencia, Caquetá · Colombia
                </div>
                <div className="hero-bottom-floating-card">
                  <div className="hero-float-icon">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <span className="hero-float-title">Fabricación, Moldes & Puesta en Marcha</span>
                    <span className="hero-float-sub">Líneas individuales y paquetes equipados con mezcladora y banda</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTAFOLIO DE EQUIPOS: GUÍA RÁPIDA DE REFERENCIAS Y PRECIOS ─── */}
      <section id="portafolio" className="section-pad portfolio-summary-section">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper" style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} /> Portafolio de Equipos 2026
            </span>
            <h2 className="heading-xl">
              Guía Rápida de <span style={{ color: '#D97706' }}>Referencias y Precios</span>
            </h2>
            <p className="section-subtitle">
              Resumen oficial de referencias comerciales en pesos colombianos (COP). Haz clic en cualquier equipo para ir directamente a su ficha técnica detallada.
            </p>
          </div>

          <div className="portfolio-table-card reveal maq-reveal">
            <div className="portfolio-table-responsive">
              <table className="portfolio-summary-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Línea / Categoría</th>
                    <th>Referencia</th>
                    <th>Precio Base (COP)</th>
                    <th>Línea Equipada / Detalle</th>
                    <th style={{ textAlign: 'right' }}>Ficha</th>
                  </tr>
                </thead>
                <tbody>
                  {MACHINE_CATALOG_2026.map((item) => (
                    <tr
                      key={item.code}
                      className="portfolio-row"
                      onClick={() => scrollToFicha(item.code)}
                    >
                      <td className="portfolio-code-cell">
                        <span className="portfolio-code-badge">{item.code}</span>
                      </td>
                      <td>
                        <span className={`portfolio-line-pill line-${item.lineId}`}>
                          {item.line}
                        </span>
                      </td>
                      <td className="portfolio-name-cell">
                        <strong>{item.name}</strong>
                      </td>
                      <td className="portfolio-price-cell">
                        <span className={`portfolio-price-val ${!item.priceShort.startsWith('$') ? 'consult' : ''}`}>
                          {item.price}
                        </span>
                        {item.previousPrice && (
                          <span className="portfolio-prev-price">
                            Antes: {item.previousPrice}
                          </span>
                        )}
                      </td>
                      <td className="portfolio-extra-cell">
                        {item.equippedPrice ? (
                          <span className="portfolio-equipped-tag">
                            Equipada: <strong>{item.equippedPrice}</strong>
                          </span>
                        ) : (
                          <span className="portfolio-spec-preview">
                            {item.specs[0]?.label}: {item.specs[0]?.value}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="portfolio-go-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToFicha(item.code);
                          }}
                        >
                          Ver ficha <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="portfolio-table-footnote">
              <Info size={15} />
              <span>
                Los precios de líneas equipadas se detallan en cada ficha. Los equipos opcionales no se presumen incluidos.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATÁLOGO COMPLETO: LAS 10 FICHAS TÉCNICAS ─── */}
      <section id="fichas" className="section-pad fichas-catalog-section">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper">Especificaciones y Alcance Comercial</span>
            <h2 className="heading-xl">
              Fichas Técnicas del <span style={{ color: '#D97706' }}>Catálogo 2026</span>
            </h2>
            <p className="section-subtitle">
              Cada ficha presenta fotografía real suministrada por MAQTECOLOMBIA, descripción operativa, tabla de características técnicas y alcance comercial.
            </p>
          </div>

          {/* Filter Bar by Line */}
          <div className="fichas-filter-bar reveal maq-reveal">
            {LINE_FILTERS.map(f => (
              <button
                key={f.id}
                type="button"
                className={`ficha-filter-btn ${selectedLineFilter === f.id ? 'active' : ''}`}
                onClick={() => setSelectedLineFilter(f.id)}
              >
                <span>{f.label}</span>
                <span className="ficha-filter-count">{f.count}</span>
              </button>
            ))}
          </div>

          {/* Fichas List (Sticky Stacking Cards) */}
          <div className="fichas-list maquinas-lines-stack">
            {filteredCatalog.map((item, idx) => {
              const isHighlighted = activeFichaCode === item.code;
              const equippedWhatsappMsg = item.equippedPrice
                ? `SW- Hola, me interesa cotizar la Línea Equipada de la Ficha ${item.code}: ${item.name} (${item.equippedPrice} — ${item.equippedDesc}).`
                : '';

              return (
                <article
                  key={item.code}
                  id={`ficha-${item.code}`}
                  className={`ficha-card maq-line-card ${isHighlighted ? 'highlighted' : ''}`}
                  style={{
                    '--stack-idx': idx + 1,
                    top: `calc(84px + ${idx * 16}px)`,
                    zIndex: idx + 1
                  }}
                >
                  {/* Image Column */}
                  <div className="ficha-media-col maq-line-img-col">
                    <div className="ficha-media-top-badges">
                      <span className="ficha-num-badge">FICHA {item.code}</span>
                      <span className="ficha-line-badge">{item.line}</span>
                    </div>
                    <img
                      src={item.image}
                      alt={`${item.code} - ${item.name}`}
                      className="ficha-main-img maq-line-img"
                      loading="lazy"
                    />
                    <div className="maq-line-img-glow" />
                  </div>

                  {/* Content Column */}
                  <div className="ficha-body-col maq-line-content-col">
                    <div>
                      {/* Top Header with Sticky Number */}
                      <div className="maq-line-header ficha-sticky-header">
                        <span className="maq-line-number">{item.code}</span>
                        <div>
                          <span className="ficha-overline">
                            {item.code} &nbsp;/&nbsp; {item.line.toUpperCase()}
                          </span>
                          <h3 className="ficha-title">{item.name}</h3>
                          <p className="ficha-desc">{item.description}</p>
                        </div>
                      </div>

                      {/* Price & Equipped Package Box */}
                      <div className="ficha-pricing-row">
                        <div className="ficha-price-main-box">
                          <span className="ficha-price-label">Precio Base Referencial</span>
                          <div className="ficha-price-value-wrap">
                            <span className={`ficha-price-value ${!item.priceShort.startsWith('$') ? 'is-consult' : ''}`}>
                              {item.price}
                            </span>
                            {item.previousPrice && (
                              <span className="ficha-price-previous">
                                Precio anterior: <del>{item.previousPrice}</del>
                              </span>
                            )}
                          </div>
                        </div>

                        {item.equippedPrice && (
                          <div className="ficha-price-equipped-box">
                            <span className="ficha-equipped-label">
                              <Sparkles size={13} /> Paquete Línea Equipada
                            </span>
                            <span className="ficha-equipped-value">{item.equippedPrice}</span>
                            <span className="ficha-equipped-desc">{item.equippedDesc}</span>
                          </div>
                        )}
                      </div>

                      {/* Technical Specs Table */}
                      <div className="ficha-specs-block">
                        <h4 className="ficha-specs-heading">Características Técnicas</h4>
                        <table className="ficha-specs-table">
                          <tbody>
                            {item.specs.map((spec, sIdx) => (
                              <tr key={sIdx}>
                                <th>{spec.label}</th>
                                <td>{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Scope / Commercial Note */}
                      {item.note && (
                        <div className="ficha-scope-note">
                          <Info size={16} className="ficha-scope-icon" />
                          <span>{item.note}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="ficha-actions-footer">
                      <a
                        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(item.whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary ficha-cta-primary"
                      >
                        <MessageCircle size={17} /> Cotizar Ficha {item.code}
                      </a>

                      {item.equippedPrice && (
                        <a
                          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(equippedWhatsappMsg)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline ficha-cta-equipped"
                        >
                          <Layers size={16} /> Cotizar Línea Equipada ({item.equippedPrice})
                        </a>
                      )}

                      <a
                        href={`tel:${BRAND.phone}`}
                        className="btn btn-outline ficha-cta-call"
                      >
                        <Phone size={15} /> Llamar a Asesor
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN INTERACTIVA: ¿QUÉ MÁQUINA NECESITO? ─── */}
      <section id="calculadora" className="section-pad calc-section">
        <div className="container">
          <div className="section-header calc-header reveal maq-reveal">
            <span className="label-upper" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
              <Sparkles size={14} /> Asesor Virtual de Selección 2026
            </span>
            <h2 className="heading-xl" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
              ¿Qué máquina <span className="calc-title-highlight">necesito?</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0.75rem auto 0' }}>
              Configura tu alcance operativo, presupuesto en COP y sistema preferido para identificar la referencia exacta de nuestro catálogo 2026.
            </p>
          </div>

          <div className="calc-container">
            {/* Form Column */}
            <div className="calc-form reveal-left maq-reveal">
              <div className="calc-form-header">
                <div>
                  <span className="calc-form-subheading">Configurador paso a paso</span>
                  <h3 className="calc-form-main-title">Parámetros de tu Proyecto</h3>
                </div>
                <div className="calc-progress-pill">
                  <Sparkles size={14} /> Catálogo Oficial 2026
                </div>
              </div>

              {/* Question 1: Scale Target */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">01</div>
                  <div>
                    <label className="calc-label">
                      ¿Qué nivel de producción o línea buscas?
                    </label>
                    <span className="calc-label-hint">Selecciona el alcance de fabricación de bloques</span>
                  </div>
                </div>
                <div className="calc-options-grid">
                  {[
                    { id: 'artesanal-manual', label: 'Artesanal Compacta', tag: 'Fichas 01–02', sub: 'Iniciación y obra local' },
                    { id: 'artesanal-ponedora', label: 'Ponedora Pequeña', tag: '4 bloques H10/ciclo', sub: 'Ficha 03 · Móvil' },
                    { id: 'semiindustrial', label: 'Semiindustrial', tag: 'Fichas 04–05', sub: 'Fija o Ponedora Grande' },
                    { id: 'hidraulica-compacta', label: 'Hidráulica Compacta', tag: 'Ficha 06', sub: 'Prensado Hidráulico' },
                    { id: 'hidraulica-industrial', label: 'Industrial / PLC', tag: '4.000 a 7.000/día', sub: 'Fichas 07–08' }
                  ].map(opt => {
                    const isSelected = scaleTarget === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setScaleTarget(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected && <span className="calc-opt-check"><Check size={12} /></span>}
                        </div>
                        <span className="calc-opt-tag">{opt.tag}</span>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Budget Range in COP */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">02</div>
                  <div>
                    <label className="calc-label">
                      ¿Cuál es tu rango de inversión estimado (COP)?
                    </label>
                    <span className="calc-label-hint">Valores de referencia comercial en pesos colombianos</span>
                  </div>
                </div>
                <div className="calc-options-grid">
                  {[
                    { id: '1m-3m', label: '$1.3M a $2.1M', tag: 'Entrada COP', sub: 'Manuales compactas' },
                    { id: '8m-22m', label: '$8.3M a $22M', tag: 'Intermedio COP', sub: 'Ponedoras y fijas' },
                    { id: '28m-66m', label: '$28M a $65.8M', tag: 'Hidráulica Compacta', sub: 'Base o línea equipada' },
                    { id: '88m-130m', label: '$88M a $130M', tag: 'Industrial Base', sub: 'Hidráulica / PLC' },
                    { id: '130m-190m', label: '$130M a $190M', tag: 'Planta Equipada', sub: 'Con mezcladora y banda' }
                  ].map(opt => {
                    const isSelected = budgetRange === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setBudgetRange(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected && <span className="calc-opt-check"><Check size={12} /></span>}
                        </div>
                        <span className="calc-opt-tag">{opt.tag}</span>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Operation Type */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">03</div>
                  <div>
                    <label className="calc-label">
                      ¿Qué tipo de operación técnica prefieres?
                    </label>
                    <span className="calc-label-hint">Sistema de moldeo y control del equipo</span>
                  </div>
                </div>
                <div className="calc-options-grid">
                  {[
                    { id: 'manual-compacta', label: 'Manual Pura', tag: 'Sin motor', sub: 'Accionamiento manual' },
                    { id: 'manual-vibracion', label: 'Motovibración', tag: '280 W · 110 V', sub: 'Compacta o estacionaria' },
                    { id: 'ponedora-movil', label: 'Ponedora Móvil', tag: 'Sin tablas', sub: 'Descarga sobre piso' },
                    { id: 'hidraulica-manual', label: 'Mandos Hidráulicos', tag: 'Palancas', sub: 'Alta presión sin PLC' },
                    { id: 'plc-automatica', label: 'Automática PLC', tag: 'Kinco + HMI 7”', sub: 'Secuencia automatizada' }
                  ].map(opt => {
                    const isSelected = operationMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setOperationMode(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected && <span className="calc-opt-check"><Check size={12} /></span>}
                        </div>
                        <span className="calc-opt-tag">{opt.tag}</span>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendation Result Column */}
            <div className="calc-result reveal-right maq-reveal reveal-delay-2">
              <div className="calc-result-header">
                <div className="calc-result-badge">
                  <Sparkles size={14} /> Ficha Recomendada ({recommendedMachine.code} / 08)
                </div>
              </div>

              <div className="calc-recommended-card">
                <div className="calc-rec-header">
                  <div className="calc-rec-badge-tag">
                    FICHA {recommendedMachine.code} · {recommendedMachine.line}
                  </div>
                  <h3 className="calc-rec-title">{recommendedMachine.name}</h3>
                  <p className="calc-rec-tagline">{recommendedMachine.description}</p>
                </div>

                <div className="calc-rec-img-wrapper">
                  <img
                    src={recommendedMachine.image}
                    alt={recommendedMachine.name}
                    className="calc-rec-img"
                  />
                  <div className="calc-rec-img-overlay" />
                  <div className="calc-rec-img-badge">
                    <Award size={14} /> {recommendedMachine.price}
                  </div>
                </div>

                <div className="calc-specs-box">
                  {recommendedMachine.specs.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="calc-spec-item">
                      <div className="calc-spec-icon-box">
                        <Gauge size={16} />
                      </div>
                      <div>
                        <span className="calc-spec-lbl">{s.label}</span>
                        <span className="calc-spec-val">{s.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {recommendedMachine.equippedPrice && (
                  <div className="calc-why-box">
                    <h4 className="calc-why-title">
                      <CheckCircle2 size={15} style={{ display: 'inline', marginRight: '6px', color: '#D97706' }} />
                      Opción Línea Equipada: {recommendedMachine.equippedPrice}
                    </h4>
                    <p className="calc-why-text">{recommendedMachine.equippedDesc}</p>
                  </div>
                )}

                <div className="calc-actions">
                  <a
                    href={dynamicWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary calc-cta-btn"
                  >
                    <MessageCircle size={18} /> Cotizar Ficha {recommendedMachine.code} por WhatsApp <ArrowRight size={16} />
                  </a>

                  <button
                    type="button"
                    className="btn btn-outline calc-scroll-btn"
                    onClick={() => scrollToFicha(recommendedMachine.code)}
                  >
                    Ir a la Ficha Técnica #{recommendedMachine.code} <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONDICIONES COMERCIALES PARA COTIZAR (DEL CATÁLOGO OFICIAL) ─── */}
      <section className="section-pad catalog-conditions-section">
        <div className="container">
          <div className="catalog-conditions-card reveal maq-reveal">
            <div className="catalog-conditions-top">
              <div className="catalog-conditions-brand">
                <span className="label-upper" style={{ color: '#F7BC21' }}>Información Comercial Oficial</span>
                <h3>MAQTECOLOMBIA S.A.S.</h3>
                <p>Florencia, Caquetá, Colombia · WhatsApp: {BRAND.phone} · www.maqtecolombia.co</p>
              </div>
              <div className="catalog-conditions-badge">
                <ShieldCheck size={18} /> Edición Comercial 2026
              </div>
            </div>
            <div className="catalog-conditions-body">
              <h4>Condiciones para Cotizar</h4>
              <p>{CATALOG_CONDITIONS}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN: INNOVACIÓN Y NUEVOS DESARROLLOS ─── */}
      <section className="section-pad inno-section">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} /> Tecnología e I+D Maqte
            </span>
            <h2 className="heading-xl" style={{ color: '#111827' }}>
              Innovación y <span style={{ color: '#D97706' }}>Nuevos Desarrollos</span>
            </h2>
            <p className="section-subtitle">
              Trabajamos constantemente en prototipos avanzados y tecnologías sostenibles para transformar la industria de los prefabricados en Colombia.
            </p>
          </div>

          <div className="inno-grid">
            {INNOVATION_ITEMS.map((item) => (
              <div key={item.id} className="inno-card reveal maq-reveal">
                <div className="inno-header">
                  <span className="inno-tag">{item.tag}</span>
                  <span className="inno-status">{item.status}</span>
                </div>
                <h3 className="inno-title">{item.title}</h3>
                <p className="inno-desc">{item.desc}</p>
                <div className="inno-footer">
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}?text=SW- Hola, me gustaría recibir más información acerca de sus proyectos de innovación: ${item.title}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', borderColor: '#D1D5DB', color: '#111827' }}
                  >
                    Consultar disponibilidad & información
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANNER FINAL DE ASESORÍA Y CONVERSIÓN PREMIUM ─── */}
      <section className="section-pad maq-cta-section">
        <div className="container">
          <div className="maq-cta-box reveal-scale maq-reveal">
            <div className="maq-cta-bg-glow" />
            <div className="maq-cta-inner">
              {/* Left Column: Information & Trust */}
              <div className="maq-cta-left">
                <span className="maq-cta-badge">
                  <Zap size={14} /> Acompañamiento Técnico & Comercial Directo
                </span>
                <h2 className="maq-cta-title">
                  ¿Listo para cotizar tu <span className="maq-cta-gold">Máquina o Línea Equipada?</span>
                </h2>
                <p className="maq-cta-sub">
                  Te brindamos asesoría directa desde Florencia, Caquetá para todo el país: confirmación de moldes incluidos, transporte, instalación, puesta en marcha y configuración de planta.
                </p>

                {/* Trust Pills Bar */}
                <div className="maq-cta-trust-bar">
                  <div className="maq-cta-trust-pill">
                    <Wrench size={15} className="maq-cta-pill-icon" />
                    <span>Montaje y Puesta en Marcha</span>
                  </div>
                  <div className="maq-cta-trust-pill">
                    <ShieldCheck size={15} className="maq-cta-pill-icon" />
                    <span>Fabricación Nacional Garantizada</span>
                  </div>
                  <div className="maq-cta-trust-pill">
                    <Sparkles size={15} className="maq-cta-pill-icon" />
                    <span>Moldes Intercambiables</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Direct WhatsApp Action Card */}
              <div className="maq-cta-right">
                <div className="maq-cta-action-card">
                  <div className="maq-cta-card-header">
                    <span className="maq-cta-card-badge">
                      <span className="maq-cta-pulse-dot" /> Atención Directa Maqte
                    </span>
                    <span className="maq-cta-card-time">{BRAND.phone}</span>
                  </div>

                  <a
                    href={`https://wa.me/${BRAND.whatsapp}?text=SW- Hola, deseo recibir una cotización formal del Catálogo de Maquinaria 2026 de Maqte Colombia.`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary maq-cta-main-btn"
                  >
                    <MessageCircle size={20} /> Solicitar Cotización por WhatsApp <ArrowRight size={18} />
                  </a>

                  <Link to="/contacto" className="maq-cta-sub-link">
                    O prefiere enviar un mensaje por formulario web <ArrowRight size={14} />
                  </Link>

                  <div className="maq-cta-card-footer">
                    <ShieldCheck size={14} /> Atención personalizada para proyectos en toda Colombia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
