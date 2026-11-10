import { useState, useEffect, useMemo } from 'react';
import {
  Calculator, ClipboardList, GraduationCap, HelpCircle,
  SlidersHorizontal, Copy, Check, Printer, MessageCircle,
  RotateCcw, AlertTriangle, PlusCircle, Download, Trash2,
  TrendingUp, Package, DollarSign, Layers, BookOpen, ShieldAlert,
  Info, X
} from 'lucide-react';
import { BRAND } from '../data/content';
import './BloqueraDigitalSection.css';

const STORAGE_KEY = 'maqtecolombia_bloquera_piloto_movimientos_v1';

const BLOCK_GUIDE_META = {
  title: 'GUÍA DE BLOQUES H10, H12, H15 Y H20',
  subtitle: 'Descripciones oficiales para la calculadora Bloquera Digital · MAQTECOLOMBIA',
  whatIsHTitle: '¿Qué significa la letra H?',
  whatIsHText:
    'En esta clasificación comercial, la letra H se utiliza para identificar el bloque según su ancho nominal. Así, H10 corresponde a 10 cm de ancho; H12, a 12 cm; H15, a 15 cm; y H20, a 20 cm. Esta denominación no indica por sí sola la resistencia del bloque ni determina si puede utilizarse en muros estructurales.',
  calcWarning:
    'Los costos son estimaciones. La dosificación, la resistencia y el uso estructural deben verificarse mediante ensayos y las normas técnicas aplicables.',
  technicalNote:
    'Nota técnica: las dimensiones aquí indicadas son las suministradas para el proyecto y deben cotejarse con los moldes y fichas técnicas reales de MAQTECOLOMBIA. Las medidas nominales pueden diferir de las reales según el fabricante y las juntas previstas.',
  h10Footnote:
    '*Medida H10 de referencia: el formato comercial frecuente es 20 cm de alto (también existen variantes de 40 cm de alto según molde específico).',
};

const BLOCK_GEOS = {
  H10: {
    width: 10,
    altoCm: '20 cm (o 40 cm*)',
    largoCm: '40 cm',
    voidRatio: 0.42,
    dim: '10 × 20 × 40 cm',
    dimGuide: '10 cm de ancho × 20 cm de alto × 40 cm de largo',
    tag: 'Divisiones interiores y cerramientos livianos',
    guideDesc:
      'Es un bloque relativamente angosto, utilizado habitualmente para divisiones interiores y cerramientos livianos, siempre que el diseño del proyecto lo permita. Su menor ancho facilita aprovechar el espacio, pero no debe asumirse que es apto para soportar cargas.',
  },
  H12: {
    width: 12,
    altoCm: '20 cm',
    largoCm: '40 cm',
    voidRatio: 0.40,
    dim: '12 × 20 × 40 cm',
    dimGuide: '12 cm de ancho × 20 cm de alto × 40 cm de largo',
    tag: 'Muros divisorios y cerramientos',
    guideDesc:
      'Ofrece un espesor intermedio para muros divisorios y determinados cerramientos. Su uso depende de los requisitos del proyecto, las condiciones de exposición y la resistencia comprobada del producto.',
  },
  H15: {
    width: 15,
    altoCm: '20 cm',
    largoCm: '40 cm',
    voidRatio: 0.38,
    dim: '15 × 20 × 40 cm',
    dimGuide: '15 cm de ancho × 20 cm de alto × 40 cm de largo',
    tag: 'Cerramientos y mampostería especificada',
    guideDesc:
      'Por su mayor espesor, puede emplearse en cerramientos y en sistemas de mampostería especificados por un profesional. La aptitud estructural depende del diseño, la fabricación, los ensayos y la normativa aplicable.',
  },
  H20: {
    width: 20,
    altoCm: '20 cm',
    largoCm: '40 cm',
    voidRatio: 0.35,
    dim: '20 × 20 × 40 cm',
    dimGuide: '20 cm de ancho × 20 cm de alto × 40 cm de largo',
    tag: 'Muros de mayor espesor según diseño',
    guideDesc:
      'Es el de mayor ancho de esta selección. Puede considerarse para muros que requieran mayor espesor, de acuerdo con los planos y especificaciones. Su ancho no equivale automáticamente a mayor resistencia certificada.',
  },
};

const MIX_DOSAGES = {
  'Económica': { vals: [280, 0.55, 0.40, 140, 0, 0], badge: '280 kg cem/m³', desc: 'Cerramientos y tabiquería no estructural' },
  'Estándar estructural': { vals: [320, 0.50, 0.45, 130, 0.8, 0], badge: '320 kg cem/m³', desc: 'Balance ideal resistencia / costo comercial' },
  'Alta resistencia': { vals: [360, 0.48, 0.47, 120, 1.2, 0], badge: '360 kg cem/m³', desc: 'Exigencia estructural y obras públicas' },
  'Premium con aditivo': { vals: [380, 0.46, 0.48, 115, 1.5, 0], badge: '380 kg cem/m³', desc: 'Máxima compresión y fraguado optimizado' },
};

const DEFAULT_PARAMS = {
  cemento: 35000,
  arena: 70000,
  grava: 0,
  agua: 5000,
  aditivo: 8000,
  pigmento: 0,
  energia: 8000,
  mano: 180000,
  mantenimiento: 5000,
  empaque: 50,
  margen: 35,
  impuesto: 0,
  comision: 5,
  desperdicio: 3,
};

const PARAM_GROUPS = [
  {
    title: 'Materias Primas e Insumos',
    fields: [
      { id: 'cemento', label: 'Cemento (bulto 50 kg)', unit: 'COP' },
      { id: 'arena', label: 'Arena (m³)', unit: 'COP' },
      { id: 'grava', label: 'Grava (m³)', unit: 'COP' },
      { id: 'agua', label: 'Agua (m³)', unit: 'COP' },
      { id: 'aditivo', label: 'Aditivo (kg)', unit: 'COP' },
      { id: 'pigmento', label: 'Pigmento (kg)', unit: 'COP' },
    ],
  },
  {
    title: 'Costos Operativos y Logísticos',
    fields: [
      { id: 'energia', label: 'Energía por lote', unit: 'COP' },
      { id: 'mano', label: 'Mano de obra por lote', unit: 'COP' },
      { id: 'mantenimiento', label: 'Mantenimiento por lote', unit: 'COP' },
      { id: 'empaque', label: 'Empaque / transporte por bloque', unit: 'COP' },
    ],
  },
  {
    title: 'Márgenes, Impuestos y Merma',
    fields: [
      { id: 'margen', label: 'Margen objetivo (%)', unit: '%' },
      { id: 'impuesto', label: 'IVA / impuesto (%)', unit: '%' },
      { id: 'comision', label: 'Comisión vendedor (%)', unit: '%' },
      { id: 'desperdicio', label: 'Desperdicio general (%)', unit: '%' },
    ],
  },
];

const TRAINING_MODULES = [
  { num: '01', title: 'Introducción al negocio de bloques', desc: 'Panorama del mercado de prefabricados en Colombia, oportunidades regionales y modelo operativo.' },
  { num: '02', title: 'Tipos de bloques y aplicaciones', desc: 'Geometrías H10, H12, H15, H20, adoquines y usos en mampostería divisoria y estructural.' },
  { num: '03', title: 'Normativa y calidad', desc: 'Estándares NTC aplicables, absorción, resistencia a la compresión y control dimensional.' },
  { num: '04', title: 'Materias primas', desc: 'Selección de agregados, granulometría de arena y grava, cemento y calidad del agua.' },
  { num: '05', title: 'Dosificaciones y mezclas', desc: 'Relación agua-cemento para mezclas semisecas, uso de aditivos plastificantes y tiempos de mezclado.' },
  { num: '06', title: 'Costos de producción', desc: 'Estructura de costos directos por bloque, mano de obra por lote, energía, merma y punto de equilibrio.' },
  { num: '07', title: 'Rentabilidad y proyecciones', desc: 'Fijación de precios comerciales, márgenes mayoristas/minoristas y retorno de inversión en planta.' },
  { num: '08', title: 'Maquinaria para una bloquera', desc: 'Elección entre líneas artesanales, ponedoras, fijas hidráulicas y plantas automáticas PLC.' },
];

function formatCOP(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function safeNum(val) {
  return Math.max(0, Number(val) || 0);
}

export default function BloqueraDigitalSection({
  activeSection,
  onSectionChange,
  allowedSections = { calc: true, gestion: true, curso: true, info: true },
  hideChrome = false,
}) {
  const [internalTab, setInternalTab] = useState('calc');
  const activeTab = activeSection !== undefined ? activeSection : internalTab;
  const setActiveTab = (tab) => {
    if (onSectionChange) onSectionChange(tab);
    else setInternalTab(tab);
  };

  // ── Calculator State ──
  const [blockType, setBlockType] = useState('H10');
  const [mixType, setMixType] = useState('Estándar estructural');
  const [batchQty, setBatchQty] = useState(17000);
  const [manualPrice, setManualPrice] = useState(2100);
  const [useSuggestedPrice, setUseSuggestedPrice] = useState(false);
  const [fixedCosts, setFixedCosts] = useState(3000000);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [guideFocusBlock, setGuideFocusBlock] = useState('H10');

  const openBlockGuide = (code = blockType) => {
    setGuideFocusBlock(code || blockType);
    setGuideModalOpen(true);
  };

  // ── Management (Gestión) State ──
  const [records, setRecords] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [movForm, setMovForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    tipo: 'venta',
    descripcion: '',
    cantidad: 1,
    valor: 0,
  });
  const [movError, setMovError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Storage quota exceeded or private mode
    }
  }, [records]);

  const handleParamChange = (id, value) => {
    setParams(prev => ({
      ...prev,
      [id]: value === '' ? '' : Number(value),
    }));
  };

  const handleResetParams = () => {
    setParams(DEFAULT_PARAMS);
    setBlockType('H10');
    setMixType('Estándar estructural');
    setBatchQty(17000);
    setManualPrice(2100);
    setUseSuggestedPrice(false);
    setFixedCosts(3000000);
  };

  // ── Exact Formula Calculation ──
  const calcResult = useMemo(() => {
    const geo = BLOCK_GEOS[blockType] || BLOCK_GEOS.H10;
    const ancho = geo.width;
    const vacio = geo.voidRatio;
    const m = MIX_DOSAGES[mixType]?.vals || MIX_DOSAGES['Estándar estructural'].vals;
    const cantidad = safeNum(batchQty);

    const volumen = (ancho * 20 * 40 / 1e6) * (1 - vacio) * 1.03;

    const m3 =
      (m[0] / 50) * safeNum(params.cemento) +
      m[1] * safeNum(params.arena) +
      m[2] * safeNum(params.grava) +
      (m[3] / 1000) * safeNum(params.agua) +
      m[4] * safeNum(params.aditivo) +
      m[5] * safeNum(params.pigmento);

    const materiales = m3 * volumen;
    const operacion =
      (safeNum(params.energia) + safeNum(params.mano) + safeNum(params.mantenimiento)) /
      (cantidad || 1);
    const directo = materiales + operacion + safeNum(params.empaque);
    const costo = directo * (1 + safeNum(params.desperdicio) / 100);

    const den = 1 - (safeNum(params.margen) + safeNum(params.comision) + safeNum(params.impuesto)) / 100;
    const precioS = den > 0 ? costo / den : NaN;
    const precio = useSuggestedPrice ? precioS : safeNum(manualPrice);
    const utilidad = precio - costo;
    const eq = utilidad > 0 ? Math.ceil(safeNum(fixedCosts) / utilidad) : null;
    const margenCalculo = precio > 0 && Number.isFinite(utilidad) ? ((100 * utilidad) / precio).toFixed(1) : '0.0';

    const metrics = [
      { key: 'Costo materiales / bloque', val: materiales, type: 'cop' },
      { key: 'Costo total / bloque', val: costo, type: 'cop' },
      { key: 'Precio sugerido', val: precioS, type: 'cop' },
      { key: 'Precio aplicado', val: precio, type: 'cop' },
      { key: 'Utilidad / bloque', val: utilidad, type: 'profit' },
      { key: 'Utilidad del lote', val: utilidad * cantidad, type: 'profit', highlight: true },
      { key: 'Costo del lote', val: costo * cantidad, type: 'cop' },
      { key: 'Venta del lote', val: precio * cantidad, type: 'cop' },
      { key: 'Punto equilibrio (bloques/mes)', val: eq, type: 'units' },
    ];

    const detailText = `Bloque ${blockType} (${ancho} × 20 × 40 cm) · ${mixType} · Volumen neto estimado ${volumen.toFixed(5)} m³/bloque · Margen de cálculo ${margenCalculo}% · Incluye desperdicio general. Costos fijos solo se usan en punto de equilibrio, como en el Excel original.`;

    const copyText =
      `MAQTECOLOMBIA - BLOQUERA DIGITAL\n` +
      `Tipo: ${blockType}\n` +
      `Mezcla: ${mixType}\n` +
      `Cantidad: ${cantidad.toLocaleString('es-CO')}\n` +
      metrics
        .map(item => {
          if (item.val === null) return `${item.key}: Sin utilidad`;
          if (!Number.isFinite(item.val)) return `${item.key}: Revisar parámetros`;
          if (item.type === 'units') return `${item.key}: ${Math.round(item.val).toLocaleString('es-CO')}`;
          return `${item.key}: ${formatCOP(item.val)}`;
        })
        .join('\n');

    return {
      ancho,
      volumen,
      cantidad,
      materiales,
      operacion,
      costo,
      precioS,
      precio,
      utilidad,
      utilidadLote: utilidad * cantidad,
      costoLote: costo * cantidad,
      ventaLote: precio * cantidad,
      eq,
      margenCalculo,
      metrics,
      detailText,
      copyText,
    };
  }, [blockType, mixType, batchQty, manualPrice, useSuggestedPrice, fixedCosts, params]);

  const handleCopyResults = async () => {
    try {
      await navigator.clipboard.writeText(calcResult.copyText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2600);
    } catch {
      window.print();
    }
  };

  // ── Management Summary ──
  const managementSummary = useMemo(() => {
    const ventas = records
      .filter(x => x.tipo === 'venta')
      .reduce((acc, x) => acc + safeNum(x.valor), 0);
    const egresos = records
      .filter(x => x.tipo === 'compra' || x.tipo === 'gasto')
      .reduce((acc, x) => acc + safeNum(x.valor), 0);
    const producidos = records
      .filter(x => x.tipo === 'produccion')
      .reduce((acc, x) => acc + safeNum(x.cantidad), 0);
    return {
      ventas,
      egresos,
      balance: ventas - egresos,
      producidos,
    };
  }, [records]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    const desc = movForm.descripcion.trim();
    if (!desc) {
      setMovError('Por favor ingresa una descripción, cliente o proveedor.');
      return;
    }
    setMovError('');
    const newRecord = {
      id: Date.now(),
      fecha: movForm.fecha || new Date().toISOString().slice(0, 10),
      tipo: movForm.tipo,
      descripcion: desc,
      cantidad: safeNum(movForm.cantidad),
      valor: safeNum(movForm.valor),
    };
    setRecords(prev => [...prev, newRecord]);
    setMovForm(prev => ({ ...prev, descripcion: '', cantidad: 1, valor: 0 }));
  };

  const handleDeleteRecord = (idxFromEnd) => {
    const actualIdx = records.length - 1 - idxFromEnd;
    setRecords(prev => prev.filter((_, idx) => idx !== actualIdx));
  };

  const handleClearRecords = () => {
    if (window.confirm('¿Eliminar todos los registros guardados en este navegador?')) {
      setRecords([]);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      ['Fecha', 'Tipo', 'Descripción', 'Cantidad', 'Valor COP'],
      ...records.map(r => [r.fecha, r.tipo, r.descripcion, r.cantidad, r.valor]),
    ];
    const csv =
      '\ufeff' +
      rows
        .map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(';'))
        .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maqtecolombia_registros.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const whatsappSimulationUrl = useMemo(() => {
    const msg =
      `SW- Hola Maqte Colombia, realicé una simulación en Bloquera Digital:\n\n` +
      `🧱 Bloque: ${blockType} (${ mixType })\n` +
      `📦 Lote simulado: ${calcResult.cantidad.toLocaleString('es-CO')} bloques\n` +
      `💰 Costo total/bloque: ${Number.isFinite(calcResult.costo) ? formatCOP(calcResult.costo) : 'N/A'}\n` +
      `📈 Utilidad estimada del lote: ${Number.isFinite(calcResult.utilidadLote) ? formatCOP(calcResult.utilidadLote) : 'N/A'}\n\n` +
      `Quisiera asesoría sobre la máquina ideal para producir este lote.`;
    return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
  }, [blockType, mixType, calcResult]);

  const isCurrentAllowed = allowedSections[activeTab] !== false;

  return (
    <section id="bloquera-digital" className={hideChrome ? 'bdig-embedded' : 'section-pad bdig-section'}>
      <div className={hideChrome ? 'bdig-embedded-inner' : 'container'}>
        {!hideChrome && (
          <>
            {/* ─── SECTION HEADER ─── */}
            <div className="section-header bdig-header reveal maq-reveal">
              <span className="bdig-eyebrow">
                <Calculator size={14} /> BLOQUERA DIGITAL · CALCULADORA Y GESTIÓN v1.1
              </span>
              <h2 className="heading-xl bdig-main-title">
                ¿Cuánto cuesta fabricar <span className="bdig-gold-text">tus propios bloques?</span>
              </h2>
              <p className="section-subtitle bdig-subtitle">
                Simula costos reales de materiales, mano de obra y rentabilidad por lote en pesos colombianos (COP), gestiona los movimientos de tu planta y consulta nuestra guía técnica.
              </p>
            </div>

            {/* ─── NAVIGATION TABS ─── */}
            <div className="bdig-tabs-nav reveal maq-reveal" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'calc'}
                className={`bdig-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
                onClick={() => setActiveTab('calc')}
              >
                <Calculator size={17} />
                <span>Calculadora de Costos</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'gestion'}
                className={`bdig-tab-btn ${activeTab === 'gestion' ? 'active' : ''}`}
                onClick={() => setActiveTab('gestion')}
              >
                <ClipboardList size={17} />
                <span>Gestión de Bloquera</span>
                {records.length > 0 && (
                  <span className="bdig-tab-badge">{records.length}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'curso'}
                className={`bdig-tab-btn ${activeTab === 'curso' ? 'active' : ''}`}
                onClick={() => setActiveTab('curso')}
              >
                <GraduationCap size={17} />
                <span>Centro de Formación</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'info'}
                className={`bdig-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                <HelpCircle size={17} />
                <span>Guía de Uso</span>
              </button>
            </div>
          </>
        )}

        {!isCurrentAllowed ? null : null}

        {/* ─── TAB 1: CALCULADORA DE COSTOS Y RENTABILIDAD ─── */}
        {activeTab === 'calc' && (
          <div className="bdig-workspace">
            {/* Left Column: Inputs & Parameters */}
            <div className="bdig-inputs-card">
              <div className="bdig-card-top">
                <div>
                  <span className="bdig-step-tag">Parámetros de Producción</span>
                  <h3 className="bdig-card-title">Configuración de Bloque y Mezcla</h3>
                </div>
                <button
                  type="button"
                  className="bdig-reset-btn"
                  onClick={handleResetParams}
                  title="Restablecer valores por defecto"
                >
                  <RotateCcw size={14} /> Restablecer
                </button>
              </div>

              {/* 1. Tipo de Bloque */}
              <div className="bdig-field-group">
                <div className="bdig-group-label-row">
                  <label className="bdig-group-label" style={{ marginBottom: 0 }}>
                    1. Selecciona el Tipo de Bloque
                  </label>
                  <button
                    type="button"
                    className="bdig-guide-open-btn"
                    onClick={() => openBlockGuide(blockType)}
                  >
                    <Info size={14} />
                    <span>Más info · Guía de Bloques H10–H20</span>
                  </button>
                </div>

                <div className="bdig-block-selector">
                  {Object.entries(BLOCK_GEOS).map(([key, info]) => {
                    const active = blockType === key;
                    return (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        className={`bdig-block-pill ${active ? 'active' : ''}`}
                        onClick={() => setBlockType(key)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setBlockType(key);
                          }
                        }}
                      >
                        <div className="bdig-block-pill-top">
                          <div className="bdig-block-title-wrap">
                            <span className="bdig-block-code">{key}</span>
                            <button
                              type="button"
                              className="bdig-block-info-chip"
                              title={`Ver guía técnica del Bloque ${key}`}
                              onClick={e => {
                                e.stopPropagation();
                                setBlockType(key);
                                openBlockGuide(key);
                              }}
                            >
                              <Info size={12} /> Más info
                            </button>
                          </div>
                          {active && <Check size={14} className="bdig-check" />}
                        </div>
                        <span className="bdig-block-dim">{info.dim}</span>
                        <span className="bdig-block-tag">{info.tag}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Ficha orientativa en vivo del bloque elegido (según Guia_Bloques_MAQTECOLOMBIA_NUEVO.docx) */}
                {BLOCK_GEOS[blockType] && (
                  <div className="bdig-selected-block-guide">
                    <div className="bdig-sbg-top">
                      <div>
                        <span className="bdig-sbg-badge">Bloque {blockType}</span>
                        <strong className="bdig-sbg-dims">
                          Dimensiones: {BLOCK_GEOS[blockType].dimGuide}
                        </strong>
                      </div>
                      <button
                        type="button"
                        className="bdig-sbg-link"
                        onClick={() => openBlockGuide(blockType)}
                      >
                        <BookOpen size={13} /> Ver tabla comparativa H10–H20
                      </button>
                    </div>
                    <p className="bdig-sbg-desc">{BLOCK_GEOS[blockType].guideDesc}</p>
                    <small className="bdig-sbg-warn">
                      <AlertTriangle size={13} /> {BLOCK_GUIDE_META.calcWarning}
                    </small>
                  </div>
                )}
              </div>

              {/* 2. Dosificación */}
              <div className="bdig-field-group">
                <label className="bdig-group-label">2. Selecciona la Dosificación de Mezcla</label>
                <div className="bdig-mix-selector">
                  {Object.entries(MIX_DOSAGES).map(([name, info]) => {
                    const active = mixType === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        className={`bdig-mix-card ${active ? 'active' : ''}`}
                        onClick={() => setMixType(name)}
                      >
                        <div className="bdig-mix-top">
                          <strong>{name}</strong>
                          <span className="bdig-mix-badge">{info.badge}</span>
                        </div>
                        <span className="bdig-mix-desc">{info.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Lote, Precio y Costos Fijos */}
              <div className="bdig-field-group">
                <label className="bdig-group-label">3. Volumen del Lote y Precio Comercial</label>
                <div className="bdig-main-inputs-grid">
                  <div className="bdig-input-box">
                    <label htmlFor="bdig-cantidad">Bloques por lote (unidades)</label>
                    <input
                      id="bdig-cantidad"
                      type="number"
                      min="1"
                      value={batchQty}
                      onChange={e => setBatchQty(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                    <div className="bdig-quick-chips">
                      {[1000, 5000, 10000, 17000].map(q => (
                        <button
                          key={q}
                          type="button"
                          className={Number(batchQty) === q ? 'active' : ''}
                          onClick={() => setBatchQty(q)}
                        >
                          {q.toLocaleString('es-CO')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bdig-input-box">
                    <label htmlFor="bdig-sugerido">¿Usar precio de venta sugerido?</label>
                    <div className="bdig-toggle-row">
                      <button
                        type="button"
                        className={`bdig-toggle-opt ${!useSuggestedPrice ? 'active' : ''}`}
                        onClick={() => setUseSuggestedPrice(false)}
                      >
                        No (Precio manual)
                      </button>
                      <button
                        type="button"
                        className={`bdig-toggle-opt ${useSuggestedPrice ? 'active' : ''}`}
                        onClick={() => setUseSuggestedPrice(true)}
                      >
                        Sí (Automático)
                      </button>
                    </div>
                    <span className="bdig-input-hint">
                      Sugerido actual: <strong>{Number.isFinite(calcResult.precioS) ? formatCOP(calcResult.precioS) : 'Revisar %'}</strong>
                    </span>
                  </div>

                  <div className={`bdig-input-box ${useSuggestedPrice ? 'is-disabled' : ''}`}>
                    <label htmlFor="bdig-venta">Precio manual por bloque (COP)</label>
                    <input
                      id="bdig-venta"
                      type="number"
                      min="0"
                      disabled={useSuggestedPrice}
                      value={manualPrice}
                      onChange={e => setManualPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                    <span className="bdig-input-hint">
                      {useSuggestedPrice ? 'Usando el precio sugerido por margen' : 'Valor unitario de venta al público'}
                    </span>
                  </div>

                  <div className="bdig-input-box">
                    <label htmlFor="bdig-fijos">Costos fijos mensuales (COP)</label>
                    <input
                      id="bdig-fijos"
                      type="number"
                      min="0"
                      value={fixedCosts}
                      onChange={e => setFixedCosts(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                    <span className="bdig-input-hint">Arriendo, servicios fijos, administración</span>
                  </div>
                </div>
              </div>

              {/* 4. Personalizar Precios y Parámetros (14 campos) */}
              <div className="bdig-advanced-wrap">
                <button
                  type="button"
                  className={`bdig-advanced-toggle ${showAdvancedParams ? 'open' : ''}`}
                  onClick={() => setShowAdvancedParams(prev => !prev)}
                >
                  <div className="bdig-adv-title">
                    <SlidersHorizontal size={16} />
                    <span>Personalizar precios de insumos, mano de obra y márgenes (14 parámetros)</span>
                  </div>
                  <span className="bdig-adv-action">
                    {showAdvancedParams ? 'Ocultar ajustes' : 'Editar costos locales'}
                  </span>
                </button>

                {showAdvancedParams && (
                  <div className="bdig-advanced-body">
                    {PARAM_GROUPS.map((group, gIdx) => (
                      <div key={gIdx} className="bdig-param-section">
                        <h4 className="bdig-param-sec-title">{group.title}</h4>
                        <div className="bdig-params-grid">
                          {group.fields.map(field => (
                            <div key={field.id} className="bdig-param-field">
                              <label htmlFor={`param-${field.id}`}>{field.label}</label>
                              <div className="bdig-param-input-wrap">
                                <input
                                  id={`param-${field.id}`}
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={params[field.id]}
                                  onChange={e => handleParamChange(field.id, e.target.value)}
                                />
                                <span className="bdig-param-unit">{field.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Financial Results */}
            <div className="bdig-results-col">
              <div className="bdig-results-card">
                <div className="bdig-results-header">
                  <div>
                    <span className="bdig-results-badge">
                      <TrendingUp size={13} /> Resultados en Tiempo Real
                    </span>
                    <h3 className="bdig-results-title">Proyección Económica del Lote</h3>
                  </div>
                  <span className="bdig-block-badge-lg">{blockType}</span>
                </div>

                {/* Primary Profit Banner */}
                <div className={`bdig-hero-profit-box ${calcResult.utilidad >= 0 ? 'is-positive' : 'is-negative'}`}>
                  <div className="bdig-profit-main">
                    <span className="bdig-profit-lbl">Utilidad Estimada del Lote ({calcResult.cantidad.toLocaleString('es-CO')} bloques)</span>
                    <strong className="bdig-profit-val">
                      {Number.isFinite(calcResult.utilidadLote)
                        ? formatCOP(calcResult.utilidadLote)
                        : 'Revisar parámetros'}
                    </strong>
                  </div>
                  <div className="bdig-profit-sub-row">
                    <div>
                      <span>Utilidad / bloque:</span>{' '}
                      <strong>
                        {Number.isFinite(calcResult.utilidad) ? formatCOP(calcResult.utilidad) : 'N/A'}
                      </strong>
                    </div>
                    <div>
                      <span>Margen de cálculo:</span>{' '}
                      <strong>{calcResult.margenCalculo}%</strong>
                    </div>
                  </div>
                </div>

                {/* 9 Metrics Grid */}
                <div className="bdig-metrics-grid">
                  {calcResult.metrics.map((m, idx) => {
                    let formatted = 'Revisar parámetros';
                    if (m.val === null) {
                      formatted = 'Sin utilidad';
                    } else if (Number.isFinite(m.val)) {
                      formatted =
                        m.type === 'units'
                          ? `${Math.round(m.val).toLocaleString('es-CO')} blq`
                          : formatCOP(m.val);
                    }
                    const isProfit = m.type === 'profit';
                    const profitClass = isProfit ? (m.val >= 0 ? 'good' : 'bad') : '';

                    return (
                      <div key={idx} className={`bdig-metric-tile ${m.highlight ? 'featured' : ''}`}>
                        <small className="bdig-metric-label">{m.key}</small>
                        <b className={`bdig-metric-value ${profitClass}`}>{formatted}</b>
                      </div>
                    );
                  })}
                </div>

                {/* Technical Summary Box */}
                <div className="bdig-tech-summary">
                  <p>{calcResult.detailText}</p>
                </div>

                {/* Actions */}
                <div className="bdig-results-actions">
                  <button
                    type="button"
                    className="btn btn-primary bdig-action-btn"
                    onClick={handleCopyResults}
                  >
                    {copiedSuccess ? (
                      <>
                        <Check size={16} /> ¡Resultados copiados!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copiar resultados
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline bdig-action-btn-sec"
                    onClick={() => window.print()}
                  >
                    <Printer size={16} /> Imprimir / Guardar PDF
                  </button>

                  <a
                    href={whatsappSimulationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline bdig-action-whatsapp"
                  >
                    <MessageCircle size={16} /> Consultar máquina para este lote
                  </a>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="bdig-disclaimer-box">
                <AlertTriangle size={18} className="bdig-disc-icon" />
                <p>
                  <strong>Nota técnica e importante:</strong> Esta herramienta estima costos y márgenes, no determina ni certifica la resistencia del bloque. Las dosificaciones son orientativas y requieren validación técnica y ensayos de laboratorio. El margen mostrado sigue las fórmulas del Excel original y no equivale necesariamente a utilidad contable neta.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: GESTIÓN BÁSICA DE TU BLOQUERA ─── */}
        {activeTab === 'gestion' && (
          <div className="bdig-panel-container">
            {/* Summary KPI Row */}
            <div className="bdig-gestion-kpis">
              <div className="bdig-kpi-card kpi-sales">
                <div className="bdig-kpi-icon">
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className="bdig-kpi-label">Ventas registradas</span>
                  <strong className="bdig-kpi-val">{formatCOP(managementSummary.ventas)}</strong>
                </div>
              </div>

              <div className="bdig-kpi-card kpi-expenses">
                <div className="bdig-kpi-icon">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span className="bdig-kpi-label">Compras + gastos</span>
                  <strong className="bdig-kpi-val">{formatCOP(managementSummary.egresos)}</strong>
                </div>
              </div>

              <div className="bdig-kpi-card kpi-production">
                <div className="bdig-kpi-icon">
                  <Package size={20} />
                </div>
                <div>
                  <span className="bdig-kpi-label">Producción registrada</span>
                  <strong className="bdig-kpi-val">
                    {managementSummary.producidos.toLocaleString('es-CO')} bloques
                  </strong>
                </div>
              </div>
            </div>

            <div className="bdig-gestion-grid">
              {/* New Movement Form */}
              <form className="bdig-inputs-card bdig-mov-form" onSubmit={handleAddRecord}>
                <span className="bdig-step-tag">Control Operativo Local</span>
                <h3 className="bdig-card-title">Registrar Nuevo Movimiento</h3>
                <p className="bdig-form-note">
                  Los registros se guardan en este dispositivo y navegador. Descarga periódicamente un respaldo en CSV.
                </p>

                {movError && <div className="bdig-form-error">{movError}</div>}

                <div className="bdig-mov-fields">
                  <div className="bdig-input-box">
                    <label htmlFor="mov-fecha">Fecha</label>
                    <input
                      id="mov-fecha"
                      type="date"
                      value={movForm.fecha}
                      onChange={e => setMovForm(prev => ({ ...prev, fecha: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="bdig-input-box">
                    <label htmlFor="mov-tipo">Tipo de movimiento</label>
                    <select
                      id="mov-tipo"
                      value={movForm.tipo}
                      onChange={e => setMovForm(prev => ({ ...prev, tipo: e.target.value }))}
                    >
                      <option value="venta">Venta</option>
                      <option value="compra">Compra de materiales</option>
                      <option value="gasto">Gasto operativo</option>
                      <option value="produccion">Producción (bloques)</option>
                    </select>
                  </div>

                  <div className="bdig-input-box full-width">
                    <label htmlFor="mov-desc">Descripción / cliente / proveedor</label>
                    <input
                      id="mov-desc"
                      type="text"
                      placeholder="Ej. Venta de 2.000 bloques H10 a ferretería"
                      value={movForm.descripcion}
                      onChange={e => setMovForm(prev => ({ ...prev, descripcion: e.target.value }))}
                    />
                  </div>

                  <div className="bdig-input-box">
                    <label htmlFor="mov-cant">Cantidad (unidades)</label>
                    <input
                      id="mov-cant"
                      type="number"
                      min="0"
                      value={movForm.cantidad}
                      onChange={e => setMovForm(prev => ({ ...prev, cantidad: e.target.value }))}
                    />
                  </div>

                  <div className="bdig-input-box">
                    <label htmlFor="mov-valor">Valor total (COP)</label>
                    <input
                      id="mov-valor"
                      type="number"
                      min="0"
                      value={movForm.valor}
                      onChange={e => setMovForm(prev => ({ ...prev, valor: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary bdig-submit-mov">
                  <PlusCircle size={17} /> Agregar movimiento
                </button>
              </form>

              {/* Movements Table Card */}
              <div className="bdig-inputs-card bdig-mov-table-card">
                <div className="bdig-table-header-row">
                  <div>
                    <span className="bdig-step-tag">Historial en este navegador</span>
                    <h3 className="bdig-card-title">Movimientos Registrados ({records.length})</h3>
                  </div>
                  <div className="bdig-table-actions">
                    <button
                      type="button"
                      className="btn btn-outline bdig-csv-btn"
                      onClick={handleExportCSV}
                      disabled={records.length === 0}
                    >
                      <Download size={15} /> Exportar CSV
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline bdig-clear-btn"
                      onClick={handleClearRecords}
                      disabled={records.length === 0}
                    >
                      <Trash2 size={15} /> Borrar todo
                    </button>
                  </div>
                </div>

                <div className="bdig-table-wrap">
                  <table className="bdig-records-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Detalle</th>
                        <th>Cant.</th>
                        <th style={{ textAlign: 'right' }}>Valor (COP)</th>
                        <th style={{ width: '44px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="bdig-empty-row">
                            Sin registros todavía. Usa el formulario para registrar tu primera operación.
                          </td>
                        </tr>
                      ) : (
                        records
                          .slice()
                          .reverse()
                          .map((r, idx) => (
                            <tr key={r.id || idx}>
                              <td>{r.fecha}</td>
                              <td>
                                <span className={`bdig-mov-badge mov-${r.tipo}`}>
                                  {r.tipo}
                                </span>
                              </td>
                              <td>{r.descripcion}</td>
                              <td>{Number(r.cantidad || 0).toLocaleString('es-CO')}</td>
                              <td style={{ textAlign: 'right', fontWeight: 700 }}>
                                {formatCOP(r.valor)}
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="bdig-row-del"
                                  onClick={() => handleDeleteRecord(idx)}
                                  title="Eliminar fila"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: CENTRO DE FORMACIÓN ─── */}
        {activeTab === 'curso' && (
          <div className="bdig-panel-container">
            <div className="bdig-inputs-card">
              <div className="bdig-curso-header">
                <div>
                  <span className="bdig-step-tag">Capacitación Técnica MAQTECOLOMBIA</span>
                  <h3 className="bdig-card-title">Programa de Formación en Fabricación de Bloques</h3>
                  <p className="bdig-form-note" style={{ marginBottom: 0 }}>
                    Explora los 8 módulos temáticos de formación industrial para operar y rentabilizar tu planta bloquera.
                  </p>
                </div>
                <a
                  href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent('SW- Hola, me gustaría consultar por las opciones de capacitación y formación en fabricación de bloques de concreto de Maqte Colombia.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  <MessageCircle size={16} /> Consultar Capacitación
                </a>
              </div>

              <div className="bdig-modules-grid">
                {TRAINING_MODULES.map(mod => (
                  <div key={mod.num} className="bdig-module-card">
                    <div className="bdig-module-top">
                      <span className="bdig-module-num">Módulo {mod.num}</span>
                      <span className="bdig-module-status">Próximamente</span>
                    </div>
                    <h4 className="bdig-module-title">{mod.title}</h4>
                    <p className="bdig-module-desc">{mod.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bdig-disclaimer-box" style={{ marginTop: '1.5rem' }}>
                <BookOpen size={18} className="bdig-disc-icon" />
                <p>
                  Los módulos interactivos se habilitarán progresivamente en esta sección. Consulta los canales oficiales de <strong>MAQTECOLOMBIA</strong> para conocer el acompañamiento técnico e inducción incluidos al adquirir tu maquinaria.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: GUÍA DE USO ─── */}
        {activeTab === 'info' && (
          <div className="bdig-panel-container">
            <div className="bdig-inputs-card">
              <span className="bdig-step-tag">Manual Rápido</span>
              <h3 className="bdig-card-title">Guía de Uso de Bloquera Digital</h3>

              <div className="bdig-guide-grid">
                <div className="bdig-guide-step">
                  <div className="bdig-guide-num">01</div>
                  <h4>Selecciona el formato de bloque</h4>
                  <p>
                    Elige entre <strong>H10, H12, H15 o H20</strong>. El sistema ajusta automáticamente el ancho y el porcentaje de vacío geométrico del bloque.
                  </p>
                </div>

                <div className="bdig-guide-step">
                  <div className="bdig-guide-num">02</div>
                  <h4>Configura la mezcla e insumos</h4>
                  <p>
                    Elige una dosificación orientativa y abre el panel de <strong>14 parámetros</strong> para introducir los precios reales de cemento, arena, energía y mano de obra en tu región.
                  </p>
                </div>

                <div className="bdig-guide-step">
                  <div className="bdig-guide-num">03</div>
                  <h4>Analiza costos y punto de equilibrio</h4>
                  <p>
                    Ingresa el tamaño del lote a fabricar y compara tu precio de venta manual frente al precio sugerido según tu margen objetivo.
                  </p>
                </div>

                <div className="bdig-guide-step">
                  <div className="bdig-guide-num">04</div>
                  <h4>Registra operaciones y exporta CSV</h4>
                  <p>
                    En la pestaña <strong>Gestión de Bloquera</strong> lleva el control diario de ventas, compras, gastos y producción, y descarga copias de seguridad en formato CSV.
                  </p>
                </div>
              </div>

              <div className="bdig-disclaimer-box" style={{ marginTop: '1.5rem' }}>
                <ShieldAlert size={18} className="bdig-disc-icon" />
                <p>
                  <strong>Importante:</strong> Los resultados son estimaciones económicas y deben contrastarse con los costos reales y ensayos de laboratorio de tu operación. Los registros de gestión se almacenan localmente en este navegador; utiliza siempre <strong>Exportar CSV</strong> para conservar tu respaldo.
                </p>
              </div>

              {/* Guía Oficial de Bloques H10, H12, H15 y H20 integrada en Guía de Uso */}
              <div className="bdig-guide-blocks-panel" style={{ marginTop: '2rem' }}>
                <span className="bdig-step-tag">Referencia Técnica MAQTECOLOMBIA</span>
                <h3 className="bdig-card-title">{BLOCK_GUIDE_META.title}</h3>
                <p className="bdig-form-note" style={{ marginBottom: '1rem' }}>
                  <strong>{BLOCK_GUIDE_META.whatIsHTitle}</strong> {BLOCK_GUIDE_META.whatIsHText}
                </p>

                <div className="bdig-table-wrap" style={{ marginBottom: '1.25rem' }}>
                  <table className="bdig-records-table">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Ancho</th>
                        <th>Alto</th>
                        <th>Largo</th>
                        <th>Uso Orientativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(BLOCK_GEOS).map(([code, b]) => (
                        <tr key={code}>
                          <td>
                            <strong>Bloque {code}</strong>
                          </td>
                          <td>{b.width} cm</td>
                          <td>{b.altoCm}</td>
                          <td>{b.largoCm}</td>
                          <td>{b.guideDesc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <small style={{ display: 'block', color: '#64748B', fontSize: '0.8rem', lineHeight: 1.55 }}>
                  {BLOCK_GUIDE_META.h10Footnote}
                  <br />
                  {BLOCK_GUIDE_META.technicalNote}
                </small>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL INTERACTIVO: GUÍA DE BLOQUES H10, H12, H15 Y H20 ─── */}
        {guideModalOpen && (
          <div
            className="bdig-guide-modal-backdrop"
            onClick={() => setGuideModalOpen(false)}
          >
            <div
              className="bdig-guide-modal"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Guía de Bloques H10, H12, H15 y H20"
            >
              <div className="bdig-guide-modal-header">
                <div>
                  <span className="bdig-step-tag">MAQTECOLOMBIA · Guía Técnica Oficial</span>
                  <h3>{BLOCK_GUIDE_META.title}</h3>
                  <p>{BLOCK_GUIDE_META.subtitle}</p>
                </div>
                <button
                  type="button"
                  className="bdig-guide-modal-close"
                  onClick={() => setGuideModalOpen(false)}
                  aria-label="Cerrar guía"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bdig-guide-modal-body">
                {/* ¿Qué significa la letra H? */}
                <div className="bdig-guide-whatish">
                  <h4>
                    <Info size={16} /> {BLOCK_GUIDE_META.whatIsHTitle}
                  </h4>
                  <p>{BLOCK_GUIDE_META.whatIsHText}</p>
                </div>

                {/* Tabla de Dimensiones de Referencia */}
                <div className="bdig-guide-table-section">
                  <h4>Dimensiones de referencia</h4>
                  <div className="bdig-table-wrap">
                    <table className="bdig-records-table bdig-dims-table">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Ancho</th>
                          <th>Alto</th>
                          <th>Largo</th>
                          <th style={{ textAlign: 'right' }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(BLOCK_GEOS).map(([code, b]) => {
                          const isFocused = guideFocusBlock === code;
                          return (
                            <tr
                              key={code}
                              className={isFocused ? 'bdig-dims-row-active' : ''}
                              onClick={() => setGuideFocusBlock(code)}
                            >
                              <td>
                                <strong>{code}</strong>
                              </td>
                              <td>{b.width} cm</td>
                              <td>{b.altoCm}</td>
                              <td>{b.largoCm}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="bdig-dims-select-btn"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setBlockType(code);
                                    setGuideFocusBlock(code);
                                  }}
                                >
                                  {blockType === code ? '✓ En uso' : `Usar ${code}`}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <small className="bdig-guide-footnote">{BLOCK_GUIDE_META.h10Footnote}</small>
                </div>

                {/* Tarjetas descriptivas de Bloque H10, H12, H15 y H20 */}
                <div className="bdig-guide-cards-grid">
                  {Object.entries(BLOCK_GEOS).map(([code, b]) => {
                    const isFocused = guideFocusBlock === code;
                    const isSelected = blockType === code;
                    return (
                      <div
                        key={code}
                        className={`bdig-guide-block-card ${isFocused ? 'focused' : ''}`}
                        onClick={() => setGuideFocusBlock(code)}
                      >
                        <div className="bdig-gbc-top">
                          <div>
                            <span className="bdig-gbc-badge">Bloque {code}</span>
                            <h5>{b.tag}</h5>
                          </div>
                          <button
                            type="button"
                            className={`bdig-gbc-use-btn ${isSelected ? 'active' : ''}`}
                            onClick={e => {
                              e.stopPropagation();
                              setBlockType(code);
                              setGuideModalOpen(false);
                            }}
                          >
                            {isSelected ? 'Seleccionado' : `Calcular con ${code}`}
                          </button>
                        </div>
                        <span className="bdig-gbc-dims">
                          Dimensiones: {b.dimGuide}
                        </span>
                        <p className="bdig-gbc-desc">{b.guideDesc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Avisos técnicos oficiales */}
                <div className="bdig-guide-modal-notices">
                  <div className="bdig-disclaimer-box">
                    <AlertTriangle size={18} className="bdig-disc-icon" />
                    <p>
                      <strong>Aviso de la calculadora:</strong> {BLOCK_GUIDE_META.calcWarning}
                    </p>
                  </div>
                  <p className="bdig-guide-tech-note">{BLOCK_GUIDE_META.technicalNote}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

