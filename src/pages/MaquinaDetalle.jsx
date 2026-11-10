import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ChevronRight, ShoppingBag, MessageCircle,
  Phone, ShieldCheck, Truck, Wrench, Sparkles, CheckCircle2,
  TrendingUp, Users, Maximize2, Layers, Calculator, FileText,
  Award, Info, Share2, Check
} from 'lucide-react';
import {
  BRAND,
  MACHINE_CATALOG_2026,
  CATALOG_CONDITIONS
} from '../data/content';
import MaquinasCarousel from '../components/MaquinasCarousel';
import './MaquinaDetalle.css';

function parseDefaultDailyBlocks(code) {
  const map = {
    '01': 200,
    '02': 320,
    '03': 800,
    '04': 1100,
    '05': 2000,
    '06': 2500,
    '07': 4500,
    '08': 6500,
    '09': 3000,
    '10': 3500,
  };
  return map[code] || 1000;
}

export default function MaquinaDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find current machine by slug, id, or code
  const machineIndex = useMemo(() => {
    const clean = (slug || '').toLowerCase().replace(/^ficha-/, '');
    return MACHINE_CATALOG_2026.findIndex(
      m =>
        m.id.toLowerCase() === clean ||
        m.code.toLowerCase() === clean ||
        `${m.code}-${m.id}`.toLowerCase() === clean
    );
  }, [slug]);

  const machine = MACHINE_CATALOG_2026[machineIndex] || null;

  // Package selection ('base' | 'equipped')
  const [selectedPkg, setSelectedPkg] = useState('base');
  // Active product tab ('specs' | 'includes' | 'shipping')
  const [activeTab, setActiveTab] = useState('specs');
  // Purchase modal state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    nombre: '',
    ciudad: '',
    telefono: '',
    molde: 'Bloque H10 estándar',
    notas: '',
  });

  // Quick ROI Simulator state ("Empieza a generar ingresos hoy")
  const defaultBlocks = machine ? parseDefaultDailyBlocks(machine.code) : 1000;
  const [simDailyBlocks, setSimDailyBlocks] = useState(defaultBlocks);
  const [simProfitPerBlock, setSimProfitPerBlock] = useState(720);
  const [simWorkDays, setSimWorkDays] = useState(24);

  // Sync default blocks when navigating between machines
  const [prevCode, setPrevCode] = useState(machine?.code);
  if (machine && machine.code !== prevCode) {
    setPrevCode(machine.code);
    setSelectedPkg('base');
    setSimDailyBlocks(parseDefaultDailyBlocks(machine.code));
  }

  if (!machine) {
    return (
      <main className="mq-det-page">
        <div className="container" style={{ padding: '7rem 0', textAlign: 'center' }}>
          <span className="mq-det-badge">Catálogo 2026</span>
          <h1 className="heading-xl" style={{ marginTop: '0.75rem' }}>
            Referencia de maquinaria no encontrada
          </h1>
          <p style={{ color: '#64748B', margin: '0.75rem auto 2rem', maxWidth: '500px' }}>
            La máquina que buscas no existe o cambió de enlace. Explora las 10 fichas oficiales en nuestro catálogo.
          </p>
          <Link to="/maquinas" className="btn btn-primary">
            <ArrowLeft size={16} /> Volver al Catálogo de Maquinaria
          </Link>
        </div>
      </main>
    );
  }

  const prevMachine =
    MACHINE_CATALOG_2026[
      (machineIndex - 1 + MACHINE_CATALOG_2026.length) % MACHINE_CATALOG_2026.length
    ];
  const nextMachine =
    MACHINE_CATALOG_2026[(machineIndex + 1) % MACHINE_CATALOG_2026.length];

  const isEquippedSelected = selectedPkg === 'equipped' && !!machine.equippedPrice;
  const activePrice = isEquippedSelected ? machine.equippedPrice : machine.price;
  const activePackageLabel = isEquippedSelected
    ? `Paquete Línea Equipada (${machine.equippedDesc})`
    : 'Configuración Base Individual';

  const buyDirectWhatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `SW- Hola Maqte Colombia, quiero COMPRAR la Ficha ${machine.code}: ${machine.name}.\n` +
      `📦 Configuración: ${activePackageLabel}\n` +
      `💰 Valor referencial: ${activePrice}\n\n` +
      `Por favor indíquenme el proceso de facturación, plazo de entrega y despacho.`
  )}`;

  const quoteWhatsappUrl = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `SW- Hola Maqte Colombia, solicito COTIZACIÓN FORMAL de la Ficha ${machine.code}: ${machine.name}.\n` +
      `📦 Configuración: ${activePackageLabel} (${activePrice}).\n` +
      `Quedo atento a la ficha comercial y alcance incluido.`
  )}`;

  const handleConfirmPurchaseOrder = (e) => {
    e.preventDefault();
    const msg =
      `SW- 🛒 ORDEN DE COMPRA / SEPARACIÓN DE EQUIPO — MAQTECOLOMBIA\n\n` +
      `• Equipo: Ficha ${machine.code} — ${machine.name} (${machine.line})\n` +
      `• Configuración elegida: ${activePackageLabel}\n` +
      `• Precio de referencia: ${activePrice}\n` +
      `• Molde de interés: ${buyerForm.molde}\n` +
      `• Cliente / Empresa: ${buyerForm.nombre}\n` +
      `• Ciudad de destino: ${buyerForm.ciudad}\n` +
      `• Teléfono: ${buyerForm.telefono}\n` +
      (buyerForm.notas ? `• Observaciones: ${buyerForm.notas}\n` : '') +
      `\nSolicito datos bancarios oficiales y contrato de suministro para formalizar el pedido.`;
    window.open(`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    setBuyModalOpen(false);
  };

  const formatCOP = (n) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0);

  const dailyIncome = simDailyBlocks * simProfitPerBlock;
  const monthlyIncome = dailyIncome * simWorkDays;
  const income = machine.incomeHighlight || {};

  return (
    <main className="mq-det-page">
      {/* ─── BREADCRUMB & QUICK SWITCHER ─── */}
      <div className="mq-det-topbar">
        <div className="container mq-det-topbar-inner">
          <nav className="mq-det-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Inicio</Link>
            <ChevronRight size={13} />
            <Link to="/maquinas">Maquinaria Bloquera</Link>
            <ChevronRight size={13} />
            <span>{machine.line}</span>
            <ChevronRight size={13} />
            <strong className="current">
              Ficha {machine.code}: {machine.name}
            </strong>
          </nav>

          <div className="mq-det-prevnext">
            <button
              type="button"
              onClick={() => navigate(`/maquinas/${prevMachine.id}`)}
              title={`Anterior: Ficha ${prevMachine.code} - ${prevMachine.name}`}
            >
              <ArrowLeft size={14} /> Ficha {prevMachine.code}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/maquinas/${nextMachine.id}`)}
              title={`Siguiente: Ficha ${nextMachine.code} - ${nextMachine.name}`}
            >
              Ficha {nextMachine.code} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── PRODUCT PAGE HERO ─── */}
      <section className="mq-det-hero">
        <div className="container mq-det-hero-grid">
          {/* Left Column: Product Gallery Card */}
          <div className="mq-det-gallery">
            <div className="mq-det-img-frame">
              <div className="mq-det-img-badges">
                <span className="mq-det-code-pill">FICHA OFICIAL {machine.code} / 10</span>
                <span className="mq-det-line-pill">{machine.line}</span>
              </div>

              <img
                src={machine.image}
                alt={`Ficha ${machine.code} - ${machine.name}`}
                className="mq-det-main-img"
              />

              <div className="mq-det-img-footer">
                <span>
                  <Award size={14} /> Fotografía de referencia · Fabricación MAQTECOLOMBIA S.A.S.
                </span>
                <button
                  type="button"
                  className="mq-det-share-btn"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: machine.name, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 size={14} /> Compartir
                </button>
              </div>
            </div>

            {/* Quick Highlights under image */}
            <div className="mq-det-quick-stats">
              <div className="mq-det-qstat">
                <TrendingUp size={18} />
                <div>
                  <small>Capacidad orientativa</small>
                  <strong>{income.dailyOutput || 'Según configuración'}</strong>
                </div>
              </div>
              <div className="mq-det-qstat">
                <Users size={18} />
                <div>
                  <small>Personal operativo</small>
                  <strong>{income.operators || 'Según planta'}</strong>
                </div>
              </div>
              <div className="mq-det-qstat">
                <Maximize2 size={18} />
                <div>
                  <small>Área recomendada</small>
                  <strong>{income.area || 'Variable según proyecto'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Purchase & Quote Info */}
          <div className="mq-det-info">
            <div className="mq-det-overline-row">
              <span className="mq-det-badge">Edición Comercial 2026</span>
              <span className="mq-det-stock">
                <CheckCircle2 size={13} /> Disponible para fabricación y despacho nacional
              </span>
            </div>

            <h1 className="mq-det-title">{machine.name}</h1>
            <p className="mq-det-lead">{machine.longDescription || machine.description}</p>

            {/* Configuration Selector (Base vs Línea Equipada) */}
            {machine.equippedPrice ? (
              <div className="mq-det-pkg-selector">
                <span className="mq-det-pkg-label">Elige la configuración de tu equipo:</span>
                <div className="mq-det-pkg-grid">
                  <button
                    type="button"
                    className={`mq-det-pkg-card ${selectedPkg === 'base' ? 'active' : ''}`}
                    onClick={() => setSelectedPkg('base')}
                  >
                    <div className="mq-det-pkg-top">
                      <strong>Máquina Individual (Base)</strong>
                      {selectedPkg === 'base' && <Check size={15} />}
                    </div>
                    <span className="mq-det-pkg-price">{machine.price}</span>
                    <small>Equipo principal según ficha técnica #{machine.code}</small>
                  </button>

                  <button
                    type="button"
                    className={`mq-det-pkg-card pkg-equipped ${selectedPkg === 'equipped' ? 'active' : ''}`}
                    onClick={() => setSelectedPkg('equipped')}
                  >
                    <div className="mq-det-pkg-top">
                      <strong>
                        <Sparkles size={14} /> Paquete Línea Equipada
                      </strong>
                      {selectedPkg === 'equipped' && <Check size={15} />}
                    </div>
                    <span className="mq-det-pkg-price">{machine.equippedPrice}</span>
                    <small>{machine.equippedDesc}</small>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Price Box */}
            <div className="mq-det-price-panel">
              <div>
                <span className="mq-det-price-caption">
                  {isEquippedSelected ? 'PRECIO PAQUETE LÍNEA EQUIPADA' : 'PRECIO BASE REFERENCIAL'}
                </span>
                <div className="mq-det-price-row">
                  <strong className="mq-det-price-main">{activePrice}</strong>
                  {!isEquippedSelected && machine.previousPrice && (
                    <span className="mq-det-price-old">
                      Antes: <del>{machine.previousPrice}</del>
                    </span>
                  )}
                </div>
                <small className="mq-det-price-note">
                  Referencias comerciales en pesos colombianos (COP). Confirmar IVA, molde incluido y flete según ciudad.
                </small>
              </div>
            </div>

            {/* Primary CTA Buttons: Comprar, Cotizar, Llamar */}
            <div className="mq-det-cta-group">
              <button
                type="button"
                className="btn btn-primary mq-det-btn-buy"
                onClick={() => setBuyModalOpen(true)}
              >
                <ShoppingBag size={18} /> Comprar / Separar Equipo
              </button>

              <a
                href={quoteWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline mq-det-btn-quote"
              >
                <MessageCircle size={18} /> Cotizar por WhatsApp
              </a>

              <a href={`tel:${BRAND.phone}`} className="btn btn-outline mq-det-btn-call">
                <Phone size={16} /> Llamar a Ingeniero
              </a>
            </div>

            {/* Compatible Formats Chips */}
            {income.formats && (
              <div className="mq-det-formats-box">
                <span className="mq-det-formats-lbl">
                  <Layers size={14} /> Formatos y aplicaciones compatibles:
                </span>
                <div className="mq-det-formats-chips">
                  {income.formats.map((fmt, i) => (
                    <span key={i} className="mq-det-format-chip">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Grid */}
            <div className="mq-det-trust-grid">
              <div className="mq-det-trust-item">
                <Truck size={18} />
                <div>
                  <strong>Envíos a todo el país</strong>
                  <span>Despacho desde Florencia, Caquetá</span>
                </div>
              </div>
              <div className="mq-det-trust-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>Garantía directa</strong>
                  <span>Respaldo de fábrica MAQTECOLOMBIA</span>
                </div>
              </div>
              <div className="mq-det-trust-item">
                <Wrench size={18} />
                <div>
                  <strong>Moldes y repuestos</strong>
                  <span>Fabricación de moldes a medida</span>
                </div>
              </div>
              <div className="mq-det-trust-item">
                <Calculator size={18} />
                <div>
                  <strong>Bloquera Digital incluida</strong>
                  <span>Simula costos en nuestra plataforma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── "EMPIEZA A GENERAR INGRESOS HOY" — BUSINESS & ROI SECTION ─── */}
      <section className="mq-det-income-section">
        <div className="container">
          <div className="mq-det-income-card">
            <div className="mq-det-income-left">
              <span className="mq-det-income-tag">
                <TrendingUp size={14} /> Empieza a Generar Ingresos Hoy
              </span>
              <h2 className="mq-det-income-title">
                {income.headline || `Rentabiliza tu proyecto con la ${machine.name}`}
              </h2>
              <p className="mq-det-income-lead">
                Perfil ideal de negocio: <strong>{income.idealFor}</strong>. Construye una fuente sólida de ingresos abasteciendo la demanda constante de bloques de concreto y prefabricados en tu municipio.
              </p>

              <ul className="mq-det-roi-list">
                {(income.roiPoints || []).map((pt, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={18} className="mq-det-roi-icon" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <div className="mq-det-income-actions">
                <Link to="/cuenta" className="btn btn-primary">
                  <Calculator size={17} /> Simular Lote Exacto en Bloquera Digital
                </Link>
                <a
                  href={buyDirectWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline mq-det-income-wa"
                >
                  <MessageCircle size={17} /> Hablar con Asesor de Proyectos
                </a>
              </div>
            </div>

            {/* Interactive Quick Revenue Simulator for this Machine */}
            <div className="mq-det-income-sim">
              <div className="mq-det-sim-header">
                <span className="mq-det-sim-badge">Proyección Rápida de Ingresos</span>
                <h3>Calcula el potencial con la Ficha {machine.code}</h3>
                <p>Ajusta los valores según el ritmo de tu planta y el margen de tu región:</p>
              </div>

              <div className="mq-det-sim-sliders">
                <div className="mq-det-sim-field">
                  <div className="mq-det-sim-lbl-row">
                    <label htmlFor="sim-blocks">Bloques fabricados por día</label>
                    <strong>{simDailyBlocks.toLocaleString('es-CO')} blq/día</strong>
                  </div>
                  <input
                    id="sim-blocks"
                    type="range"
                    min="100"
                    max="7500"
                    step="50"
                    value={simDailyBlocks}
                    onChange={e => setSimDailyBlocks(Number(e.target.value))}
                  />
                </div>

                <div className="mq-det-sim-field">
                  <div className="mq-det-sim-lbl-row">
                    <label htmlFor="sim-profit">Utilidad estimada por bloque (COP)</label>
                    <strong>{formatCOP(simProfitPerBlock)} / bloque</strong>
                  </div>
                  <input
                    id="sim-profit"
                    type="range"
                    min="250"
                    max="1500"
                    step="25"
                    value={simProfitPerBlock}
                    onChange={e => setSimProfitPerBlock(Number(e.target.value))}
                  />
                </div>

                <div className="mq-det-sim-field">
                  <div className="mq-det-sim-lbl-row">
                    <label htmlFor="sim-days">Días trabajados al mes</label>
                    <strong>{simWorkDays} días/mes</strong>
                  </div>
                  <input
                    id="sim-days"
                    type="range"
                    min="12"
                    max="28"
                    step="1"
                    value={simWorkDays}
                    onChange={e => setSimWorkDays(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mq-det-sim-results">
                <div className="mq-det-sim-kpi">
                  <small>Utilidad Bruta por Jornada</small>
                  <strong>{formatCOP(dailyIncome)}</strong>
                </div>
                <div className="mq-det-sim-kpi featured">
                  <small>Potencial Mensual ({ (simDailyBlocks * simWorkDays).toLocaleString('es-CO') } bloques)</small>
                  <strong>{formatCOP(monthlyIncome)}</strong>
                </div>
              </div>

              <small className="mq-det-sim-disclaimer">
                * Proyección ilustrativa antes de costos fijos. Usa la calculadora completa en{' '}
                <Link to="/cuenta">Bloquera Digital</Link> para incluir el costo exacto de cemento y agregados de tu región.
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DETAILED TECHNICAL TABS ─── */}
      <section className="mq-det-tabs-section">
        <div className="container">
          <div className="mq-det-tabs-bar">
            <button
              type="button"
              className={`mq-det-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              <FileText size={16} /> Ficha Técnica y Especificaciones
            </button>
            <button
              type="button"
              className={`mq-det-tab-btn ${activeTab === 'includes' ? 'active' : ''}`}
              onClick={() => setActiveTab('includes')}
            >
              <Layers size={16} /> Alcance, Moldes y Ampliaciones
            </button>
            <button
              type="button"
              className={`mq-det-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              <ShieldCheck size={16} /> Condiciones Comerciales y Envío
            </button>
          </div>

          <div className="mq-det-tab-panel">
            {activeTab === 'specs' && (
              <div className="mq-det-specs-layout">
                <div>
                  <h3>Especificaciones Oficiales — Ficha {machine.code}</h3>
                  <p style={{ color: '#475569', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                    {machine.longDescription || machine.description}
                  </p>
                  {machine.note && (
                    <div className="mq-det-scope-callout">
                      <Info size={18} />
                      <span>{machine.note}</span>
                    </div>
                  )}
                </div>

                <div>
                  <table className="mq-det-specs-table">
                    <tbody>
                      <tr>
                        <th>Referencia de Catálogo</th>
                        <td>Ficha #{machine.code} — {machine.name}</td>
                      </tr>
                      <tr>
                        <th>Línea / Categoría</th>
                        <td>{machine.line}</td>
                      </tr>
                      {machine.specs.map((s, idx) => (
                        <tr key={idx}>
                          <th>{s.label}</th>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'includes' && (
              <div className="mq-det-specs-layout">
                <div>
                  <h3>Alcance de Referencia y Configuración</h3>
                  <p style={{ color: '#475569', lineHeight: 1.65, marginBottom: '1rem' }}>
                    Cada máquina se configura de acuerdo con las necesidades de voltaje, tipo de bloque y nivel de automatización del cliente:
                  </p>
                  <ul className="mq-det-check-list">
                    {(machine.includesList || []).map((inc, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={17} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mq-det-complements-box">
                  <h4>Equipos Complementarios Compatibles</h4>
                  <p>Potencia el rendimiento de tu planta integrando mezclado forzado y carga continua:</p>
                  <div className="mq-det-comp-links">
                    <Link to="/maquinas/banda-transportadora-industrial" className="mq-det-comp-item">
                      <img src="/images/maquinas/09-banda-transportadora-industrial.png" alt="Banda transportadora" />
                      <div>
                        <strong>Ficha 09 · Banda transportadora industrial</strong>
                        <span>6 metros · Motor 5 HP · $18.000.000 COP</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                    <Link to="/maquinas/mezcladora-horizontal-dos-bultos" className="mq-det-comp-item">
                      <img src="/images/maquinas/10-mezcladora-horizontal-dos-bultos.png" alt="Mezcladora horizontal" />
                      <div>
                        <strong>Ficha 10 · Mezcladora horizontal de 2 bultos</strong>
                        <span>0,45–0,55 m³ · Motor 10 HP trifásico</span>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="mq-det-specs-layout">
                <div>
                  <h3>Condiciones Comerciales para Cotizar y Comprar</h3>
                  <p style={{ color: '#475569', lineHeight: 1.7 }}>{CATALOG_CONDITIONS}</p>
                </div>
                <div className="mq-det-complements-box">
                  <h4>Atención Directa de Fábrica</h4>
                  <p>
                    <strong>MAQTECOLOMBIA S.A.S.</strong> · Florencia, Caquetá, Colombia
                  </p>
                  <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0.5rem 0 1rem' }}>
                    WhatsApp Comercial: {BRAND.phone} · Despachos a todos los departamentos de Colombia.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setBuyModalOpen(true)}
                  >
                    <ShoppingBag size={16} /> Iniciar Pedido de Ficha {machine.code}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM MACHINERY CAROUSEL ─── */}
      <MaquinasCarousel
        excludeId={machine.id}
        title="Explora otras"
        highlight="Máquinas del Catálogo 2026"
        subtitle="Compara otras capacidades de producción o complementa tu planta con mezcladora y banda transportadora."
      />

      {/* ─── DIRECT PURCHASE / ORDER MODAL ─── */}
      {buyModalOpen && (
        <div className="mq-buy-modal-backdrop" onClick={() => setBuyModalOpen(false)}>
          <div className="mq-buy-modal" onClick={e => e.stopPropagation()}>
            <div className="mq-buy-modal-header">
              <div>
                <span className="mq-det-badge">Solicitud de Compra Directa</span>
                <h3>
                  Ficha {machine.code}: {machine.name}
                </h3>
                <p>
                  {activePackageLabel} · <strong>{activePrice}</strong>
                </p>
              </div>
              <button
                type="button"
                className="mq-buy-modal-close"
                onClick={() => setBuyModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form className="mq-buy-modal-form" onSubmit={handleConfirmPurchaseOrder}>
              <div className="mq-buy-field">
                <label>Nombre completo o Razón Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Constructora Andina S.A.S."
                  value={buyerForm.nombre}
                  onChange={e => setBuyerForm(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>

              <div className="mq-buy-row">
                <div className="mq-buy-field">
                  <label>Ciudad y Departamento de entrega *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Florencia, Caquetá"
                    value={buyerForm.ciudad}
                    onChange={e => setBuyerForm(prev => ({ ...prev, ciudad: e.target.value }))}
                  />
                </div>
                <div className="mq-buy-field">
                  <label>Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 300 000 0000"
                    value={buyerForm.telefono}
                    onChange={e => setBuyerForm(prev => ({ ...prev, telefono: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mq-buy-field">
                <label>Formato de molde principal requerido</label>
                <select
                  value={buyerForm.molde}
                  onChange={e => setBuyerForm(prev => ({ ...prev, molde: e.target.value }))}
                >
                  <option value="Bloque H10 estándar (10x20x40 cm)">Bloque H10 estándar (10×20×40 cm)</option>
                  <option value="Bloque H12 (12x20x40 cm)">Bloque H12 (12×20×40 cm)</option>
                  <option value="Bloque H15 (15x20x40 cm)">Bloque H15 (15×20×40 cm)</option>
                  <option value="Bloque H20 estructural (20x20x40 cm)">Bloque H20 estructural (20×20×40 cm)</option>
                  <option value="Adoquín / Múltiples moldes intercambiables">Adoquín / Múltiples moldes intercambiables</option>
                  <option value="No aplica (Equipo complementario)">No aplica (Equipo complementario)</option>
                </select>
              </div>

              <div className="mq-buy-field">
                <label>Comentarios adicionales (voltaje disponible, moldes extra, etc.)</label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={buyerForm.notas}
                  onChange={e => setBuyerForm(prev => ({ ...prev, notas: e.target.value }))}
                />
              </div>

              <div className="mq-buy-modal-actions">
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <ShoppingBag size={17} /> Confirmar Pedido y Recibir Datos de Pago por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

