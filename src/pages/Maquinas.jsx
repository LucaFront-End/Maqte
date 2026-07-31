import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, Zap, Users, Maximize2, Gauge,
  RotateCw, ArrowRightLeft, Layers, Grid, Sparkles, Cpu,
  HelpCircle, MessageCircle, ChevronDown, Building2, ShieldCheck, Wrench,
  SlidersHorizontal, Check, Award
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  BRAND,
  MACHINE_LINES,
  COMPLEMENTARY_EQUIPMENT,
  INNOVATION_ITEMS
} from '../data/content';
import './Maquinas.css';

// Helper icon mapping for complementary equipment
const COMPLEMENTARY_ICONS = {
  RotateCw,
  ArrowRightLeft,
  Layers,
  Grid
};

export default function Maquinas() {
  useScrollReveal('.maq-reveal');

  // Calculator State (3 Questions)
  const [productionTarget, setProductionTarget] = useState('semindustrial'); // Default option
  const [budgetLevel, setBudgetLevel] = useState('moderado');
  const [operatorCount, setOperatorCount] = useState('2-4');

  // Filter or Active machine detail highlight state
  const [activeLineId, setActiveLineId] = useState(null);

  // Match recommendation logic
  const recommendedLine = useMemo(() => {
    let scores = {
      artesanal: 0,
      semindustrial: 0,
      industrial: 0,
      'industrial-alta': 0,
      automatica: 0
    };

    if (productionTarget === 'artesanal') {
      scores.artesanal += 50;
      scores.semindustrial += 20;
    } else if (productionTarget === 'semindustrial') {
      scores.semindustrial += 50;
      scores.artesanal += 15;
      scores.industrial += 15;
    } else if (productionTarget === 'industrial') {
      scores.industrial += 50;
      scores.semindustrial += 15;
      scores['industrial-alta'] += 20;
    } else if (productionTarget === 'industrial-alta') {
      scores['industrial-alta'] += 50;
      scores.industrial += 20;
      scores.automatica += 20;
    } else if (productionTarget === 'automatica') {
      scores.automatica += 50;
      scores['industrial-alta'] += 20;
    }

    if (budgetLevel === 'bajo') {
      scores.artesanal += 35;
      scores.semindustrial += 15;
    } else if (budgetLevel === 'moderado') {
      scores.semindustrial += 35;
      scores.artesanal += 15;
      scores.industrial += 10;
    } else if (budgetLevel === 'medio-alto') {
      scores.industrial += 35;
      scores.semindustrial += 10;
      scores['industrial-alta'] += 15;
    } else if (budgetLevel === 'alto') {
      scores['industrial-alta'] += 35;
      scores.automatica += 20;
    } else if (budgetLevel === 'premium') {
      scores.automatica += 35;
      scores['industrial-alta'] += 15;
    }

    if (operatorCount === '1-2') {
      scores.artesanal += 25;
      scores.semindustrial += 10;
    } else if (operatorCount === '2-4') {
      scores.semindustrial += 25;
      scores.automatica += 20;
    } else if (operatorCount === '4-6') {
      scores.industrial += 25;
      scores['industrial-alta'] += 20;
    } else if (operatorCount === '5+') {
      scores['industrial-alta'] += 25;
      scores.industrial += 15;
      scores.automatica += 15;
    }

    let bestId = 'semindustrial';
    let maxScore = -1;
    Object.keys(scores).forEach(id => {
      if (scores[id] > maxScore) {
        maxScore = scores[id];
        bestId = id;
      }
    });

    return MACHINE_LINES.find(line => line.id === bestId) || MACHINE_LINES[1];
  }, [productionTarget, budgetLevel, operatorCount]);

  const dynamicWhatsappUrl = useMemo(() => {
    const prodLabel =
      productionTarget === 'artesanal' ? '200 - 300 bloques/día' :
      productionTarget === 'semindustrial' ? '600 - 700 bloques/día' :
      productionTarget === 'industrial' ? '3.000 - 5.000 bloques/día' :
      productionTarget === 'industrial-alta' ? '7.000 - 8.000 bloques/día' :
      '8.000 - 10.000+ bloques/día (Automática)';

    const text = `SW- Hola, utilicé la herramienta '¿Qué máquina necesito?' en la página de Maqte Colombia.\n\n` +
      `📋 Mis requerimientos:\n` +
      `• Producción deseada: ${prodLabel}\n` +
      `• Nivel de presupuesto: ${budgetLevel.toUpperCase()}\n` +
      `• Personal disponible: ${operatorCount} operarios\n\n` +
      `🎯 Máquina recomendada: ${recommendedLine.name}\n` +
      `Me gustaría recibir una cotización detallada y asesoría comercial.`;

    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [productionTarget, budgetLevel, operatorCount, recommendedLine]);

  const scrollToMachine = (id) => {
    setActiveLineId(id);
    const element = document.getElementById(`linea-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <main className="maquinas-page">
      {/* ─── HERO SECTION (ULTRA PREMIUM 2-COLUMN) ─── */}
      <section className="page-hero maquinas-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <div className="maquinas-hero-grid">
            {/* Left Content Column */}
            <div className="maquinas-hero-left reveal-left maq-reveal">
              <span className="hero-badge-tag">
                <Zap size={14} className="hero-badge-icon" />
                Tecnología & Maquinaria Industrial Bloquera
              </span>
              <h1 className="display-lg hero-main-title">
                Fuerza e Ingeniería en <span className="hero-gold-text">Maquinaria Bloquera</span>
              </h1>
              <p className="maquinas-hero-sub">
                Potencia la productividad de tu obra o fábrica con la clasificación oficial Maqte: 
                desde líneas artesanales para autoconstrucción hasta plantas automáticas HMI/PLC de alta escala en Colombia.
              </p>

              {/* Spec Stat Badges Bar */}
              <div className="hero-stats-row">
                <div className="hero-stat-chip reveal maq-reveal reveal-delay-1">
                  <Gauge size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">200 a 10.000+</span>
                    <span className="hero-stat-lbl">Bloques por día</span>
                  </div>
                </div>

                <div className="hero-stat-chip reveal maq-reveal reveal-delay-2">
                  <ShieldCheck size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">100% Garantía</span>
                    <span className="hero-stat-lbl">Soporte en Colombia</span>
                  </div>
                </div>

                <div className="hero-stat-chip reveal maq-reveal reveal-delay-3">
                  <Cpu size={16} className="hero-stat-icon" />
                  <div>
                    <span className="hero-stat-val">PLC & HMI</span>
                    <span className="hero-stat-lbl">Sistemas Digitales</span>
                  </div>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="maquinas-hero-actions reveal maq-reveal reveal-delay-4">
                <a href="#calculadora" className="btn btn-primary hero-btn-main">
                  <Sparkles size={18} /> ¿Qué máquina necesito?
                </a>
                <a href="#lineas" className="btn btn-outline hero-btn-sub">
                  Explorar Catálogo <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Showcase Frame */}
            <div className="maquinas-hero-right reveal-right maq-reveal reveal-delay-2">
              <div className="hero-showcase-frame">
                <img
                  src="/images/maquinas/hero_showcase.png"
                  alt="Planta de Maquinaria Industrial Bloquera Maqte Colombia"
                  className="hero-showcase-img"
                />
                <div className="hero-img-gradient-overlay" />
                <div className="hero-top-badge">
                  <Award size={14} /> Distribuidor Oficial Colombia
                </div>
                <div className="hero-bottom-floating-card">
                  <div className="hero-float-icon">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <span className="hero-float-title">Líneas Llave en Mano</span>
                    <span className="hero-float-sub">Instalación, moldes & asesoría técnica</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN INTERACTIVA PREMIUM: ¿QUÉ MÁQUINA NECESITO? ─── */}
      <section id="calculadora" className="section-pad calc-section">
        <div className="container">
          <div className="section-header calc-header reveal maq-reveal">
            <span className="label-upper" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
              <Sparkles size={14} /> Asesor Virtual de Selección
            </span>
            <h2 className="heading-xl" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
              ¿Qué máquina <span className="calc-title-highlight">necesito?</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '720px', margin: '0.75rem auto 0' }}>
              Selecciona tus metas operativas y nuestro algoritmo configurador calculará de inmediato la línea de maquinaria exacta para tu proyecto.
            </p>
          </div>

          <div className="calc-container">
            {/* Form Column */}
            <div className="calc-form reveal-left maq-reveal">
              <div className="calc-form-header">
                <div>
                  <span className="calc-form-subheading">Configurador paso a paso</span>
                  <h3 className="calc-form-main-title">Parámetros de Producción</h3>
                </div>
                <div className="calc-progress-pill">
                  <Sparkles size={14} /> 3 / 3 Completados
                </div>
              </div>

              {/* Question 1: Production Target */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">01</div>
                  <div>
                    <label className="calc-label">
                      ¿Cuántos bloques desea producir por día?
                    </label>
                    <span className="calc-label-hint">Selecciona tu meta de volumen diario</span>
                  </div>
                </div>
                <div className="calc-options-grid">
                  {[
                    { id: 'artesanal', label: '200 a 300', tag: 'bloques/día', sub: 'Línea Artesanal' },
                    { id: 'semindustrial', label: '600 a 700', tag: 'bloques/día', sub: 'Semindustrial' },
                    { id: 'industrial', label: '3.000 a 5.000', tag: 'bloques/día', sub: 'Industrial' },
                    { id: 'industrial-alta', label: '7.000 a 8.000', tag: 'bloques/día', sub: 'Alta Producción' },
                    { id: 'automatica', label: '8.000 a 10.000+', tag: 'bloques/día', sub: 'Automática PLC' }
                  ].map(opt => {
                    const isSelected = productionTarget === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setProductionTarget(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected ? (
                            <span className="calc-opt-check"><Check size={12} /></span>
                          ) : null}
                        </div>
                        <span className="calc-opt-tag">{opt.tag}</span>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Budget Level */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">02</div>
                  <div>
                    <label className="calc-label">
                      ¿Cuál es su presupuesto de inversión?
                    </label>
                    <span className="calc-label-hint">Define el alcance del capital disponible</span>
                  </div>
                </div>
                <div className="calc-options-grid">
                  {[
                    { id: 'bajo', label: 'Inicial / Económica', tag: 'Entrada', sub: 'Equipos Artesanales' },
                    { id: 'moderado', label: 'Moderado', tag: 'Equilibrado', sub: 'Semindustrial' },
                    { id: 'medio-alto', label: 'Medio - Alto', tag: 'Robusto', sub: 'Industrial' },
                    { id: 'alto', label: 'Alto Industrial', tag: 'Gran Escala', sub: 'Planta Continua' },
                    { id: 'premium', label: 'Premium PLC', tag: 'Automático', sub: 'HMI Digital' }
                  ].map(opt => {
                    const isSelected = budgetLevel === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setBudgetLevel(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected ? (
                            <span className="calc-opt-check"><Check size={12} /></span>
                          ) : null}
                        </div>
                        <span className="calc-opt-tag">{opt.tag}</span>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Operators Count */}
              <div className="calc-group">
                <div className="calc-group-header">
                  <div className="calc-step-num">03</div>
                  <div>
                    <label className="calc-label">
                      ¿Cuántos operarios tiene disponibles?
                    </label>
                    <span className="calc-label-hint">Capacidad de personal en planta</span>
                  </div>
                </div>
                <div className="calc-options-grid calc-grid-4">
                  {[
                    { id: '1-2', label: '1 a 2 operarios', sub: 'Equipo Reducido' },
                    { id: '2-4', label: '2 a 4 operarios', sub: 'Equipo Estándar' },
                    { id: '4-6', label: '4 a 6 operarios', sub: 'Equipo Amplio' },
                    { id: '5+', label: '5 o más operarios', sub: 'Planta Completa' }
                  ].map(opt => {
                    const isSelected = operatorCount === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`calc-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => setOperatorCount(opt.id)}
                      >
                        <div className="calc-opt-top">
                          <span className="calc-opt-val">{opt.label}</span>
                          {isSelected ? (
                            <span className="calc-opt-check"><Check size={12} /></span>
                          ) : null}
                        </div>
                        <span className="calc-opt-sub">{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recommendation Result Column (Diagnostic Terminal) */}
            <div className="calc-result reveal-right maq-reveal reveal-delay-2">
              <div className="calc-result-header">
                <div className="calc-result-badge">
                  <Sparkles size={14} /> Recomendación Calculada (100% Match)
                </div>
              </div>

              <div className="calc-recommended-card">
                <div className="calc-rec-header">
                  <div className="calc-rec-badge-tag">{recommendedLine.badge}</div>
                  <h3 className="calc-rec-title">{recommendedLine.name}</h3>
                  <p className="calc-rec-tagline">{recommendedLine.tagline}</p>
                </div>

                <div className="calc-rec-img-wrapper">
                  <img
                    src={recommendedLine.image}
                    alt={recommendedLine.name}
                    className="calc-rec-img"
                  />
                  <div className="calc-rec-img-overlay" />
                  <div className="calc-rec-img-badge">
                    <Award size={14} /> Elección Óptima
                  </div>
                </div>

                <div className="calc-specs-box">
                  <div className="calc-spec-item">
                    <div className="calc-spec-icon-box">
                      <Gauge size={16} />
                    </div>
                    <div>
                      <span className="calc-spec-lbl">Capacidad Diaria</span>
                      <span className="calc-spec-val">{recommendedLine.production}</span>
                    </div>
                  </div>

                  <div className="calc-spec-item">
                    <div className="calc-spec-icon-box">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="calc-spec-lbl">Operarios Requeridos</span>
                      <span className="calc-spec-val">{recommendedLine.operators}</span>
                    </div>
                  </div>

                  <div className="calc-spec-item">
                    <div className="calc-spec-icon-box">
                      <Maximize2 size={16} />
                    </div>
                    <div>
                      <span className="calc-spec-lbl">Área en Planta</span>
                      <span className="calc-spec-val">{recommendedLine.space}</span>
                    </div>
                  </div>
                </div>

                <div className="calc-why-box">
                  <h4 className="calc-why-title">
                    <CheckCircle2 size={15} style={{ display: 'inline', marginRight: '6px', color: '#D97706' }} />
                    Diagnóstico de coincidencia:
                  </h4>
                  <p className="calc-why-text">{recommendedLine.description}</p>
                </div>

                <div className="calc-actions">
                  <a
                    href={dynamicWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary calc-cta-btn"
                  >
                    <MessageCircle size={18} /> Cotizar esta Línea por WhatsApp <ArrowRight size={16} />
                  </a>

                  <button
                    type="button"
                    className="btn btn-outline calc-scroll-btn"
                    onClick={() => scrollToMachine(recommendedLine.id)}
                  >
                    Ver detalles completos en catálogo <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN: CLASIFICACIÓN DE MÁQUINAS ─── */}
      <section id="lineas" className="section-pad">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper">Catálogo Completo</span>
            <h2 className="heading-xl">
              Nuestras <span style={{ color: '#D97706' }}>5 Líneas de Producción</span>
            </h2>
            <p className="section-subtitle">
              Explora en detalle la capacidad, operarios y características de cada una de nuestras soluciones de maquinaria bloquera en Colombia.
            </p>
          </div>

          <div className="maquinas-lines-stack">
            {MACHINE_LINES.map((line, idx) => {
              const isActive = activeLineId === line.id;
              return (
                <div
                  key={line.id}
                  id={`linea-${line.id}`}
                  className={`maq-line-card ${isActive ? 'highlighted' : ''}`}
                  style={{
                    '--stack-idx': idx + 1,
                    top: `calc(88px + ${idx * 30}px)`,
                    zIndex: idx + 1
                  }}
                >
                  <div className="maq-line-img-col">
                    <div className="maq-line-badge-top">{line.badge}</div>
                    <img src={line.image} alt={line.name} className="maq-line-img" />
                    <div className="maq-line-img-glow" />
                  </div>

                  <div className="maq-line-content-col">
                    <div className="maq-line-header">
                      <span className="maq-line-number">0{idx + 1}</span>
                      <div>
                        <h3 className="maq-line-title">{line.name}</h3>
                        <p className="maq-line-tagline">{line.tagline}</p>
                      </div>
                    </div>

                    <p className="maq-line-desc">{line.description}</p>

                    {/* Spec Pill Grid */}
                    <div className="maq-line-specs-grid">
                      <div className="maq-line-spec-pill">
                        <Gauge size={16} className="maq-pill-icon" />
                        <div>
                          <span className="maq-pill-lbl">Producción / día</span>
                          <span className="maq-pill-val">{line.production}</span>
                        </div>
                      </div>

                      <div className="maq-line-spec-pill">
                        <Users size={16} className="maq-pill-icon" />
                        <div>
                          <span className="maq-pill-lbl">Operarios</span>
                          <span className="maq-pill-val">{line.operators}</span>
                        </div>
                      </div>

                      <div className="maq-line-spec-pill">
                        <Maximize2 size={16} className="maq-pill-icon" />
                        <div>
                          <span className="maq-pill-lbl">Espacio estimado</span>
                          <span className="maq-pill-val">{line.space}</span>
                        </div>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <div className="maq-line-features">
                      <h4 className="maq-features-heading">Ventajas Principales:</h4>
                      <ul className="maq-features-list">
                        {line.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <CheckCircle2 size={16} className="maq-check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="maq-line-footer">
                      <a
                        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(line.whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        <MessageCircle size={16} /> Solicitar Cotización
                      </a>
                      <a
                        href={`tel:${BRAND.phone}`}
                        className="btn btn-outline"
                      >
                        Llamar a Asesor
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN: EQUIPOS COMPLEMENTARIOS (DARK PREMIUM SHOWCASE) ─── */}
      <section className="section-pad comp-section">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper" style={{ color: '#F7BC21', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={14} /> Soluciones Integrales y Periféricas
            </span>
            <h2 className="heading-xl" style={{ color: '#FFFFFF' }}>
              Equipos <span style={{ color: '#F7BC21' }}>Complementarios</span>
            </h2>
            <p className="section-subtitle" style={{ color: 'rgba(245, 245, 245, 0.75)' }}>
              Sistemas periféricos de alto rendimiento diseñados para agilizar la preparación de mezcla, el transporte continuo y el moldeado especializado.
            </p>
          </div>

          {/* Featured Showcase Banner for Equipos Complementarios */}
          <div className="comp-showcase-card reveal maq-reveal">
            <div className="comp-showcase-img-wrap">
              <img
                src="/images/maquinas/equipos_complementarios.png"
                alt="Planta de Equipos Complementarios Maqte"
                className="comp-showcase-img"
              />
              <div className="comp-showcase-badge">
                <ShieldCheck size={14} /> Garantía Industrial Maqte
              </div>
            </div>
            <div className="comp-showcase-info">
              <span className="label-upper" style={{ color: '#F7BC21' }}>Planta de Procesamiento & Logística Interna</span>
              <h3 className="comp-showcase-title">Maximiza el rendimiento de tu línea de producción</h3>
              <p className="comp-showcase-desc">
                La integración de mezcladoras horizontales y bandas automatizadas reduce hasta un **40% el esfuerzo operativo manual**, 
                garantizando una mezcla homogénea constante y acelerando el suministro continuo hacia la máquina bloquera.
              </p>
              <div className="comp-showcase-bullets">
                <div className="comp-bullet">
                  <CheckCircle2 size={16} className="maq-check-icon" />
                  <span>Reducción de tiempos de amasado</span>
                </div>
                <div className="comp-bullet">
                  <CheckCircle2 size={16} className="maq-check-icon" />
                  <span>Dosificación exacta de agregados</span>
                </div>
                <div className="comp-bullet">
                  <CheckCircle2 size={16} className="maq-check-icon" />
                  <span>Aceros de alta resistencia al desgaste</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equipos Grid */}
          <div className="comp-grid">
            {COMPLEMENTARY_EQUIPMENT.map((item) => {
              const IconComponent = COMPLEMENTARY_ICONS[item.icon] || RotateCw;
              return (
                <div key={item.id} className="comp-card reveal maq-reveal">
                  <div className="comp-card-top-bar" />
                  <div className="comp-badge">{item.badge}</div>
                  <div className="comp-icon-box">
                    <IconComponent size={26} />
                  </div>
                  <h3 className="comp-title">{item.title}</h3>
                  <p className="comp-desc">{item.desc}</p>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}?text=SW- Hola, quisiera solicitar información sobre ${item.title}`}
                    target="_blank"
                    rel="noreferrer"
                    className="comp-link"
                  >
                    Consultar equipo <ArrowRight size={14} />
                  </a>
                </div>
              );
            })}
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

      {/* ─── BANNER FINAL DE ASESORÍA ─── */}
      <section className="section-pad maq-cta-section">
        <div className="container">
          <div className="maq-cta-box reveal maq-reveal">
            <div className="maq-cta-content">
              <span className="label-upper" style={{ color: '#0A0A0A', opacity: 0.9 }}>
                ¿Tienes dudas sobre la instalación o infraestructura?
              </span>
              <h2 className="heading-xl" style={{ color: '#0A0A0A', marginTop: '0.5rem' }}>
                Hablemos con un Especialista Técnico
              </h2>
              <p style={{ color: 'rgba(10,10,10,0.85)', marginTop: '0.75rem', fontSize: '1.05rem', maxWidth: '600px' }}>
                Te brindamos acompañamiento integral: diseño de planta, requerimientos eléctricos, distribución de espacio y cálculo de retorno de inversión.
              </p>
            </div>
            <div className="maq-cta-btns">
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=SW- Hola, deseo agendar una llamada con un asesor técnico de maquinaria.`}
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ background: '#0A0A0A', color: '#FFFFFF', fontWeight: 600 }}
              >
                <MessageCircle size={18} /> Agendar Asesoría por WhatsApp
              </a>
              <Link to="/contacto" className="btn" style={{ border: '2px solid #0A0A0A', color: '#0A0A0A', fontWeight: 600 }}>
                Enviar Mensaje por Formulario
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
