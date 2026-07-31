// =============================================================
// MAQTECOLOMBIA — Central Content Layer
// Decoupled from UI for future Wix Headless CMS integration.
// Replace these values with Wix API calls in Phase 2.
// =============================================================

export const BRAND = {
  name: "Maqte Colombia",
  tagline: "Fuerza Industrial al Alcance de Tu Obra",
  subtagline: "Maquinaria, Herramientas y Ferretería para Profesionales",
  description:
    "Distribuidores oficiales de las marcas más poderosas del mercado industrial. Tu aliado en construcción, agro y ferretería desde el corazón de Colombia.",
  phone: "+57 311 431 4547",
  whatsapp: "573114314547",
  email: "info@maqtecolombia.co",
  address: "Florencia, Caquetá, Colombia",
  socials: {
    instagram: "https://instagram.com/maqtecolombia",
    facebook: "https://facebook.com/maqtecolombia",
    youtube: "https://youtube.com/@maqtecolombia",
  },
};

export const CATEGORIES = [
  {
    id: "maquinaria",
    slug: "/maquinas",
    label: "Maquinaria",
    icon: "settings",
    accent: "#F7BC21",
    image: "/images/categories/maquinaria.png",
    description: "Plantas bloqueras y maquinaria pesada",
    subcategories: [
      { label: "Líneas de Maquinaria Bloquera", slug: "/maquinas" },
      { label: "Mezcladoras de Concreto", slug: "/tienda?q=Mezcladora" },
      { label: "Generadores y Motores", slug: "/tienda?q=Generador" },
      { label: "Hormigón Celular", slug: "/tienda?q=Hormigón" },
    ],
  },
  {
    id: "construccion",
    slug: "/tienda?q=Cemento",
    label: "Construcción",
    icon: "building",
    accent: "#3B82F6",
    image: "/images/categories/construccion.png",
    description: "Materiales, cemento y agregados",
    subcategories: [
      { label: "Cementos Tequendama", slug: "/tienda?q=Cemento" },
      { label: "Bloques y Ladrillos Farol", slug: "/tienda?q=Ladrillo" },
      { label: "Varillas, Mallas y Hierro", slug: "/tienda?q=Varilla" },
      { label: "Grava y Arena Lavada", slug: "/tienda?q=Arena" },
    ],
  },
  {
    id: "tuberias-pvc",
    slug: "/tienda?q=Tubo",
    label: "Tuberías y PVC",
    icon: "wrench",
    accent: "#10B981",
    image: "/images/categories/ferreteria.png",
    description: "Tuberías de presión, sanitarias y CPVC",
    subcategories: [
      { label: "Tubos de Presión y Sanitarios", slug: "/tienda?q=Tubo" },
      { label: "Accesorios, Codos y Tees", slug: "/tienda?q=Codo" },
      { label: "Pegantes PVC y CPVC", slug: "/tienda?q=Pegante" },
      { label: "Uniones y Cheques de Presión", slug: "/tienda?q=Unión" },
    ],
  },
  {
    id: "plomeria",
    slug: "/tienda?q=Sanitario",
    label: "Plomería y Baños",
    icon: "droplets",
    accent: "#06B6D4",
    image: "/images/categories/ferreteria.png",
    description: "Sanitarios, griferías y tanques",
    subcategories: [
      { label: "Sanitarios y Tazas Corona", slug: "/tienda?q=Sanitario" },
      { label: "Griferías y Mezcladoras", slug: "/tienda?q=Grifería" },
      { label: "Lavamanos y Regaderas", slug: "/tienda?q=Lavamanos" },
      { label: "Tanques de Almacenamiento", slug: "/tienda?q=Tanque" },
    ],
  },
  {
    id: "herramientas",
    slug: "/tienda?q=Herramienta",
    label: "Herramientas",
    icon: "hammer",
    accent: "#8B5CF6",
    image: "/images/categories/herramientas.png",
    description: "Herramientas eléctricas y manuales",
    subcategories: [
      { label: "Herramientas Eléctricas", slug: "/tienda?q=Eléctrica" },
      { label: "Herramientas Manuales", slug: "/tienda?q=Manual" },
      { label: "Chazos Galvanizados", slug: "/tienda?q=Chazos" },
      { label: "Amarres y Tornillería", slug: "/tienda?q=Amarre" },
    ],
  },
  {
    id: "electricos",
    slug: "/tienda?q=Eléctrico",
    label: "Eléctricos",
    icon: "zap",
    accent: "#F59E0B",
    image: "/images/categories/generadores.png",
    description: "Cables, cajas e interruptores",
    subcategories: [
      { label: "Cables y Rollos de Aluminio", slug: "/tienda?q=Cable" },
      { label: "Tubos y Curvas Eléctricas", slug: "/tienda?q=Eléctrico" },
      { label: "Cajas Octagonales y Rectangulares", slug: "/tienda?q=Caja" },
      { label: "Interruptores y Tomacorrientes", slug: "/tienda?q=Interruptor" },
    ],
  },
  {
    id: "sika-pegantes",
    slug: "/tienda?q=Sika",
    label: "Sika & Pegantes",
    icon: "flame",
    accent: "#EF4444",
    image: "/images/categories/soldadura.png",
    description: "Impermeabilizantes, adhesivos y químicos",
    subcategories: [
      { label: "Aditivos y Productos SIKA", slug: "/tienda?q=Sika" },
      { label: "Pegantes para Cerámica HUNE", slug: "/tienda?q=Pegante" },
      { label: "Impermeabilizantes para Ladrillo", slug: "/tienda?q=Impermeabilizante" },
      { label: "Ácido Nítrico de Limpieza", slug: "/tienda?q=Ácido" },
    ],
  },
];

export const BRANDS = [
  { name: "Honda", logo: "/images/brands/honda.png", category: "Maquinaria", est: 1948 },
  { name: "Bosch", logo: "/images/brands/bosch.png", category: "Herramientas", est: 1886 },
  { name: "Makita", logo: "/images/brands/makita.png", category: "Herramientas", est: 1915 },
  { name: "Husqvarna", logo: "/images/brands/husqvarna.png", category: "Agro", est: 1689 },
  { name: "DeWalt", logo: "/images/brands/dewalt.png", category: "Herramientas", est: 1923 },
  { name: "Stanley", logo: "/images/brands/stanley.png", category: "Herramientas", est: 1843 },
  { name: "Milwaukee", logo: "/images/brands/milwaukee.png", category: "Herramientas", est: 1924 },
  { name: "Stihl", logo: "/images/brands/stihl.png", category: "Agro", est: 1926 },
  { name: "Black+Decker", logo: "/images/brands/blackdecker.png", category: "Herramientas", est: 1910 },
  { name: "Briggs & Stratton", logo: "/images/brands/briggs.png", category: "Maquinaria", est: 1908 },
  { name: "Karcher", logo: "/images/brands/karcher.png", category: "Maquinaria", est: 1935 },
  { name: "Ingco", logo: "/images/brands/ingco.webp", category: "Herramientas", est: 2003 },
];

export const STATS = [
  { value: "500+", label: "Productos disponibles" },
  { value: "12+", label: "Años de experiencia" },
  { value: "5K+", label: "Clientes satisfechos" },
  { value: "7", label: "Líneas de productos" },
];

export const NAV_LINKS = [
  { label: "Tienda", path: "/tienda" },
  { label: "Categorías", path: "/categorias", isMegaMenu: true },
  { label: "Máquinas", path: "/maquinas" },
  { label: "Marcas", path: "/marcas" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contacto", path: "/contacto" },
];

export const MACHINE_LINES = [
  {
    id: "artesanal",
    name: "Línea Artesanal",
    tagline: "Ideal para autoconstrucción, pequeños emprendimientos y producción local",
    badge: "Inicial / Emprendedor",
    production: "200 a 300 bloques por día",
    productionMin: 200,
    productionMax: 300,
    operators: "2 personas",
    operatorsMin: 2,
    operatorsMax: 2,
    space: "50 a 100 m²",
    budgetLevel: "Bajo / Inicial",
    budgetKey: "bajo",
    image: "/images/maquinas/artesanal.png",
    description: "Compacta, confiable y fácil de operar. Diseñada para proyectos comunitarios, autoconstrucción asistida y personas que están iniciando en la producción de bloques de concreto.",
    features: [
      "Sistema de vibración eficiente de bajo consumo",
      "Fácil transporte y rápida instalación",
      "Bajos costos de mantenimiento y repuestos sencillos",
      "Opción de moldes intercambiables para bloque y adoquín"
    ],
    whatsappMsg: "SW- Hola, quisiera cotizar y recibir información de la Línea Artesanal (200-300 bloques/día)."
  },
  {
    id: "semindustrial",
    name: "Línea Semindustrial",
    tagline: "Ideal para emprendedores y pequeñas empresas de prefabricados",
    badge: "Popular Emprendimiento",
    production: "600 a 700 bloques por día",
    productionMin: 600,
    productionMax: 700,
    operators: "2 a 4 personas",
    operatorsMin: 2,
    operatorsMax: 4,
    space: "100 a 300 m²",
    budgetLevel: "Moderado",
    budgetKey: "moderado",
    image: "/images/maquinas/semindustrial.png",
    description: "El equilibrio perfecto entre inversión accesible y alta productividad diaria. Permite abastecer obras locales y distribuidores ferreteros regionales con excelente acabado.",
    features: [
      "Compactación neumática/mecánica de alta densidad",
      "Estructura en acero de alta resistencia contra fatiga",
      "Producción versátil de bloques, adoquines y calados",
      "Retorno de inversión estimado a corto plazo"
    ],
    whatsappMsg: "SW- Hola, quisiera recibir información y cotización de la Línea Semindustrial (600-700 bloques/día)."
  },
  {
    id: "industrial",
    name: "Línea Industrial",
    tagline: "Ideal para constructoras, proyectos de vivienda y producción continua",
    badge: "Alto Rendimiento",
    production: "3.000 a 5.000 bloques por día",
    productionMin: 3000,
    productionMax: 5000,
    operators: "4 a 6 personas",
    operatorsMin: 4,
    operatorsMax: 6,
    space: "300 a 1.000 m²",
    budgetLevel: "Medio - Alto",
    budgetKey: "medio-alto",
    image: "/images/maquinas/industrial.png",
    description: "Diseñada para operaciones continuas y exigentes. Ofrece bloques homogéneos de alta resistencia estructural para proyectos de infraestructura y vivienda masiva.",
    features: [
      "Vibración sincronizada multidireccional",
      "Ciclos de moldeo ultrarrápidos",
      "Compatible con sistemas de alimentación por tolva",
      "Robustez industrial para jornadas intensivas de trabajo"
    ],
    whatsappMsg: "SW- Hola, me interesa cotizar la Línea Industrial (3.000 a 5.000 bloques/día)."
  },
  {
    id: "industrial-alta",
    name: "Línea Industrial de Alta Producción",
    tagline: "Ideal para plantas de prefabricados y proyectos de gran escala",
    badge: "Gran Escala",
    production: "7.000 a 8.000 bloques por día",
    productionMin: 7000,
    productionMax: 8000,
    operators: "5 a 6 personas",
    operatorsMin: 5,
    operatorsMax: 6,
    space: "1.000 a 3.000 m²",
    budgetLevel: "Alto Industrial",
    budgetKey: "alto",
    image: "/images/maquinas/industrial_alta.png",
    description: "Planta semi-automatizada para alta capacidad de suministro continuo. Maximiza las toneladas producidas por jornada con estándares internacionales de compresión.",
    features: [
      "Sistema de desmolde hidráulico servoasistido",
      "Optimización de consumo de cemento y agregados",
      "Alta precisión geométrica en cada bloque",
      "Diseño modular ampliable según demandas de mercado"
    ],
    whatsappMsg: "SW- Hola, me interesa cotización y catálogo técnico de la Línea Industrial de Alta Producción (7.000-8.000 bloques/día)."
  },
  {
    id: "automatica",
    name: "Línea Automática",
    tagline: "Sistema automatizado con PLC y pantalla HMI para maximizar la productividad",
    badge: "Tecnología Premium PLC",
    production: "8.000 a 10.000 bloques por día",
    productionMin: 8000,
    productionMax: 10000,
    operators: "3 a 4 personas",
    operatorsMin: 3,
    operatorsMax: 4,
    space: "1.000 a 3.000 m²",
    budgetLevel: "Automatizada Premium",
    budgetKey: "premium",
    image: "/images/maquinas/automatica.png",
    description: "Máxima tecnología en producción de prefabricados. Control digital total por PLC y pantalla HMI, optimizando insumos y reduciendo significativamente la dependencia de mano de obra.",
    features: [
      "Control PLC con pantalla táctil intuitiva HMI",
      "Dosificación y alimentación de mezcla de alta precisión",
      "Diagnóstico inteligente de fallas en pantalla",
      "Mínimo requerimiento de operarios con máxima producción diaria"
    ],
    whatsappMsg: "SW- Hola, solicito asesoría personalizada y propuesta económica para la Línea Automática (8.000-10.000 bloques/día)."
  }
];

export const COMPLEMENTARY_EQUIPMENT = [
  {
    id: "mezcladoras",
    title: "Mezcladoras Horizontales",
    desc: "Diseñadas para lograr una homogeneidad perfecta en mezclas secas y semi-secas de concreto, reduciendo tiempos de ciclos de amasado.",
    icon: "RotateCw",
    badge: "Eficiencia de Mezcla"
  },
  {
    id: "bandas",
    title: "Bandas Transportadoras",
    desc: "Sistemas de transporte continuo para materiales y agregados, optimizando la alimentación hacia la máquina bloquera sin esfuerzo manual.",
    icon: "ArrowRightLeft",
    badge: "Logística Interna"
  },
  {
    id: "tolvas",
    title: "Tolvas y Sistemas de Manejo",
    desc: "Almacenamiento y dosificación controlada de áridos y cemento para alimentar líneas semindustriales e industriales de forma fluida.",
    icon: "Layers",
    badge: "Dosificación"
  },
  {
    id: "moldes",
    title: "Moldes Especiales y Accesorios",
    desc: "Moldes intercambiables en aceros tratados térmicamente para bloques estructurales, adoquines, bordillos y diseños arquitectónicos a medida.",
    icon: "Grid",
    badge: "Personalizado"
  }
];

export const INNOVATION_ITEMS = [
  {
    id: "hormigon-celular",
    title: "Máquina para Hormigón Celular (Prototipo)",
    status: "Fase Prototipo / Innovación",
    desc: "Nueva tecnología para la fabricación de bloques livianos de hormigón celular con alta capacidad de aislamiento térmico y acústico.",
    tag: "Prototipo Maqte Tech"
  },
  {
    id: "nuevas-tec",
    title: "Nuevas Tecnologías para Prefabricados",
    status: "I+D Continuo",
    desc: "Sistemas eco-amigables con aprovechamiento de agregados reciclados y procesos de curado optimizado para reducir la huella de carbono.",
    tag: "Desarrollo Sostenible"
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    headline: "Fuerza Industrial",
    subheadline: "al Alcance de Tu Obra",
    description: "Distribuidores de maquinaria, herramientas y ferretería profesional en Colombia.",
    cta: "Explorar Tienda",
    ctaLink: "/tienda",
    accent: "#F7BC21",
    category: "Maquinaria",
  },
  {
    id: 2,
    headline: "Herramientas",
    subheadline: "para Profesionales",
    description: "Las marcas más confiables del mercado: Bosch, Makita, DeWalt, Milwaukee y más.",
    cta: "Ver Herramientas",
    ctaLink: "/tienda/herramientas",
    accent: "#8B5CF6",
    category: "Herramientas",
  },
  {
    id: 3,
    headline: "Campo y Construcción",
    subheadline: "Todo en Un Solo Lugar",
    description: "Desde guadañas hasta mezcladoras de concreto. Tu ferretería industrial de confianza.",
    cta: "Ver Ofertas",
    ctaLink: "/tienda/ofertas",
    accent: "#22C55E",
    category: "Agro",
  },
];
