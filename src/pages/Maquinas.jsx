import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, ArrowRight, ArrowLeft, Zap, Gauge,
  Sparkles, Cpu, MessageCircle, ChevronDown,
  ShieldCheck, Wrench, Check, Award, Phone,
  FileText, Layers, Info, Tag, ShoppingBag, Eye,
  User, Mail, MapPin, Globe, Sliders, RotateCcw
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  BRAND,
  MACHINE_CATALOG_2026,
  MACHINE_CATEGORIES_2026,
  CATALOG_CONDITIONS,
  INNOVATION_ITEMS
} from '../data/content';
import { saveLeadStep1, updateLeadFinal } from '../lib/wixCms';
import MaquinasCarousel from '../components/MaquinasCarousel';
import './Maquinas.css';

const LINE_FILTERS = [
  { id: 'all', label: 'Todas las Fichas', count: 10 },
  { id: 'artesanal', label: 'Línea Artesanal', count: 3 },
  { id: 'semiindustrial', label: 'Línea Semiindustrial', count: 2 },
  { id: 'hidraulica-compacta', label: 'Hidráulica Compacta', count: 1 },
  { id: 'hidraulica-industrial', label: 'Hidráulica Industrial', count: 2 },
  { id: 'complementarios', label: 'Equipos Complementarios', count: 2 },
];

const WIZARD_STEPS = [
  { step: 1, short: 'Tus Datos', title: 'Datos de contacto' },
  { step: 2, short: 'Ladrillos / Día', title: 'Producción diaria' },
  { step: 3, short: 'Nivel Producción', title: 'Nivel de planta' },
  { step: 4, short: 'Presupuesto', title: 'Rango de inversión' },
  { step: 5, short: 'Tipo de Ladrillo', title: 'Formato a fabricar' },
  { step: 6, short: '¡Enviado!', title: 'Cotización lista' },
];

const DAILY_BRICKS_OPTIONS = [
  {
    id: 'hasta-300',
    label: 'Hasta 300 ladrillos / día',
    tag: 'Iniciación · Fichas 01–02',
    sub: 'Ideal para obra propia, autoconstrucción o taller inicial.',
  },
  {
    id: '300-900',
    label: '300 a 900 ladrillos / día',
    tag: 'Ponedora Móvil · Ficha 03',
    sub: '4 bloques H10 por ciclo descargando directo en pista.',
  },
  {
    id: '1000-2500',
    label: '1.000 a 2.500 ladrillos / día',
    tag: 'Semiindustrial · Fichas 04–05',
    sub: 'Abastecimiento continuo a ferreterías y obras locales.',
  },
  {
    id: '2500-4500',
    label: '2.500 a 4.500 ladrillos / día',
    tag: 'Hidráulica Compacta · Ficha 06',
    sub: 'Compactación hidráulica estacionaria de alta densidad.',
  },
  {
    id: '4500-7000',
    label: '4.500 a 7.000+ ladrillos / día',
    tag: 'Industrial / PLC · Fichas 07–08',
    sub: 'Planta industrial de alto volumen para constructoras.',
  },
];

const PROD_LEVEL_OPTIONS = [
  {
    id: 'artesanal-manual',
    label: 'Artesanal Compacta',
    tag: 'Fichas 01–02',
    sub: 'Operación manual pura o con motovibrador integrado.',
  },
  {
    id: 'artesanal-ponedora',
    label: 'Ponedora Móvil (Sin tablas)',
    tag: 'Ficha 03',
    sub: 'Deposita los bloques directamente sobre piso nivelado.',
  },
  {
    id: 'semiindustrial',
    label: 'Semiindustrial Estacionaria o Móvil',
    tag: 'Fichas 04–05',
    sub: 'Bloquera fija manual o ponedora grande de alto rendimiento.',
  },
  {
    id: 'hidraulica-compacta',
    label: 'Hidráulica Compacta Fija',
    tag: 'Ficha 06',
    sub: 'Accionamiento hidráulico individual o en línea equipada.',
  },
  {
    id: 'hidraulica-industrial',
    label: 'Hidráulica Industrial / Automática PLC',
    tag: 'Fichas 07–08',
    sub: 'Mandos hidráulicos industriales o automatización PLC Kinco + HMI 7”.',
  },
];

const BRICK_TYPE_OPTIONS = [
  {
    id: 'bloque-h10-h12',
    label: 'Bloque Estándar H10 / H12',
    tag: '10×20×40 y 12×20×40 cm',
    sub: 'El formato comercial de mayor rotación en ferreterías.',
  },
  {
    id: 'bloque-estructural',
    label: 'Bloque Estructural H15 / H20',
    tag: '15×20×40 y 20×20×40 cm',
    sub: 'Mampostería estructural y proyectos de ingeniería civil.',
  },
  {
    id: 'ladrillo-macizo',
    label: 'Ladrillo Macizo / Prensado',
    tag: 'Formato tradicional',
    sub: 'Ladrillo de concreto para muros portantes y fachadas.',
  },
  {
    id: 'adoquin',
    label: 'Adoquín Peatonal y Vehicular',
    tag: 'Tráfico liviano y pesado',
    sub: 'Proyectos de urbanismo, vías, parques y plazoletas.',
  },
  {
    id: 'multiformato',
    label: 'Varios Formatos (Moldes Intercambiables)',
    tag: 'Planta polivalente',
    sub: 'Fabricación de bloques, ladrillos, adoquines y bovedillas.',
  },
];

const BUDGET_PRESETS = [
  { val: 2100000, label: '$2.1M' },
  { val: 8300000, label: '$8.3M' },
  { val: 22000000, label: '$22M' },
  { val: 28000000, label: '$28M' },
  { val: 65800000, label: '$65.8M' },
  { val: 129800000, label: '$129.8M' },
  { val: 189800000, label: '$189.8M' },
];

function formatCOPAmount(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export default function Maquinas() {
  useScrollReveal('.maq-reveal');

  // Filter state for the 10 catalog fichas
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');
  const [activeFichaCode, setActiveFichaCode] = useState(null);

  // ── 6-Step Multi-Step Wizard State ──
  const [wizardStep, setWizardStep] = useState(1);
  const [contactForm, setContactForm] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    pais: 'Colombia',
    correo: '',
  });
  const [step1Error, setStep1Error] = useState('');
  const [savingCms, setSavingCms] = useState(false);
  const [leadRecord, setLeadRecord] = useState(null);

  // Steps 2 to 5 answers
  const [dailyBricks, setDailyBricks] = useState('300-900');
  const [prodLevel, setProdLevel] = useState('artesanal-ponedora');
  const [budgetCOP, setBudgetCOP] = useState(28000000);
  const [brickType, setBrickType] = useState('bloque-h10-h12');

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

    // Step 2: Daily bricks target
    if (dailyBricks === 'hasta-300') {
      scores['01'] += 45;
      scores['02'] += 50;
    } else if (dailyBricks === '300-900') {
      scores['03'] += 50;
      scores['02'] += 25;
      scores['04'] += 20;
    } else if (dailyBricks === '1000-2500') {
      scores['04'] += 45;
      scores['05'] += 50;
      scores['06'] += 20;
    } else if (dailyBricks === '2500-4500') {
      scores['06'] += 55;
      scores['05'] += 20;
      scores['07'] += 25;
    } else if (dailyBricks === '4500-7000') {
      scores['07'] += 50;
      scores['08'] += 60;
    }

    // Step 3: Production level
    if (prodLevel === 'artesanal-manual') {
      scores['01'] += 45;
      scores['02'] += 50;
    } else if (prodLevel === 'artesanal-ponedora') {
      scores['03'] += 55;
      scores['05'] += 20;
    } else if (prodLevel === 'semiindustrial') {
      scores['04'] += 45;
      scores['05'] += 50;
    } else if (prodLevel === 'hidraulica-compacta') {
      scores['06'] += 60;
    } else if (prodLevel === 'hidraulica-industrial') {
      scores['07'] += 50;
      scores['08'] += 60;
    }

    // Step 4: Budget slider in COP
    if (budgetCOP <= 3000000) {
      scores['01'] += 50;
      scores['02'] += 55;
    } else if (budgetCOP <= 14000000) {
      scores['03'] += 55;
      scores['04'] += 45;
    } else if (budgetCOP <= 25000000) {
      scores['05'] += 55;
      scores['04'] += 40;
    } else if (budgetCOP <= 70000000) {
      scores['06'] += 60;
      scores['05'] += 20;
    } else if (budgetCOP <= 135000000) {
      scores['07'] += 60;
      scores['08'] += 45;
    } else {
      scores['08'] += 65;
      scores['07'] += 35;
    }

    // Step 5: Brick / block type
    if (brickType === 'bloque-estructural' || brickType === 'adoquin') {
      scores['06'] += 15;
      scores['07'] += 20;
      scores['08'] += 20;
    } else if (brickType === 'multiformato') {
      scores['05'] += 15;
      scores['06'] += 20;
      scores['08'] += 25;
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
  }, [dailyBricks, prodLevel, budgetCOP, brickType]);

  const selectedDailyLabel =
    DAILY_BRICKS_OPTIONS.find(o => o.id === dailyBricks)?.label || dailyBricks;
  const selectedLevelLabel =
    PROD_LEVEL_OPTIONS.find(o => o.id === prodLevel)?.label || prodLevel;
  const selectedBrickLabel =
    BRICK_TYPE_OPTIONS.find(o => o.id === brickType)?.label || brickType;
  const formattedBudget = `${formatCOPAmount(budgetCOP)} COP`;

  const dynamicWhatsappUrl = useMemo(() => {
    const clientLine = contactForm.nombre
      ? `👤 *Cliente:* ${contactForm.nombre} (${contactForm.ciudad}, ${contactForm.pais})\n📞 *Tel:* ${contactForm.telefono} · ✉️ ${contactForm.correo}\n\n`
      : '';
    const text =
      `SW- Hola Maqte Colombia, completé el configurador de maquinaria en su web:\n\n` +
      clientLine +
      `🧱 *1. Ladrillos por día:* ${selectedDailyLabel}\n` +
      `⚙️ *2. Nivel de producción:* ${selectedLevelLabel}\n` +
      `💰 *3. Presupuesto estimado:* ${formattedBudget}\n` +
      `📐 *4. Tipo de ladrillo/bloque:* ${selectedBrickLabel}\n\n` +
      `🎯 *Máquina Recomendada:* Ficha ${recommendedMachine.code} — ${recommendedMachine.name} (${recommendedMachine.price}${recommendedMachine.equippedPrice ? ` | Línea equipada: ${recommendedMachine.equippedPrice}` : ''})\n\n` +
      `Quedo atento(a) a la cotización formal y asesoría técnica.`;
    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [
    contactForm,
    selectedDailyLabel,
    selectedLevelLabel,
    formattedBudget,
    selectedBrickLabel,
    recommendedMachine,
  ]);

  // Step 1 -> Step 2 handler (Saves lead immediately in Wix CMS)
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (
      !contactForm.nombre.trim() ||
      !contactForm.telefono.trim() ||
      !contactForm.ciudad.trim() ||
      !contactForm.pais.trim() ||
      !contactForm.correo.trim()
    ) {
      setStep1Error('Por favor completa todos tus datos de contacto para continuar.');
      return;
    }
    setStep1Error('');
    const contactSnapshot = { ...contactForm };
    const createdAt = new Date().toISOString();
    setLeadRecord({
      id: `pending_${Date.now()}`,
      wixId: null,
      syncedToWix: false,
      createdAt,
      contact: contactSnapshot,
    });
    setWizardStep(2);
    setSavingCms(true);
    try {
      const saved = await saveLeadStep1(contactSnapshot);
      setLeadRecord({
        id: saved.id,
        wixId: saved.wixId,
        syncedToWix: saved.syncedToWix,
        createdAt: saved.record?.fechaCreacion || createdAt,
        contact: contactSnapshot,
      });
    } finally {
      setSavingCms(false);
    }
  };

  // Step 5 -> Step 6 handler (Updates the CMS record created in Step 1 with all project answers)
  const handleFinishWizard = async () => {
    const currentLead = leadRecord || { contact: { ...contactForm } };
    setWizardStep(6);
    setSavingCms(true);
    try {
      const updated = await updateLeadFinal(
        currentLead,
        {
          dailyBricks,
          dailyBricksLabel: selectedDailyLabel,
          prodLevel,
          prodLevelLabel: selectedLevelLabel,
          budgetCOP,
          budgetFormatted: formattedBudget,
          brickType,
          brickTypeLabel: selectedBrickLabel,
        },
        recommendedMachine
      );
      setLeadRecord(prev => ({
        ...(prev || {}),
        id: updated.id,
        wixId: updated.wixId,
        syncedToWix: updated.syncedToWix,
        completed: true,
      }));
    } finally {
      setSavingCms(false);
    }
  };

  const handleResetWizard = () => {
    setWizardStep(1);
    setLeadRecord(null);
  };

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

      {/* ─── SECCIÓN DE CATEGORÍAS DE MAQUINARIA (ESTILO CATEGORÍAS) ─── */}
      <section id="categorias-maquinaria" className="section-pad mq-cats-section">
        <div className="container">
          <div className="section-header reveal maq-reveal">
            <span className="label-upper" style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} /> Líneas de Producción 2026
            </span>
            <h2 className="heading-xl">
              Explorar Maquinaria por <span style={{ color: '#D97706' }}>Categoría</span>
            </h2>
            <p className="section-subtitle">
              5 líneas especializadas según tu escala de inversión: desde equipos manuales para iniciar hoy mismo hasta plantas automáticas PLC Kinco.
            </p>
          </div>

          <div className="mq-cats-grid">
            {MACHINE_CATEGORIES_2026.map((cat) => {
              const catMachines = MACHINE_CATALOG_2026.filter(m => m.lineId === cat.id);
              return (
                <div
                  key={cat.id}
                  className="mq-cat-block reveal maq-reveal"
                  style={{ '--mq-cat-accent': cat.accent }}
                >
                  <div className="mq-cat-header">
                    <div className="mq-cat-icon-box">
                      <Layers size={22} />
                    </div>
                    <div className="mq-cat-header-text">
                      <div className="mq-cat-title-row">
                        <h3>{cat.title}</h3>
                        <span className="mq-cat-badge">{cat.badge}</span>
                      </div>
                      <p>{cat.description}</p>
                    </div>
                    <button
                      type="button"
                      className="mq-cat-filter-link"
                      onClick={() => {
                        setSelectedLineFilter(cat.id);
                        document.getElementById('fichas')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Ver fichas <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="mq-cat-subs-grid">
                    {catMachines.map(m => (
                      <Link
                        key={m.id}
                        to={`/maquinas/${m.id}`}
                        className="mq-cat-sub-card"
                      >
                        <img src={m.image} alt={m.name} className="mq-cat-sub-thumb" loading="lazy" />
                        <div className="mq-cat-sub-info">
                          <span className="mq-cat-sub-code">FICHA {m.code} · {m.priceShort}</span>
                          <strong className="mq-cat-sub-name">{m.name}</strong>
                        </div>
                        <ArrowRight size={15} className="mq-cat-sub-arrow" />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
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
                        <div className="portfolio-row-btns">
                          <Link
                            to={`/maquinas/${item.id}`}
                            className="portfolio-detail-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver detalles
                          </Link>
                          <button
                            type="button"
                            className="portfolio-go-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToFicha(item.code);
                            }}
                          >
                            Ficha <ArrowRight size={14} />
                          </button>
                        </div>
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
                    <Link to={`/maquinas/${item.id}`} className="ficha-media-link" title={`Ver página de ${item.name}`}>
                      <img
                        src={item.image}
                        alt={`${item.code} - ${item.name}`}
                        className="ficha-main-img maq-line-img"
                        loading="lazy"
                      />
                    </Link>
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
                          <Link to={`/maquinas/${item.id}`} className="ficha-title-link">
                            <h3 className="ficha-title">{item.name}</h3>
                          </Link>
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

                    {/* Footer Actions: Comprar · Cotizar · Ver detalles */}
                    <div className="ficha-actions-footer">
                      <a
                        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                          `SW- Hola Maqte Colombia, quiero COMPRAR la Ficha ${item.code}: ${item.name} (${item.price}). Por favor indíquenme el proceso de pedido y pago.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary ficha-cta-buy"
                      >
                        <ShoppingBag size={17} /> Comprar
                      </a>

                      <a
                        href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(item.whatsappMsg)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline ficha-cta-quote"
                      >
                        <MessageCircle size={17} /> Cotizar Ficha {item.code}
                      </a>

                      <Link
                        to={`/maquinas/${item.id}`}
                        className="btn btn-outline ficha-cta-details"
                      >
                        <Eye size={16} /> Ver detalles <ArrowRight size={15} />
                      </Link>

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
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN INTERACTIVA MULTI-PASO (6 PASOS CON GUARDADO EN CMS) ─── */}
      <section id="calculadora" className="section-pad calc-section">
        <div className="container">
          <div className="section-header calc-header reveal maq-reveal">
            <span className="label-upper" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D97706' }}>
              <Sparkles size={14} /> Configurador Interactivo Multi-Paso 2026
            </span>
            <h2 className="heading-xl" style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>
              ¿Qué máquina <span className="calc-title-highlight">necesito?</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '700px', margin: '0.75rem auto 0' }}>
              Completa estos 5 pasos rápidos para guardar tu proyecto, descubrir tu máquina ideal y recibir tu cotización personalizada en WhatsApp.
            </p>
          </div>

          <div className="calc-container">
            {/* Multi-Step Wizard Column */}
            <div className="calc-form calc-wizard-card reveal-left maq-reveal">
              <div className="calc-form-header">
                <div>
                  <span className="calc-form-subheading">
                    Paso {wizardStep} de 6 · {WIZARD_STEPS[wizardStep - 1]?.title}
                  </span>
                  <h3 className="calc-form-main-title">Parámetros de tu Proyecto</h3>
                </div>
                <div className="calc-progress-pill">
                  <Sparkles size={14} />
                  {leadRecord ? 'Guardado en CMS Activo' : 'Catálogo Oficial 2026'}
                </div>
              </div>

              {/* 6-Step Progress Bar */}
              <div className="calc-wizard-stepper" role="tablist" aria-label="Pasos del configurador">
                {WIZARD_STEPS.map(s => {
                  const isActive = wizardStep === s.step;
                  const isDone = wizardStep > s.step;
                  const canJump = s.step === 1 || Boolean(leadRecord);
                  return (
                    <button
                      key={s.step}
                      type="button"
                      className={`calc-wizard-step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                      onClick={() => {
                        if (canJump && s.step < 6) setWizardStep(s.step);
                      }}
                      disabled={!canJump || s.step === 6}
                    >
                      <span className="calc-wizard-step-num">
                        {isDone ? <Check size={12} /> : `0${s.step}`}
                      </span>
                      <span className="calc-wizard-step-lbl">{s.short}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── PASO 1: DATOS DE CONTACTO (SE GUARDA DESDE EL PASO 1 EN CMS) ── */}
              {wizardStep === 1 && (
                <form className="calc-step-panel" onSubmit={handleStep1Submit}>
                  <div className="calc-group-header">
                    <div className="calc-step-num">01</div>
                    <div>
                      <label className="calc-label">Tus datos de contacto</label>
                      <span className="calc-label-hint">
                        Guardamos tu solicitud desde este primer paso para enviarte la cotización técnica.
                      </span>
                    </div>
                  </div>

                  {step1Error && <div className="calc-step-error">{step1Error}</div>}

                  <div className="calc-contact-grid">
                    <div className="calc-field calc-field-full">
                      <label htmlFor="wiz-nombre">
                        <User size={14} /> Nombre completo *
                      </label>
                      <input
                        id="wiz-nombre"
                        type="text"
                        required
                        placeholder="Ej. Carlos Andrés Ramírez"
                        value={contactForm.nombre}
                        onChange={e => setContactForm(prev => ({ ...prev, nombre: e.target.value }))}
                      />
                    </div>

                    <div className="calc-field">
                      <label htmlFor="wiz-telefono">
                        <Phone size={14} /> Teléfono / WhatsApp *
                      </label>
                      <input
                        id="wiz-telefono"
                        type="tel"
                        required
                        placeholder="Ej. +57 310 000 0000"
                        value={contactForm.telefono}
                        onChange={e => setContactForm(prev => ({ ...prev, telefono: e.target.value }))}
                      />
                    </div>

                    <div className="calc-field">
                      <label htmlFor="wiz-correo">
                        <Mail size={14} /> Correo electrónico *
                      </label>
                      <input
                        id="wiz-correo"
                        type="email"
                        required
                        placeholder="Ej. gerencia@constructora.com"
                        value={contactForm.correo}
                        onChange={e => setContactForm(prev => ({ ...prev, correo: e.target.value }))}
                      />
                    </div>

                    <div className="calc-field">
                      <label htmlFor="wiz-ciudad">
                        <MapPin size={14} /> Ciudad *
                      </label>
                      <input
                        id="wiz-ciudad"
                        type="text"
                        required
                        placeholder="Ej. Florencia / Bogotá / Medellín"
                        value={contactForm.ciudad}
                        onChange={e => setContactForm(prev => ({ ...prev, ciudad: e.target.value }))}
                      />
                    </div>

                    <div className="calc-field">
                      <label htmlFor="wiz-pais">
                        <Globe size={14} /> País *
                      </label>
                      <input
                        id="wiz-pais"
                        type="text"
                        required
                        placeholder="Ej. Colombia"
                        value={contactForm.pais}
                        onChange={e => setContactForm(prev => ({ ...prev, pais: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="calc-wizard-nav">
                    <span className="calc-cms-note">
                      <ShieldCheck size={15} /> Tus datos se registran de forma segura en nuestro CMS.
                    </span>
                    <button
                      type="submit"
                      className="btn btn-primary calc-next-btn"
                      disabled={savingCms}
                    >
                      {savingCms ? 'Guardando en CMS...' : 'Guardar y Continuar al Paso 2'} <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ── PASO 2: ¿CUÁNTOS LADRILLOS BUSCAS HACER POR DÍA? ── */}
              {wizardStep === 2 && (
                <div className="calc-step-panel">
                  <div className="calc-group-header">
                    <div className="calc-step-num">02</div>
                    <div>
                      <label className="calc-label">
                        ¿Cuántos ladrillos o bloques buscas hacer por día?
                      </label>
                      <span className="calc-label-hint">
                        Elige el volumen diario estimado para tu jornada de producción.
                      </span>
                    </div>
                  </div>

                  <div className="calc-wizard-cards">
                    {DAILY_BRICKS_OPTIONS.map(opt => {
                      const isSelected = dailyBricks === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`calc-option-card calc-option-wide ${isSelected ? 'active' : ''}`}
                          onClick={() => setDailyBricks(opt.id)}
                        >
                          <div className="calc-opt-top">
                            <span className="calc-opt-val">{opt.label}</span>
                            {isSelected && (
                              <span className="calc-opt-check">
                                <Check size={12} />
                              </span>
                            )}
                          </div>
                          <span className="calc-opt-tag">{opt.tag}</span>
                          <span className="calc-opt-sub">{opt.sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="calc-wizard-nav">
                    <button
                      type="button"
                      className="btn btn-outline calc-prev-btn"
                      onClick={() => setWizardStep(1)}
                    >
                      <ArrowLeft size={16} /> Paso Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary calc-next-btn"
                      onClick={() => setWizardStep(3)}
                    >
                      Siguiente: Nivel de Producción <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: ¿QUÉ NIVEL DE PRODUCCIÓN BUSCAS? ── */}
              {wizardStep === 3 && (
                <div className="calc-step-panel">
                  <div className="calc-group-header">
                    <div className="calc-step-num">03</div>
                    <div>
                      <label className="calc-label">
                        ¿Qué nivel de producción o línea buscas?
                      </label>
                      <span className="calc-label-hint">
                        Selecciona el sistema operativo que mejor se adapta a tu planta.
                      </span>
                    </div>
                  </div>

                  <div className="calc-wizard-cards">
                    {PROD_LEVEL_OPTIONS.map(opt => {
                      const isSelected = prodLevel === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`calc-option-card calc-option-wide ${isSelected ? 'active' : ''}`}
                          onClick={() => setProdLevel(opt.id)}
                        >
                          <div className="calc-opt-top">
                            <span className="calc-opt-val">{opt.label}</span>
                            {isSelected && (
                              <span className="calc-opt-check">
                                <Check size={12} />
                              </span>
                            )}
                          </div>
                          <span className="calc-opt-tag">{opt.tag}</span>
                          <span className="calc-opt-sub">{opt.sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="calc-wizard-nav">
                    <button
                      type="button"
                      className="btn btn-outline calc-prev-btn"
                      onClick={() => setWizardStep(2)}
                    >
                      <ArrowLeft size={16} /> Paso Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary calc-next-btn"
                      onClick={() => setWizardStep(4)}
                    >
                      Siguiente: Presupuesto <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 4: ¿QUÉ PRESUPUESTO TIENES? (BARRA INTERACTIVA) ── */}
              {wizardStep === 4 && (
                <div className="calc-step-panel">
                  <div className="calc-group-header">
                    <div className="calc-step-num">04</div>
                    <div>
                      <label className="calc-label">
                        ¿Cuál es tu presupuesto estimado de inversión?
                      </label>
                      <span className="calc-label-hint">
                        Desliza la barra o toca un valor de referencia en pesos colombianos (COP).
                      </span>
                    </div>
                  </div>

                  <div className="calc-budget-slider-box">
                    <div className="calc-budget-display">
                      <span className="calc-budget-caption">
                        <Sliders size={14} /> Presupuesto Seleccionado
                      </span>
                      <strong className="calc-budget-amount">{formattedBudget}</strong>
                      <span className="calc-budget-tier">
                        {budgetCOP <= 3000000
                          ? 'Rango Línea Artesanal Compacta ($1.3M – $2.1M)'
                          : budgetCOP <= 25000000
                          ? 'Rango Ponedoras y Semiindustrial ($8.3M – $22M)'
                          : budgetCOP <= 70000000
                          ? 'Rango Hidráulica Compacta Base o Equipada ($28M – $65.8M)'
                          : budgetCOP <= 135000000
                          ? 'Rango Hidráulica Industrial / PLC Base ($88M – $129.8M)'
                          : 'Rango Planta Industrial / PLC Línea Equipada ($130M – $189.8M)'}
                      </span>
                    </div>

                    <div className="calc-range-wrap">
                      <input
                        id="wiz-budget-range"
                        type="range"
                        min={1300000}
                        max={190000000}
                        step={500000}
                        value={budgetCOP}
                        onChange={e => setBudgetCOP(Number(e.target.value))}
                        className="calc-budget-range-input"
                      />
                      <div className="calc-range-minmax">
                        <span>$1.300.000 COP</span>
                        <span>$190.000.000 COP</span>
                      </div>
                    </div>

                    <div className="calc-budget-presets">
                      {BUDGET_PRESETS.map(p => (
                        <button
                          key={p.val}
                          type="button"
                          className={`calc-budget-chip ${Math.abs(budgetCOP - p.val) < 600000 ? 'active' : ''}`}
                          onClick={() => setBudgetCOP(p.val)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="calc-wizard-nav">
                    <button
                      type="button"
                      className="btn btn-outline calc-prev-btn"
                      onClick={() => setWizardStep(3)}
                    >
                      <ArrowLeft size={16} /> Paso Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary calc-next-btn"
                      onClick={() => setWizardStep(5)}
                    >
                      Siguiente: Tipo de Ladrillo <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 5: ¿QUÉ TIPO DE LADRILLO TE INTERESA HACER? ── */}
              {wizardStep === 5 && (
                <div className="calc-step-panel">
                  <div className="calc-group-header">
                    <div className="calc-step-num">05</div>
                    <div>
                      <label className="calc-label">
                        ¿Qué tipo de ladrillo o bloque te interesa fabricar?
                      </label>
                      <span className="calc-label-hint">
                        Elige el formato principal para configurar los moldes de tu máquina.
                      </span>
                    </div>
                  </div>

                  <div className="calc-wizard-cards">
                    {BRICK_TYPE_OPTIONS.map(opt => {
                      const isSelected = brickType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`calc-option-card calc-option-wide ${isSelected ? 'active' : ''}`}
                          onClick={() => setBrickType(opt.id)}
                        >
                          <div className="calc-opt-top">
                            <span className="calc-opt-val">{opt.label}</span>
                            {isSelected && (
                              <span className="calc-opt-check">
                                <Check size={12} />
                              </span>
                            )}
                          </div>
                          <span className="calc-opt-tag">{opt.tag}</span>
                          <span className="calc-opt-sub">{opt.sub}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="calc-wizard-nav">
                    <button
                      type="button"
                      className="btn btn-outline calc-prev-btn"
                      onClick={() => setWizardStep(4)}
                    >
                      <ArrowLeft size={16} /> Paso Anterior
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary calc-finish-btn"
                      onClick={handleFinishWizard}
                      disabled={savingCms}
                    >
                      {savingCms ? 'Actualizando en CMS...' : 'Finalizar y Guardar Configuración'} <CheckCircle2 size={17} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── PASO 6: ¡ENVIADO CON ÉXITO! + BOTÓN COTIZACIÓN A WHATSAPP CON LA INFO ── */}
              {wizardStep === 6 && (
                <div className="calc-step-panel calc-step-success">
                  <div className="calc-success-banner">
                    <div className="calc-success-icon">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <span className="calc-success-badge">
                        Paso 6 de 6 · Registro Actualizado en CMS
                      </span>
                      <h4 className="calc-success-title">
                        ¡Enviado con éxito{contactForm.nombre ? `, ${contactForm.nombre}` : ''}!
                      </h4>
                      <p className="calc-success-desc">
                        Hemos guardado tus datos y actualizado tu perfil de proyecto con la máquina ideal recomendada para tu operación.
                      </p>
                    </div>
                  </div>

                  <div className="calc-summary-grid">
                    <div className="calc-summary-item">
                      <small>Cliente y Ubicación</small>
                      <strong>
                        {contactForm.nombre || 'Cliente Maqte'} · {contactForm.ciudad}, {contactForm.pais}
                      </strong>
                      <span>
                        {contactForm.telefono} · {contactForm.correo}
                      </span>
                    </div>
                    <div className="calc-summary-item">
                      <small>Producción Diaria Buscada</small>
                      <strong>{selectedDailyLabel}</strong>
                    </div>
                    <div className="calc-summary-item">
                      <small>Nivel de Producción</small>
                      <strong>{selectedLevelLabel}</strong>
                    </div>
                    <div className="calc-summary-item">
                      <small>Presupuesto Estimado</small>
                      <strong>{formattedBudget}</strong>
                    </div>
                    <div className="calc-summary-item">
                      <small>Tipo de Ladrillo / Bloque</small>
                      <strong>{selectedBrickLabel}</strong>
                    </div>
                    <div className="calc-summary-item highlight">
                      <small>Máquina Recomendada</small>
                      <strong>
                        Ficha {recommendedMachine.code} — {recommendedMachine.name}
                      </strong>
                      <span>{recommendedMachine.price}</span>
                    </div>
                  </div>

                  <div className="calc-success-actions">
                    <a
                      href={dynamicWhatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary calc-wa-final-btn"
                    >
                      <MessageCircle size={19} /> Enviar Cotización a WhatsApp con toda mi Info <ArrowRight size={17} />
                    </a>

                    <div className="calc-success-secondary-row">
                      <Link
                        to={`/maquinas/${recommendedMachine.id}`}
                        className="btn btn-outline"
                      >
                        <Eye size={16} /> Ver Página de Ficha #{recommendedMachine.code}
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline calc-reset-btn"
                        onClick={handleResetWizard}
                      >
                        <RotateCcw size={15} /> Hacer otra consulta
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

                  <Link
                    to={`/maquinas/${recommendedMachine.id}`}
                    className="btn btn-outline calc-scroll-btn"
                  >
                    <Eye size={16} /> Ver Página Completa de Ficha #{recommendedMachine.code} <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline calc-scroll-btn"
                    onClick={() => scrollToFicha(recommendedMachine.code)}
                  >
                    Ir a la Ficha en esta página <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CARRUSEL DE MAQUINARIA Y PÁGINAS DE PRODUCTO ─── */}
      <MaquinasCarousel />

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
