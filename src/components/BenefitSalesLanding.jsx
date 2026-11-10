import { useState } from 'react';
import {
  Calculator, ClipboardList, GraduationCap, CheckCircle2,
  Sparkles, ShieldCheck, ArrowRight, MessageCircle, Lock,
  TrendingUp, Layers, FileSpreadsheet, Award, PlayCircle,
  BarChart3, BookOpen, Wrench, Zap, ChevronDown, Clock,
  DollarSign, Package, Check, AlertTriangle, Cpu, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/content';
import './BenefitSalesLanding.css';

const LIVE_CALC_PREVIEW = {
  H10: {
    dim: '10 × 20 × 40 cm',
    tag: 'Mampostería divisoria',
    costo: '$1.373 COP',
    venta: '$2.100 COP',
    utilidadBloque: '$727 COP',
    utilidadLote: '$12.361.637 COP',
    margen: '34.6%',
    equilibrio: '4.126 bloques/mes',
    bars: [
      { label: 'Cemento (50 kg)', pct: 61, color: '#F7BC21' },
      { label: 'Arena y Agregados', pct: 22, color: '#38BDF8' },
      { label: 'Mano de Obra Lote', pct: 12, color: '#10B981' },
      { label: 'Energía y Merma', pct: 5, color: '#A855F7' },
    ],
  },
  H12: {
    dim: '12 × 20 × 40 cm',
    tag: 'Cerramientos y muros',
    costo: '$1.584 COP',
    venta: '$2.450 COP',
    utilidadBloque: '$866 COP',
    utilidadLote: '$14.722.000 COP',
    margen: '35.3%',
    equilibrio: '3.464 bloques/mes',
    bars: [
      { label: 'Cemento (50 kg)', pct: 63, color: '#F7BC21' },
      { label: 'Arena y Agregados', pct: 23, color: '#38BDF8' },
      { label: 'Mano de Obra Lote', pct: 10, color: '#10B981' },
      { label: 'Energía y Merma', pct: 4, color: '#A855F7' },
    ],
  },
  H15: {
    dim: '15 × 20 × 40 cm',
    tag: 'Mampostería estructural',
    costo: '$1.890 COP',
    venta: '$2.950 COP',
    utilidadBloque: '$1.060 COP',
    utilidadLote: '$18.020.000 COP',
    margen: '35.9%',
    equilibrio: '2.830 bloques/mes',
    bars: [
      { label: 'Cemento (50 kg)', pct: 65, color: '#F7BC21' },
      { label: 'Arena y Agregados', pct: 22, color: '#38BDF8' },
      { label: 'Mano de Obra Lote', pct: 9, color: '#10B981' },
      { label: 'Energía y Merma', pct: 4, color: '#A855F7' },
    ],
  },
  H20: {
    dim: '20 × 20 × 40 cm',
    tag: 'Alta exigencia estructural',
    costo: '$2.365 COP',
    venta: '$3.700 COP',
    utilidadBloque: '$1.335 COP',
    utilidadLote: '$22.695.000 COP',
    margen: '36.1%',
    equilibrio: '2.247 bloques/mes',
    bars: [
      { label: 'Cemento (50 kg)', pct: 67, color: '#F7BC21' },
      { label: 'Arena y Agregados', pct: 21, color: '#38BDF8' },
      { label: 'Mano de Obra Lote', pct: 8, color: '#10B981' },
      { label: 'Energía y Merma', pct: 4, color: '#A855F7' },
    ],
  },
};

const ACADEMY_MODULES_PREVIEW = [
  {
    num: '01',
    title: 'Modelo de Negocio de una Planta Bloquera',
    duration: '45 min · Guía + Checklist',
    summary: 'Estructura de una bloquera rentable en Colombia: distribución de patio de secado, flujo de materiales, zonas de curado y comercialización con ferreterías y constructoras.',
    deliverable: 'Plano guía de distribución de planta (Layout 2D)',
  },
  {
    num: '02',
    title: 'Formatos H10, H12, H15, H20 y Adoquines',
    duration: '50 min · Ficha Dimensional',
    summary: 'Qué significa la clasificación H por ancho nominal, geometría de cámaras vacías, espesores de pared y selección del bloque correcto según el proyecto.',
    deliverable: 'Manual oficial de Bloques H10–H20 MAQTECOLOMBIA',
  },
  {
    num: '03',
    title: 'Normativa Técnica NTC y Control de Calidad',
    duration: '60 min · Protocolo de Laboratorio',
    summary: 'Criterios de resistencia a la compresión, porcentaje máximo de absorción de agua, tolerancias dimensionales y cómo preparar muestras para ensayo.',
    deliverable: 'Formato de control de calidad por lote producido',
  },
  {
    num: '04',
    title: 'Selección de Áridos, Cemento y Granulometría',
    duration: '55 min · Pruebas de Campo',
    summary: 'Cómo evaluar la arena de río o triturada, módulo de finura, contenido de limos/arcillas y calidad del agua para lograr máxima compacidad.',
    deliverable: 'Guía rápida de inspección de agregados en planta',
  },
  {
    num: '05',
    title: 'Dosificación de Mezclas Semisecas y Aditivos',
    duration: '65 min · Tablas de Mezcla',
    summary: 'Fórmulas orientativas (Económica, Estándar, Alta Resistencia y Premium), prueba del puño para humedad óptima y tiempos exactos en mezcladora horizontal.',
    deliverable: 'Tabla maestra de dosificaciones por m³ y por bulto',
  },
  {
    num: '06',
    title: 'Costos Industriales, Merma y Punto de Equilibrio',
    duration: '50 min · Taller Financiero',
    summary: 'Cómo costear energía, desgaste de moldes, mano de obra por lote, transporte y costos fijos para proteger tu margen real.',
    deliverable: 'Plantilla conectada a Calculadora Bloquera Digital',
  },
  {
    num: '07',
    title: 'Estrategia Comercial y Ventas por Volumen',
    duration: '45 min · Escalas de Precio',
    summary: 'Cómo estructurar listas de precios para venta en planta, distribuidores ferreteros y licitaciones de obra civil sin sacrificar flujo de caja.',
    deliverable: 'Modelo de cotización formal para constructoras',
  },
  {
    num: '08',
    title: 'Operación y Mantenimiento de Maquinaria Bloquera',
    duration: '70 min · Manual Operativo',
    summary: 'Sincronización de vibración y prensado, limpieza diaria de moldes, lubricación de columnas/sistema hidráulico y operación de tableros PLC Kinco.',
    deliverable: 'Bitácora de mantenimiento preventivo diario y semanal',
  },
];

export const BENEFITS_LANDING_DATA = {
  calc: {
    id: 'calc',
    number: '01',
    shortLabel: 'Calculadora de Costos',
    badge: 'Beneficio 01 · Inteligencia Financiera para Bloqueras',
    title: 'Calculadora Profesional de Costos y Rentabilidad',
    highlight: 'Conoce tu utilidad exacta al centavo antes de producir un solo bloque',
    subtitle:
      'El simulador financiero oficial de MAQTECOLOMBIA que cruza la geometría real de tus bloques (H10, H12, H15, H20), 4 fórmulas de mezcla y 14 costos locales de tu municipio para blindar tu margen comercial.',
    priceTag: 'Bonificado 100% al comprar tu Máquina MAQTE · Disponible en Membresía Pro',
    icon: Calculator,
    accent: '#F7BC21',
    accentSoft: 'rgba(247, 188, 33, 0.14)',
    heroStats: [
      { val: '14', lbl: 'Variables de costo local ajustables' },
      { val: '4', lbl: 'Geometrías H10, H12, H15 y H20' },
      { val: '< 30s', lbl: 'Para cotizar cualquier lote' },
    ],
    bentoFeatures: [
      {
        badge: 'PRECISIÓN VOLUMÉTRICA',
        title: 'Cálculo Geométrico Real con Porcentaje de Vacío y Merma',
        desc: 'No usa promedios genéricos: calcula el volumen neto de concreto descontando las celdas vacías de cada bloque (H10 a H20) e incorpora el factor de compactación y desperdicio operativo.',
        metric: '0.00478 m³',
        metricSub: 'Volumen neto exacto H10 estándar',
        span: 'wide',
      },
      {
        badge: '4 FÓRMULAS DE MEZCLA',
        title: 'Desde Mezcla Económica hasta Alta Resistencia con Aditivo',
        desc: 'Compara en vivo cómo cambia el costo por bloque al pasar de 280 kg a 380 kg de cemento/m³.',
        metric: '280–380 kg',
        metricSub: 'Rango de cemento por m³',
        span: 'normal',
      },
      {
        badge: '14 PARÁMETROS REGIONALES',
        title: 'Adaptada a los Precios Reales de tu Ciudad o Municipio',
        desc: 'Personaliza bulto de cemento de 50 kg, m³ de arena, grava, agua, aditivo, pigmento, energía, mano de obra por lote, empaque, comisión, IVA y margen.',
        metric: '100% Editable',
        metricSub: 'En pesos colombianos (COP)',
        span: 'normal',
      },
      {
        badge: 'PUNTO DE EQUILIBRIO Y EXPORTACIÓN',
        title: 'Descubre Cuántos Bloques Debes Vender al Mes para Cubrir tus Costos Fijos',
        desc: 'Cruza tus costos fijos mensuales (arriendo, nómina base, administración) contra la utilidad neta de cada bloque y genera reportes listos para imprimir o guardar en PDF.',
        metric: 'PDF + Copiado',
        metricSub: 'Listo para socios, bancos o clientes',
        span: 'wide',
      },
    ],
    workflowSteps: [
      {
        num: '01',
        title: 'Elige tu Bloque y Dosificación',
        desc: 'Selecciona H10, H12, H15 o H20, consulta su ficha técnica integrada y define el tipo de mezcla según el destino del bloque.',
      },
      {
        num: '02',
        title: 'Ingresa los Costos de tu Región',
        desc: 'Ajusta el precio del bulto de cemento y agregados en tu zona, el tamaño del lote a fabricar y tus costos fijos mensuales.',
      },
      {
        num: '03',
        title: 'Obtén Precio Sugerido y Utilidad del Lote',
        desc: 'Recibe al instante las 9 métricas financieras del lote, tu punto de equilibrio mensual y exporta la proyección en PDF.',
      },
    ],
    comparison: {
      withoutTitle: 'Cotizar a Ojo o con Cuentas de Servillleta',
      withoutItems: [
        'Vendes bloques por debajo del costo real cuando sube el bulto de cemento.',
        'Olvidas incluir el costo de energía, mantenimiento de moldes, merma y comisiones.',
        'No sabes cuántos bloques debes producir al mes para pagar los gastos fijos de la planta.',
        'Pierdes negocios grandes con constructoras por tardar días en armar una cotización.',
      ],
      withTitle: 'Con la Calculadora Bloquera Digital MAQTE',
      withItems: [
        'Sabes exactamente cuánto te cuesta cada bloque H10, H12, H15 o H20 antes de encender la máquina.',
        'Simulas escenarios con precio manual vs. precio sugerido automático según tu margen objetivo.',
        'Conoces tu punto de equilibrio exacto en unidades mensuales.',
        'Generas y compartes proyecciones profesionales en menos de 30 segundos.',
      ],
    },
    faqs: [
      {
        q: '¿Los precios de cemento y arena vienen fijos o los puedo cambiar?',
        a: 'Todos los 14 parámetros son 100% editables en pesos colombianos (COP) para que reflejen exactamente lo que pagas en tu municipio.',
      },
      {
        q: '¿Incluye la Guía Oficial de Bloques H10, H12, H15 y H20?',
        a: 'Sí. Dentro de cada tipo de bloque cuentas con el botón «Más info» que despliega la guía técnica dimensional y de uso orientativo de MAQTECOLOMBIA.',
      },
    ],
    whatsappText:
      'SW- Hola Maqte Colombia, quiero adquirir o activar el acceso al Beneficio 01: Calculadora Profesional de Costos y Rentabilidad en Bloquera Digital.',
  },

  gestion: {
    id: 'gestion',
    number: '02',
    shortLabel: 'Gestión de Bloquera',
    badge: 'Beneficio 02 · Control Operativo y Financiero de Planta',
    title: 'Software de Gestión Diaria para tu Bloquera',
    highlight: 'Digitaliza tus ventas, compras de insumos, gastos y lotes producidos',
    subtitle:
      'Reemplaza las libretas manchadas de cemento por un centro de control gerencial. Registra cada movimiento diario de tu planta bloquera, monitorea el flujo de caja en vivo y descarga respaldos contables en CSV/Excel.',
    priceTag: 'Exclusivo para Clientes de Maquinaria y Miembros Bloquera Pro',
    icon: ClipboardList,
    accent: '#10B981',
    accentSoft: 'rgba(16, 185, 129, 0.14)',
    heroStats: [
      { val: '4 en 1', lbl: 'Ventas, Compras, Gastos y Producción' },
      { val: '1 Clic', lbl: 'Exportación contable a Excel / CSV' },
      { val: 'En Vivo', lbl: 'Balance de ingresos vs. egresos' },
    ],
    bentoFeatures: [
      {
        badge: 'FLUJO DE CAJA EN TIEMPO REAL',
        title: '3 Indicadores Gerenciales Siempre Visibles en la Cabecera',
        desc: 'Apenas abres el módulo visualizas tus Ventas Registradas (COP), Compras de Materiales + Gastos Operativos (COP) y el total de Bloques Producidos en planta.',
        metric: 'Balance Automático',
        metricSub: 'Control diario sin fórmulas complicadas',
        span: 'wide',
      },
      {
        badge: 'BITÁCORA DE PRODUCCIÓN',
        title: 'Controla Cuántos Bloques Salen de la Máquina Cada Jornada',
        desc: 'Registra los lotes diarios por referencia (H10, H12, H15, H20 o adoquín) para auditar el rendimiento real de tus operarios.',
        metric: 'Unidades / Turno',
        metricSub: 'Trazabilidad de patio de secado',
        span: 'normal',
      },
      {
        badge: 'COMPRAS Y PROVEEDORES',
        title: 'Historial de Bultos de Cemento, Viajes de Arena y Repuestos',
        desc: 'Documenta cada compra de materia prima y gasto de planta con fecha, proveedor, cantidad y valor total en COP.',
        metric: 'Cero Fugas',
        metricSub: 'Control de costos operativos',
        span: 'normal',
      },
      {
        badge: 'RESPALDO CONTABLE CSV / EXCEL',
        title: 'Descarga tu Contabilidad Operativa Lista para Excel o tu Contador',
        desc: 'Exporta en cualquier momento la tabla completa de movimientos en un archivo CSV estándar compatible con Microsoft Excel y Google Sheets.',
        metric: '.CSV Estándar',
        metricSub: 'Respaldo instantáneo en 1 clic',
        span: 'wide',
      },
    ],
    workflowSteps: [
      {
        num: '01',
        title: 'Selecciona el Tipo de Movimiento',
        desc: 'Elige entre Venta a cliente/ferretería, Compra de materiales, Gasto operativo o Producción de bloques.',
      },
      {
        num: '02',
        title: 'Registra Detalle, Cantidad y Valor en COP',
        desc: 'Escribe el cliente, proveedor o lote, las unidades correspondientes y el monto total de la operación.',
      },
      {
        num: '03',
        title: 'Audita tu Resumen y Descarga tu CSV',
        desc: 'Observa cómo se actualizan tus KPIs al instante y exporta periódicamente tu respaldo contable a Excel.',
      },
    ],
    comparison: {
      withoutTitle: 'Administrar la Bloquera en Cuadernos o Memoria',
      withoutItems: [
        'No sabes con certeza cuánto dinero libre dejó la planta al terminar el mes.',
        'Se pierden vales de anticipos, viajes de arena o despachos parciales a ferreterías.',
        'Imposible comparar cuántos bultos de cemento entraron vs. cuántos bloques se fabricaron.',
        'Horas perdidas pasando apuntes en papel a una hoja de cálculo a fin de mes.',
      ],
      withTitle: 'Con el Sistema de Gestión Bloquera Digital',
      withItems: [
        'Cada venta, compra de cemento, gasto y lote producido queda fechado y totalizado.',
        'Semáforo visual de Ventas vs. Compras + Gastos y Producción acumulada.',
        'Consulta rápida desde el computador de la oficina o el celular en planta.',
        'Archivo CSV descargable en un segundo para control contable y societario.',
      ],
    },
    faqs: [
      {
        q: '¿Puedo abrir el archivo descargado en Microsoft Excel?',
        a: 'Sí. El botón «Exportar CSV» genera un archivo estructurado con columnas de Fecha, Tipo, Descripción, Cantidad y Valor COP que abre directamente en Excel o Google Sheets.',
      },
      {
        q: '¿Cómo obtengo el permiso de miembro para desbloquear Gestión de Bloquera?',
        a: 'Viene incluido sin costo al adquirir tu máquina con MAQTECOLOMBIA o puedes solicitar la activación de tu Membresía Bloquera Pro por WhatsApp.',
      },
    ],
    whatsappText:
      'SW- Hola Maqte Colombia, quiero adquirir o activar mi permiso de miembro para el Beneficio 02: Software de Gestión de Bloquera.',
  },

  curso: {
    id: 'curso',
    number: '03',
    shortLabel: 'Centro de Formación',
    badge: 'Beneficio 03 · Academia Técnica de Prefabricados MAQTE',
    title: 'Centro de Formación Industrial en Fabricación de Bloques',
    highlight: 'Aprende el método probado para fabricar bloques resistentes y sin roturas',
    subtitle:
      'Accede a los 8 módulos técnicos creados por los especialistas en maquinaria de MAQTECOLOMBIA. Domina desde la selección de agregados y humedad de mezcla semiseca hasta normativa NTC y puesta a punto de planta.',
    priceTag: 'Capacitación Oficial para Clientes MAQTE y Miembros Pro',
    icon: GraduationCap,
    accent: '#38BDF8',
    accentSoft: 'rgba(56, 189, 248, 0.14)',
    heroStats: [
      { val: '8 Módulos', lbl: 'De formación técnica paso a paso' },
      { val: '-70%', lbl: 'Reducción de merma y rotura en planta' },
      { val: 'NTC', lbl: 'Enfoque en calidad y resistencia' },
    ],
    bentoFeatures: [
      {
        badge: 'SECRETO INDUSTRIAL DE LA MEZCLA SEMISECA',
        title: 'Domina la Relación Agua-Cemento y Granulometría para Desmoldeo Inmediato',
        desc: 'El 80% de los fallos en una bloquera nueva ocurren por exceso o falta de humedad y arenas mal gradadas. Aprende las pruebas prácticas de planta para que cada bloque salga compacto y sin fisuras.',
        metric: 'Cero Fisuras',
        metricSub: 'Fórmulas validadas en campo',
        span: 'wide',
      },
      {
        badge: 'CALIDAD NORMATIVA NTC',
        title: 'Cumple las Exigencias de Constructoras e Ingenieros',
        desc: 'Aprende cómo controlar el peso, la absorción y la resistencia a la compresión para vender tus bloques a proyectos institucionales y constructoras.',
        metric: 'Calidad Certificable',
        metricSub: 'Protocolos de curado y fraguado',
        span: 'normal',
      },
      {
        badge: 'ENTRENAMIENTO DE OPERARIOS',
        title: 'Capacita Rápidamente a tu Personal de Planta',
        desc: 'Estandariza los tiempos de llenado, vibrado, prensado y curado para que la producción no dependa de la improvisación.',
        metric: 'Planta Estandarizada',
        metricSub: 'Mayor velocidad por ciclo',
        span: 'normal',
      },
      {
        badge: '8 MÓDULOS + ACOMPAÑAMIENTO DE FÁBRICA',
        title: 'Respaldo Directo del Fabricante de Maquinaria Líder en Colombia',
        desc: 'Condensamos años de experiencia fabricando bloqueras manuales, ponedoras, hidráulicas y plantas automáticas PLC en Florencia, Caquetá para todo el país.',
        metric: '8 Módulos Oficiales',
        metricSub: 'Desde cero hasta planta industrial',
        span: 'wide',
      },
    ],
    workflowSteps: [
      {
        num: '01',
        title: 'Fundamentos, Bloques H10–H20 y Normativa (Módulos 01–03)',
        desc: 'Aprende a estructurar el patio de producción, elegir los moldes de mayor demanda y aplicar controles dimensionales y de resistencia.',
      },
      {
        num: '02',
        title: 'Materias Primas y Dosificación Semiseca (Módulos 04–05)',
        desc: 'Domina la selección de arena y grava, tiempos de mezclado forzado y uso correcto de aditivos plastificantes.',
      },
      {
        num: '03',
        title: 'Costos, Ventas y Operación de Maquinaria (Módulos 06–08)',
        desc: 'Maximiza la vida útil de tu máquina, reduce el consumo de cemento por bloque y escala la rentabilidad de tu bloquera.',
      },
    ],
    comparison: {
      withoutTitle: 'Arrancar tu Bloquera por Ensayo y Error',
      withoutItems: [
        'Cientos de bloques desmoronados al desmoldar por no conocer el punto exacto de humedad.',
        'Gasto excesivo de cemento intentando compensar una arena mal seleccionada.',
        'Rechazo de lotes en obras y constructoras por variaciones de altura o baja resistencia.',
        'Desgaste prematuro de moldes y motovibradores por falta de protocolo operativo.',
      ],
      withTitle: 'Con el Centro de Formación MAQTECOLOMBIA',
      withItems: [
        'Curva de aprendizaje acelerada desde el primer día de encendido de tu máquina.',
        'Dosificaciones balanceadas que optimizan cada bulto de cemento de 50 kg.',
        'Bloques con aristas definidas, textura uniforme y alta resistencia comercial.',
        'Equipo humano alineado con buenas prácticas de operación y mantenimiento.',
      ],
    },
    faqs: [
      {
        q: '¿Para quién está diseñado el Centro de Formación?',
        a: 'Tanto para emprendedores que están iniciando su primera bloquera desde cero como para dueños de plantas y maestros de obra que buscan tecnificar sus mezclas y reducir costos.',
      },
      {
        q: '¿Está incluido al comprar una máquina en MAQTECOLOMBIA?',
        a: 'Sí. Todos nuestros clientes de maquinaria reciben acompañamiento técnico y acceso preferencial a los contenidos de formación de Bloquera Digital.',
      },
    ],
    whatsappText:
      'SW- Hola Maqte Colombia, quiero adquirir o activar mi permiso de miembro para el Beneficio 03: Centro de Formación en Fabricación de Bloques.',
  },
};

export default function BenefitSalesLanding({
  benefitId = 'calc',
  isLocked = true,
  currentUser = null,
  onOpenTool,
  onSelectBenefit,
  onRequestLogin,
  authCardElement = null,
}) {
  const data = BENEFITS_LANDING_DATA[benefitId] || BENEFITS_LANDING_DATA.calc;
  const IconComp = data.icon;

  // Interactive states inside the Hero Mockups so each landing feels alive!
  const [simBlock, setSimBlock] = useState('H10');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const activeSim = LIVE_CALC_PREVIEW[simBlock] || LIVE_CALC_PREVIEW.H10;
  const activeAcademyMod = ACADEMY_MODULES_PREVIEW[selectedModuleIdx] || ACADEMY_MODULES_PREVIEW[0];

  return (
    <div
      className="bsl-wrapper"
      style={{
        '--bsl-accent': data.accent,
        '--bsl-accent-soft': data.accentSoft,
      }}
    >
      {/* ─── 1. SUITE ECOSYSTEM SWITCHER (3 BENEFICIOS) ─── */}
      <div className="bsl-suite-bar">
        <div className="bsl-suite-bar-left">
          <span className="bsl-suite-tag">
            <Sparkles size={14} /> Suite Bloquera Digital 2026
          </span>
          <p className="bsl-suite-caption">
            Explora las <strong>3 Landings de Venta</strong> de los beneficios exclusivos para miembros de MAQTECOLOMBIA:
          </p>
        </div>

        <div className="bsl-pillars-badges" role="tablist" aria-label="Seleccionar Landing de Beneficio">
          {Object.values(BENEFITS_LANDING_DATA).map(b => {
            const BIcon = b.icon;
            const active = benefitId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`bsl-pillar-pill ${active ? 'active' : ''}`}
                onClick={() => onSelectBenefit && onSelectBenefit(b.id)}
              >
                <span className="bsl-pill-num">{b.number}</span>
                <BIcon size={15} />
                <span>{b.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. BESPOKE HIGH-CONVERTING HERO SECTION ─── */}
      <section className="bsl-hero-card">
        <div className="bsl-hero-glow" />
        <div className="bsl-hero-grid">
          {/* Left Column: Persuasive Copy & CTAs */}
          <div className="bsl-hero-left">
            <div className="bsl-badge-row">
              <span className="bsl-eyebrow">
                <IconComp size={14} /> {data.badge}
              </span>
              {isLocked ? (
                <span className="bsl-lock-status locked">
                  <Lock size={12} /> Requiere Permiso de Miembro
                </span>
              ) : (
                <span className="bsl-lock-status unlocked">
                  <CheckCircle2 size={12} /> Beneficio Desbloqueado
                </span>
              )}
            </div>

            <h1 className="bsl-title">
              {data.title}: <span>{data.highlight}</span>
            </h1>

            <p className="bsl-subtitle">{data.subtitle}</p>

            {/* Quick Stat Counters */}
            <div className="bsl-hero-stats-row">
              {data.heroStats.map((st, i) => (
                <div key={i} className="bsl-hero-stat">
                  <strong>{st.val}</strong>
                  <span>{st.lbl}</span>
                </div>
              ))}
            </div>

            <div className="bsl-price-banner">
              <Award size={20} />
              <div>
                <strong>{data.priceTag}</strong>
                <span>
                  Incluido sin costo adicional al adquirir cualquier máquina del Catálogo 2026 o mediante activación de membresía.
                </span>
              </div>
            </div>

            <div className="bsl-hero-actions">
              {!isLocked && onOpenTool ? (
                <button
                  type="button"
                  className="btn btn-primary bsl-main-cta"
                  onClick={onOpenTool}
                >
                  <PlayCircle size={18} /> Abrir {data.shortLabel} Ahora <ArrowRight size={16} />
                </button>
              ) : (
                <a
                  href="#desbloquear-beneficio"
                  className="btn btn-primary bsl-main-cta"
                  onClick={e => {
                    e.preventDefault();
                    document
                      .getElementById('desbloquear-beneficio')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Lock size={17} /> Desbloquear Beneficio {data.number} <ArrowRight size={16} />
                </a>
              )}

              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(data.whatsappText)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline bsl-wa-cta"
              >
                <MessageCircle size={17} /> Solicitar Acceso por WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: BESPOKE INTERACTIVE MOCKUP FOR EACH BENEFIT */}
          <div className="bsl-hero-preview">
            <div className="bsl-preview-window">
              <div className="bsl-preview-topbar">
                <div className="bsl-preview-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="bsl-preview-title">
                  {benefitId === 'calc' && 'Simulador Interactivo · Costos H10–H20'}
                  {benefitId === 'gestion' && 'Panel ERP · Flujo de Caja y Producción'}
                  {benefitId === 'curso' && 'Academia Técnica · 8 Módulos Oficiales'}
                </span>
                <span className="bsl-preview-live-pill">● EN VIVO</span>
              </div>

              {/* ── MOCKUP A: CALCULADORA INTERACTIVA (BENEFICIO 01) ── */}
              {benefitId === 'calc' && (
                <div className="bsl-mock-body">
                  <div className="bsl-mock-calc-tabs">
                    <span className="bsl-mock-lbl">Prueba un formato:</span>
                    <div className="bsl-mock-pill-group">
                      {Object.keys(LIVE_CALC_PREVIEW).map(code => (
                        <button
                          key={code}
                          type="button"
                          className={`bsl-mock-block-btn ${simBlock === code ? 'active' : ''}`}
                          onClick={() => setSimBlock(code)}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bsl-mock-highlight-box">
                    <div>
                      <small>UTILIDAD ESTIMADA LOTE (17.000 BLOQUES {simBlock})</small>
                      <strong>{activeSim.utilidadLote}</strong>
                      <span>
                        {activeSim.dim} · {activeSim.tag}
                      </span>
                    </div>
                    <div className="bsl-mock-margin-badge">
                      Margen {activeSim.margen}
                    </div>
                  </div>

                  <div className="bsl-preview-kpis">
                    <div className="bsl-preview-kpi">
                      <small>Costo Directo / Bloque</small>
                      <strong>{activeSim.costo}</strong>
                    </div>
                    <div className="bsl-preview-kpi">
                      <small>Precio Venta Aplicado</small>
                      <strong>{activeSim.venta}</strong>
                    </div>
                    <div className="bsl-preview-kpi is-positive">
                      <small>Utilidad Neta / Bloque</small>
                      <strong>+{activeSim.utilidadBloque}</strong>
                    </div>
                    <div className="bsl-preview-kpi">
                      <small>Punto de Equilibrio</small>
                      <strong>{activeSim.equilibrio}</strong>
                    </div>
                  </div>

                  <div className="bsl-mock-bars">
                    <span className="bsl-mock-bars-title">
                      Desglose del costo por bloque ({simBlock}):
                    </span>
                    {activeSim.bars.map((b, idx) => (
                      <div key={idx} className="bsl-mock-bar-row">
                        <div className="bsl-mock-bar-lbl">
                          <span>{b.label}</span>
                          <strong>{b.pct}%</strong>
                        </div>
                        <div className="bsl-mock-bar-track">
                          <div
                            className="bsl-mock-bar-fill"
                            style={{ width: `${b.pct}%`, background: b.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MOCKUP B: SISTEMA DE GESTIÓN OPERATIVA (BENEFICIO 02) ── */}
              {benefitId === 'gestion' && (
                <div className="bsl-mock-body">
                  <div className="bsl-preview-kpis">
                    <div className="bsl-preview-kpi is-positive">
                      <small>Ventas Registradas (Mes)</small>
                      <strong>$42.850.000 COP</strong>
                    </div>
                    <div className="bsl-preview-kpi">
                      <small>Compras Cemento + Gastos</small>
                      <strong>$23.400.000 COP</strong>
                    </div>
                    <div className="bsl-preview-kpi is-positive">
                      <small>Balance Operativo Neto</small>
                      <strong>+$19.450.000 COP</strong>
                    </div>
                    <div className="bsl-preview-kpi">
                      <small>Lotes Producidos en Planta</small>
                      <strong>26.400 bloques</strong>
                    </div>
                  </div>

                  <div className="bsl-mock-ledger">
                    <div className="bsl-mock-ledger-head">
                      <span>Últimos Movimientos de Planta</span>
                      <span className="bsl-mock-csv-tag">
                        <FileSpreadsheet size={12} /> Respaldo CSV Activo
                      </span>
                    </div>
                    <div className="bsl-mock-ledger-rows">
                      <div className="bsl-mock-ledger-row">
                        <span className="bsl-lbadge venta">VENTA</span>
                        <div className="bsl-linfo">
                          <strong>Ferretería El Constructor (Lote H10)</strong>
                          <small>2.500 bloques · Despacho en camión</small>
                        </div>
                        <strong className="bsl-lval pos">+$5.250.000</strong>
                      </div>
                      <div className="bsl-mock-ledger-row">
                        <span className="bsl-lbadge prod">PRODUCCIÓN</span>
                        <div className="bsl-linfo">
                          <strong>Jornada Turno Mañana · Bloque H12</strong>
                          <small>Operario: Planta Hidráulica Ficha 06</small>
                        </div>
                        <strong className="bsl-lval neutral">1.800 blq</strong>
                      </div>
                      <div className="bsl-mock-ledger-row">
                        <span className="bsl-lbadge compra">COMPRA</span>
                        <div className="bsl-linfo">
                          <strong>Cemento Estructural (80 bultos 50kg)</strong>
                          <small>Proveedor Mayorista Regional</small>
                        </div>
                        <strong className="bsl-lval neg">-$2.800.000</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MOCKUP C: ACADEMIA Y CENTRO DE FORMACIÓN (BENEFICIO 03) ── */}
              {benefitId === 'curso' && (
                <div className="bsl-mock-body">
                  <div className="bsl-mock-academy-cert">
                    <Award size={26} className="bsl-cert-ico" />
                    <div>
                      <small>PROGRAMA TÉCNICO INDUSTRIAL · 8 MÓDULOS</small>
                      <strong>Especialista en Fabricación de Bloques de Concreto</strong>
                      <span>Haz clic en cualquier módulo para previsualizar su contenido:</span>
                    </div>
                  </div>

                  <div className="bsl-mock-mod-pills">
                    {ACADEMY_MODULES_PREVIEW.map((m, idx) => (
                      <button
                        key={m.num}
                        type="button"
                        className={`bsl-mock-mod-btn ${selectedModuleIdx === idx ? 'active' : ''}`}
                        onClick={() => setSelectedModuleIdx(idx)}
                      >
                        Mód {m.num}
                      </button>
                    ))}
                  </div>

                  <div className="bsl-mock-mod-detail">
                    <div className="bsl-mock-mod-top">
                      <span className="bsl-mock-mod-badge">MÓDULO {activeAcademyMod.num}</span>
                      <span className="bsl-mock-mod-time">
                        <Clock size={12} /> {activeAcademyMod.duration}
                      </span>
                    </div>
                    <h4>{activeAcademyMod.title}</h4>
                    <p>{activeAcademyMod.summary}</p>
                    <div className="bsl-mock-mod-deliv">
                      <CheckCircle2 size={14} />
                      <span>
                        <strong>Entregable:</strong> {activeAcademyMod.deliverable}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bsl-preview-footer">
                <span>
                  <ShieldCheck size={14} /> Acceso vinculado a tu cuenta Wix Members
                </span>
                <Link to="/maquinas" className="bsl-preview-link">
                  Ver máquinas que incluyen este beneficio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. INDUSTRIAL BENTO GRID OF CAPABILITIES ─── */}
      <section className="bsl-features-section">
        <div className="bsl-sec-header">
          <span>Ingeniería Comercial y Operativa · Beneficio {data.number}</span>
          <h2>¿Por qué {data.shortLabel} transforma tu rentabilidad?</h2>
          <p>
            Diseñado específicamente para las condiciones reales de producción, insumos y comercialización de prefabricados en Colombia.
          </p>
        </div>

        <div className="bsl-bento-grid">
          {data.bentoFeatures.map((feat, i) => (
            <article
              key={i}
              className={`bsl-bento-card ${feat.span === 'wide' ? 'bento-wide' : ''}`}
            >
              <div className="bsl-bento-top">
                <span className="bsl-bento-badge">{feat.badge}</span>
                <span className="bsl-bento-num">0{i + 1}</span>
              </div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
              <div className="bsl-bento-metric">
                <strong>{feat.metric}</strong>
                <span>{feat.metricSub}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS IN 3 STEPS ─── */}
      <section className="bsl-workflow-section">
        <div className="bsl-sec-header">
          <span>Implementación Inmediata en tu Planta</span>
          <h2>Cómo funciona {data.shortLabel} en 3 simples pasos</h2>
        </div>

        <div className="bsl-workflow-grid">
          {data.workflowSteps.map((st, idx) => (
            <div key={idx} className="bsl-workflow-card">
              <div className="bsl-wf-step-circle">Paso {st.num}</div>
              <h3>{st.title}</h3>
              <p>{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. BEFORE VS. AFTER TRANSFORMATION MATRIX ─── */}
      <section className="bsl-compare-section">
        <div className="bsl-compare-card without">
          <div className="bsl-comp-header">
            <AlertTriangle size={20} />
            <h4>{data.comparison.withoutTitle}</h4>
          </div>
          <ul>
            {data.comparison.withoutItems.map((it, idx) => (
              <li key={idx}>
                <span className="bsl-bullet-bad">✕</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bsl-compare-card with">
          <div className="bsl-comp-header">
            <Sparkles size={20} />
            <h4>{data.comparison.withTitle}</h4>
          </div>
          <ul>
            {data.comparison.withItems.map((it, idx) => (
              <li key={idx}>
                <CheckCircle2 size={18} className="bsl-bullet-good" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── 6. MEMBERSHIP PLANS + WIX AUTHENTICATION & UNLOCK PORTAL ─── */}
      <section id="desbloquear-beneficio" className="bsl-unlock-section">
        <div className="bsl-unlock-left">
          <span className="bsl-unlock-tag">
            <Zap size={14} /> Desbloquea los 3 Beneficios de Bloquera Digital
          </span>
          <h2>2 Formas de Activar tu Acceso de Miembro</h2>
          <p>
            Toda la suite <strong>Bloquera Digital</strong> (<em>01. Calculadora de Costos</em>, <em>02. Gestión de Bloquera</em> y <em>03. Centro de Formación</em>) funciona con permisos de miembro verificados en Wix:
          </p>

          <div className="bsl-plans-grid">
            <div className="bsl-plan-card featured">
              <span className="bsl-plan-ribbon">MÁS ELEGIDO · BONIFICADO 100%</span>
              <h4>Incluido con tu Máquina MAQTECOLOMBIA</h4>
              <div className="bsl-plan-price">
                <strong>$0 COP</strong>
                <span>Bonificado al adquirir cualquier equipo</span>
              </div>
              <ul>
                <li>
                  <Check size={15} /> Acceso total a Calculadora, Gestión CSV y los 8 Módulos de Formación.
                </li>
                <li>
                  <Check size={15} /> Insignia <strong>Miembro Bloquera Pro</strong> asignada a tu correo.
                </li>
                <li>
                  <Check size={15} /> Acompañamiento técnico directo de fábrica en Florencia, Caquetá.
                </li>
              </ul>
              <Link to="/maquinas" className="btn btn-outline bsl-plan-btn">
                <Wrench size={15} /> Elegir mi Máquina en el Catálogo 2026
              </Link>
            </div>

            <div className="bsl-plan-card">
              <span className="bsl-plan-ribbon secondary">ACCESO INDEPENDIENTE</span>
              <h4>Membresía Bloquera Digital Pro</h4>
              <div className="bsl-plan-price">
                <strong>Activación Directa</strong>
                <span>Para bloqueras en operación o inversionistas</span>
              </div>
              <ul>
                <li>
                  <Check size={15} /> Habilitación inmediata de permisos en tu cuenta Wix Members.
                </li>
                <li>
                  <Check size={15} /> Uso ilimitado de simulaciones de lotes, gestión CSV y academia.
                </li>
                <li>
                  <Check size={15} /> Bono descontable si decides comprar tu máquina después.
                </li>
              </ul>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                  currentUser
                    ? `${data.whatsappText} Mi correo registrado es: ${currentUser.email}`
                    : data.whatsappText
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary bsl-plan-btn"
              >
                <MessageCircle size={16} /> Solicitar Activación por WhatsApp
              </a>
            </div>
          </div>

          {/* FAQ Mini Accordion */}
          {data.faqs && data.faqs.length > 0 && (
            <div className="bsl-faq-box">
              <h5>Preguntas Frecuentes sobre {data.shortLabel}</h5>
              {data.faqs.map((f, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`bsl-faq-item ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                  >
                    <div className="bsl-faq-q">
                      <strong>{f.q}</strong>
                      <ChevronDown size={16} />
                    </div>
                    {isOpen && <p className="bsl-faq-a">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Embedded Wix Login / Register Card or Member Status */}
        <div className="bsl-unlock-right">
          {authCardElement ? (
            authCardElement
          ) : (
            <div className="bsl-member-status-card">
              <div className="bsl-msc-badge">
                <ShieldCheck size={28} />
              </div>
              <h3>Cuenta Conectada en Wix Members</h3>
              <p className="bsl-msc-email">{currentUser?.email}</p>
              <span className="bsl-msc-role">{currentUser?.roleLabel || 'Miembro Registrado'}</span>

              {isLocked ? (
                <div className="bsl-msc-locked-box">
                  <p>
                    Tu correo ya está registrado, pero aún no tiene activado el permiso para <strong>{data.shortLabel}</strong>. Solicita la habilitación a nuestro equipo comercial y pulsa «Sincronizar permisos».
                  </p>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                      `${data.whatsappText} Mi correo registrado es: ${currentUser?.email}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <MessageCircle size={17} /> Solicitar Activación para {currentUser?.email}
                  </a>
                </div>
              ) : (
                <div className="bsl-msc-unlocked-box">
                  <p>
                    ¡Tienes acceso completo a <strong>{data.shortLabel}</strong>! Puedes abrir la herramienta interactiva cuando quieras:
                  </p>
                  {onOpenTool && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={onOpenTool}
                    >
                      <PlayCircle size={18} /> Abrir Herramienta {data.shortLabel}
                    </button>
                  )}
                </div>
              )}

              {onRequestLogin && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
                  onClick={onRequestLogin}
                >
                  Sincronizar mis permisos en Wix
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
