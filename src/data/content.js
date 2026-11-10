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

export const MACHINE_CATEGORIES_2026 = [
  {
    id: "artesanal",
    title: "Línea Artesanal",
    subtitle: "Inversión inicial baja · Retorno rápido",
    description: "Equipos compactos manuales, con motovibración y ponedoras pequeñas ideales para iniciar tu propio negocio de prefabricados o abastecer obras locales.",
    accent: "#F7BC21",
    badge: "3 Equipos · Desde $1.300.000",
    codes: ["01", "02", "03"],
  },
  {
    id: "semiindustrial",
    title: "Línea Semiindustrial",
    subtitle: "Mayor volumen diario · Moldes intercambiables",
    description: "Bloqueras estacionarias y ponedoras grandes de doble motovibrador diseñadas para abastecer ferreterías, depósitos y proyectos constructivos regionales.",
    accent: "#F59E0B",
    badge: "2 Equipos · Alta Versatilidad",
    codes: ["04", "05"],
  },
  {
    id: "hidraulica-compacta",
    title: "Línea Hidráulica Compacta",
    subtitle: "Prensado hidráulico · Opción Línea Equipada",
    description: "Salto tecnológico a compactación hidráulica estacionaria para bloques de mayor densidad estructural. Disponible individual o en planta equipada.",
    accent: "#10B981",
    badge: "Ficha 06 · $28.000.000 COP",
    codes: ["06"],
  },
  {
    id: "hidraulica-industrial",
    title: "Línea Hidráulica Industrial y PLC",
    subtitle: "4.000 a 7.000 bloques/jornada · Automatización",
    description: "Plantas industriales de alto tonelaje con mandos hidráulicos o secuencia automática controlada por PLC Kinco K623S y pantalla táctil HMI de 7”.",
    accent: "#3B82F6",
    badge: "2 Plantas · Gran Escala",
    codes: ["07", "08"],
  },
  {
    id: "complementarios",
    title: "Equipos Complementarios",
    subtitle: "Automatiza tu línea de mezclado y carga",
    description: "Bandas transportadoras industriales de 6 metros y mezcladoras horizontales de 2 bultos para optimizar el flujo continuo de concreto semiseco.",
    accent: "#8B5CF6",
    badge: "2 Equipos · Logística y Mezcla",
    codes: ["09", "10"],
  },
];

export const MACHINE_CATALOG_2026 = [
  {
    id: "bloquera-manual-compacta",
    code: "01",
    line: "Línea Artesanal",
    lineId: "artesanal",
    name: "Bloquera manual compacta",
    price: "$1.300.000 COP",
    priceShort: "$1.300.000",
    previousPrice: "$1.500.000 COP",
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/01-bloquera-manual-compacta.png",
    orientation: "portrait",
    description: "Equipo de accionamiento manual para fabricación de bloques de concreto.",
    longDescription: "La Bloquera Manual Compacta (Ficha 01) es el punto de partida más accesible para emprender en el sector de prefabricados o reducir costos en proyectos de autoconstrucción. Su estructura en acero reforzado permite fabricar bloques de concreto sin requerir energía eléctrica, facilitando el trabajo en zonas rurales, veredas o frentes de obra sin conexión a red.",
    specs: [
      { label: "Operación", value: "Manual" },
      { label: "Aplicación", value: "Producción artesanal" },
      { label: "Referencia comercial", value: "Precio anterior: $1.500.000" },
      { label: "Requerimiento eléctrico", value: "No requiere electricidad (100% mecánica)" },
      { label: "Estructura", value: "Acero estructural con pintura anticorrosiva industrial" }
    ],
    incomeHighlight: {
      headline: "Inicia tu bloquera con la inversión más baja del mercado",
      dailyOutput: "150 – 250 bloques/jornada (según operario)",
      operators: "1 a 2 operarios",
      area: "Desde 30 m²",
      idealFor: "Autoconstrucción, obras rurales, fincas e inicio de emprendimiento local",
      formats: ["Bloque H10", "Bloque H12", "Bloque H15 (según molde solicitado)"],
      roiPoints: [
        "Cero consumo de energía eléctrica: opera en cualquier terreno o vereda.",
        "Recuperación de la inversión en las primeras semanas de producción.",
        "Mantenimiento mínimo y operación intuitiva desde el primer día.",
        "Ideal para fabricar los bloques de tu propia obra ahorrando hasta un 40%."
      ]
    },
    includesList: [
      "Estructura compacta de moldeo manual en acero",
      "Molde configurado según formato acordado en cotización",
      "Asesoría en dosificación de mezcla semiseca",
      "Despacho a cualquier municipio de Colombia"
    ],
    note: "Confirmar molde y accesorios incluidos al cotizar.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 01: Bloquera manual compacta ($1.300.000 COP) de la Línea Artesanal."
  },
  {
    id: "bloquera-manual-motovibrador",
    code: "02",
    line: "Línea Artesanal",
    lineId: "artesanal",
    name: "Bloquera manual compacta con motovibrador",
    price: "$2.100.000 COP",
    priceShort: "$2.100.000",
    previousPrice: "$2.300.000 COP",
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/02-bloquera-manual-motovibrador.png",
    orientation: "portrait",
    description: "Equipo compacto que incorpora vibración durante el moldeo.",
    longDescription: "La Bloquera Manual Compacta con Motovibrador (Ficha 02) eleva la calidad y resistencia del bloque artesanal al integrar vibración mecánica directa sobre la caja de moldeo. Logra una compactación superior del concreto semiseco, mejores acabados en las caras del bloque y ciclos más rápidos con menor esfuerzo físico del operario.",
    specs: [
      { label: "Operación", value: "Manual con motovibración" },
      { label: "Aplicación", value: "Bloques de concreto" },
      { label: "Referencia comercial", value: "Precio anterior: $2.300.000" },
      { label: "Sistema de compactación", value: "Motovibrador eléctrico acoplado al chasis" },
      { label: "Ventaja competitiva", value: "Mayor densidad y resistencia por bloque frente al moldeo manual puro" }
    ],
    incomeHighlight: {
      headline: "Empieza a vender bloques vibrados de calidad ferretera con baja inversión",
      dailyOutput: "250 – 400 bloques/jornada (según operarios y mezcla)",
      operators: "2 operarios",
      area: "40 a 80 m²",
      idealFor: "Emprendedores de prefabricados, ventas a maestros de obra y ferreterías de barrio",
      formats: ["Bloque H10", "Bloque H12", "Bloque H15", "Ladrillo estructural"],
      roiPoints: [
        "Compactación vibrada que permite competir en calidad con bloqueras más grandes.",
        "Bajo consumo eléctrico monofásico y fácil traslado en camioneta o remolque.",
        "Excelente margen por lote produciendo bloques estructurales y divisorios.",
        "Rápido retorno de capital gracias a su precio promocional de $2.100.000 COP."
      ]
    },
    includesList: [
      "Módulo compacto en acero con motovibrador industrial integrado",
      "Molde de compactación según referencia solicitada",
      "Guía de conexión eléctrica y puesta en marcha operativa",
      "Acceso a calculadora Bloquera Digital para control de costos"
    ],
    note: "Las condiciones eléctricas y el molde se precisan en la cotización.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 02: Bloquera manual compacta con motovibrador ($2.100.000 COP) de la Línea Artesanal."
  },
  {
    id: "bloquera-ponedora-pequena",
    code: "03",
    line: "Línea Artesanal",
    lineId: "artesanal",
    name: "Bloquera ponedora pequeña",
    price: "$8.300.000 COP",
    priceShort: "$8.300.000",
    previousPrice: null,
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/03-bloquera-ponedora-pequena.png",
    orientation: "portrait",
    description: "Equipo móvil que deposita bloques directamente sobre una superficie nivelada.",
    longDescription: "La Bloquera Ponedora Pequeña (Ficha 03) elimina por completo el gasto en tablas o estibas de recepción: moldea y deposita 4 bloques H10 por ciclo directamente sobre la pista de concreto nivelada, avanzando manualmente hacia la siguiente tirada. Su molde intercambiable y su motovibrador de 280 W a 110 V la convierten en la favorita de las bloqueras en crecimiento.",
    specs: [
      { label: "Producción por ciclo", value: "4 bloques H10 con molde estándar" },
      { label: "Alimentación", value: "110 V · 60 Hz, según ficha" },
      { label: "Motovibrador", value: "280 W nominales, según ficha" },
      { label: "Molde", value: "Intercambiable" },
      { label: "Operación", value: "Desplazamiento manual sobre pista nivelada" }
    ],
    incomeHighlight: {
      headline: "Multiplica tu producción diaria sin gastar un peso en tablas de madera",
      dailyOutput: "600 – 1.000 bloques/jornada (4 bloques H10 por tirada)",
      operators: "2 a 3 operarios",
      area: "Pista nivelada desde 100 m²",
      idealFor: "Bloqueras comerciales locales, contratistas de vivienda y depósitos de materiales",
      formats: ["4 Bloques H10 / ciclo", "Bloque H12", "Bloque H15", "Adoquines (con cambio de molde)"],
      roiPoints: [
        "Ahorro inmediato de millones de pesos al no requerir tablas ni bandejas de secado.",
        "Conexión sencilla a 110 V · 60 Hz compatible con cualquier local o bodega.",
        "Sistema de molde intercambiable para diversificar tu catálogo de productos.",
        "Capacidad comercial constante para atender pedidos por miles de unidades."
      ]
    },
    includesList: [
      "Chasis móvil en acero con ruedas de desplazamiento de alta resistencia",
      "Motovibrador de 280 W (110 V · 60 Hz) instalado",
      "Molde estándar intercambiable (4 cavidades H10 de referencia)",
      "Acompañamiento técnico de operación y mantenimiento"
    ],
    note: "La producción diaria depende de la mezcla, el personal y el tiempo de ciclo.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 03: Bloquera ponedora pequeña ($8.300.000 COP) de la Línea Artesanal."
  },
  {
    id: "bloquera-fija-manual",
    code: "04",
    line: "Línea Semiindustrial",
    lineId: "semiindustrial",
    name: "Bloquera fija manual con moldes intercambiables",
    price: "Consultar precio / Por cotizar",
    priceShort: "Consultar precio / Por cotizar",
    previousPrice: null,
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/04-bloquera-fija-manual.png",
    orientation: "portrait",
    description: "Equipo estacionario con mesa de vibrocompactación y recepción de bloques sobre tablas.",
    longDescription: "La Bloquera Fija Manual con Moldes Intercambiables (Ficha 04) está construida para trabajo pesado continuo en planta estacionaria. Cuenta con base en lámina de 10 mm, componentes de molde en láminas de 6 y 12 mm, y barras guía de 1½ pulgadas con bujes de nylon de baja fricción. Además, su diseño modular permite acoplar a futuro tolva, banda transportadora y mezcladora.",
    specs: [
      { label: "Sistema", value: "Vibrocompactación y accionamiento manual" },
      { label: "Motovibrador", value: "280 W, según configuración informada" },
      { label: "Estructura", value: "Base en lámina de 10 mm" },
      { label: "Moldes", value: "Componentes en láminas de 6 y 12 mm, según ficha" },
      { label: "Guías", value: "Barras de 1½ pulgadas con bujes de nylon" },
      { label: "Ampliaciones", value: "Tolva, banda transportadora y mezcladora opcionales" }
    ],
    incomeHighlight: {
      headline: "Planta estacionaria escalable: produce en serie sin necesitar una gran pista de piso",
      dailyOutput: "800 – 1.400 bloques/jornada (según molde y cuadrilla)",
      operators: "2 a 4 operarios",
      area: "80 a 200 m² (estacionaria con estibas)",
      idealFor: "Plantas de prefabricados con espacio techado compacto que buscan escalar a línea completa",
      formats: ["Bloque H10", "Bloque H12", "Bloque H15", "Bloque H20", "Adoquín peatonal y vehicular"],
      roiPoints: [
        "No exige grandes pistas de concreto: los bloques salen en tablas listos para apilar.",
        "Construcción robusta en lámina de 10 mm y 12 mm para años de trabajo continuo.",
        "Escalable: puedes empezar con la máquina base y sumar banda y mezcladora después.",
        "Guiado de precisión en barras de 1½” para bloques con altura exacta."
      ]
    },
    includesList: [
      "Bloquera estacionaria en lámina estructural de 10 mm",
      "Sistema de guías de 1½” con bujes de nylon y motovibrador de 280 W",
      "Molde intercambiable en acero de 6 y 12 mm según pedido",
      "Preparación estructural para futuras ampliaciones (tolva y banda)"
    ],
    note: "Permite integrar tolva, banda transportadora y mezcladora como ampliaciones opcionales.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 04: Bloquera fija manual con moldes intercambiables de la Línea Semiindustrial."
  },
  {
    id: "bloquera-ponedora-grande",
    code: "05",
    line: "Línea Semiindustrial",
    lineId: "semiindustrial",
    name: "Bloquera ponedora grande",
    price: "$22.000.000 COP",
    priceShort: "$22.000.000",
    previousPrice: null,
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/05-bloquera-ponedora-grande.png",
    orientation: "landscape",
    description: "Equipo móvil de vibrocompactación para fabricar bloques directamente sobre el área de trabajo.",
    longDescription: "La Bloquera Ponedora Grande (Ficha 05) duplica la potencia de compactación gracias a sus 2 motovibradores regulables de 280 W cada uno y un chasis de mayor envergadura para producción semindustrial en piso. Permite fabricar más unidades por tirada con excelente densidad, manteniendo la ventaja de no requerir tablas de madera ni sistemas hidráulicos complejos.",
    specs: [
      { label: "Motovibradores", value: "2 regulables de 280 W cada uno" },
      { label: "Alimentación", value: "110 V · 60 Hz" },
      { label: "Molde", value: "Intercambiable" },
      { label: "Aplicación", value: "Producción semindustrial" }
    ],
    incomeHighlight: {
      headline: "Doble potencia vibratoria para abastecer proyectos de construcción y ferreterías",
      dailyOutput: "1.500 – 2.500 bloques/jornada (según molde y logística de mezcla)",
      operators: "3 a 4 operarios",
      area: "Pista de concreto desde 200 m²",
      idealFor: "Empresas de prefabricados, proveedores de obras públicas y distribuidores mayoristas",
      formats: ["Bloque H10 (alta capacidad/ciclo)", "Bloque H12", "Bloque H15", "Bloque H20"],
      roiPoints: [
        "Doble motovibrador regulable que garantiza compactación uniforme en todo el ancho del molde.",
        "Opera con red monofásica estándar de 110 V · 60 Hz sin requerir subestación trifásica.",
        "Cero inversión en tablas: descarga directa en pista con ciclos continuos.",
        "Alto volumen de facturación mensual con costos operativos reducidos."
      ]
    },
    includesList: [
      "Bloquera ponedora semindustrial de chasis reforzado",
      "2 motovibradores regulables de 280 W (110 V · 60 Hz)",
      "Molde intercambiable de alta capacidad según especificación",
      "Inducción técnica de operación y ajuste de vibración"
    ],
    note: "Capacidad por tirada y rendimiento sujetos al molde instalado y a las condiciones de operación.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 05: Bloquera ponedora grande ($22.000.000 COP) de la Línea Semiindustrial."
  },
  {
    id: "bloquera-fija-hidraulica-pequena",
    code: "06",
    line: "Línea Hidráulica Compacta",
    lineId: "hidraulica-compacta",
    name: "Bloquera fija hidráulica pequeña",
    price: "$28.000.000 COP",
    priceShort: "$28.000.000",
    previousPrice: null,
    equippedPrice: "$65.800.000 COP",
    equippedDesc: "Máquina + mezcladora + banda transportadora",
    image: "/images/maquinas/06-bloquera-fija-hidraulica-pequena.png",
    orientation: "portrait",
    description: "Máquina estacionaria de fabricación de bloques con accionamiento hidráulico.",
    longDescription: "La Bloquera Fija Hidráulica Pequeña (Ficha 06) combina un formato estacionario compacto con la fuerza del accionamiento hidráulico. Permite alcanzar resistencias a la compresión superiores y un desmoldeo limpio sin fatiga para el operario. Puedes adquirir la máquina base en $28.000.000 COP o la Línea Equipada completa con mezcladora y banda transportadora por $65.800.000 COP.",
    specs: [
      { label: "Sistema", value: "Accionamiento hidráulico" },
      { label: "Configuración base", value: "Máquina individual ($28.000.000 COP)" },
      { label: "Línea equipada", value: "Máquina + mezcladora + banda transportadora" },
      { label: "Precio línea equipada", value: "$65.800.000 COP" }
    ],
    incomeHighlight: {
      headline: "Da el salto a la calidad hidráulica estructural con opción de planta completa",
      dailyOutput: "2.000 – 3.000 bloques/jornada (mayor con línea equipada)",
      operators: "3 a 4 operarios",
      area: "150 a 350 m²",
      idealFor: "Constructoras, plantas de bloques estructurales y emprendedores que buscan calidad certificable",
      formats: ["Bloque estructural H10 / H12 / H15 / H20", "Adoquín de tráfico pesado", "Bordillos y prefabricados"],
      roiPoints: [
        "Prensado hidráulico que eleva la densidad, resistencia y acabado de cada unidad.",
        "Opción llave en mano ($65.800.000 COP) con mezcladora y banda para automatizar la carga.",
        "Menor desgaste físico del personal y ciclos estables durante toda la jornada.",
        "Abre las puertas a contratos con constructoras e ingenieros que exigen bloque prensado."
      ]
    },
    includesList: [
      "Máquina bloquera estacionaria con unidad y cilindros hidráulicos",
      "Sistema de vibrocompactación sincronizado",
      "Molde intercambiable de alta resistencia",
      "Opción Línea Equipada ($65.800.000): suma mezcladora horizontal y banda transportadora"
    ],
    note: "Disponible en configuración individual o como paquete de línea equipada cotizado como conjunto.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 06: Bloquera fija hidráulica pequeña ($28.000.000 COP base / $65.800.000 COP línea equipada)."
  },
  {
    id: "bloquera-hidraulica-industrial-manual",
    code: "07",
    line: "Línea Hidráulica Industrial",
    lineId: "hidraulica-industrial",
    name: "Bloquera hidráulica industrial manual",
    price: "$88.000.000 COP",
    priceShort: "$88.000.000",
    previousPrice: null,
    equippedPrice: "$130.000.000 COP",
    equippedDesc: "Incluye mezcladora y banda",
    image: "/images/maquinas/07-bloquera-hidraulica-industrial-manual.png",
    orientation: "landscape",
    description: "Sistema industrial de prensado, vibrocompactación y desmoldeo mediante mandos hidráulicos manuales.",
    longDescription: "La Bloquera Hidráulica Industrial Manual (Ficha 07) es una planta de alto rendimiento diseñada para producir hasta 4.000–5.000 bloques por jornada (8 bloques H10, 6 H15 o 4 H20 por ciclo). Opera mediante central hidráulica industrial, mesa vibratoria de alto impacto y válvulas de palanca convencionales (sin PLC), ofreciendo máxima confiabilidad mecánica y facilidad de mantenimiento en cualquier región del país.",
    specs: [
      { label: "Control", value: "Válvulas de palanca y mandos convencionales; sin PLC" },
      { label: "Sistema", value: "Central hidráulica, mesa vibratoria y alimentación" },
      { label: "Moldeo referencial", value: "8 H10 / 6 H15 / 4 H20 por ciclo" },
      { label: "Producción referencial", value: "Hasta 4.000–5.000 bloques por jornada, según condiciones" },
      { label: "Línea equipada", value: "$130.000.000 · incluye mezcladora y banda" }
    ],
    incomeHighlight: {
      headline: "Producción industrial de 4.000 a 5.000 bloques diarios con mecánica 100% confiable",
      dailyOutput: "4.000 – 5.000 bloques/jornada (8 H10 / 6 H15 / 4 H20 por ciclo)",
      operators: "4 a 5 operarios",
      area: "350 a 800 m²",
      idealFor: "Plantas industriales de prefabricados, consorcios viales y proyectos de vivienda masiva",
      formats: ["8 Bloques H10 / ciclo", "6 Bloques H15 / ciclo", "4 Bloques H20 / ciclo", "Adoquines y estructurales"],
      roiPoints: [
        "Alto volumen por tirada (8 bloques H10 simultáneos) que multiplica la facturación diaria.",
        "Mandos hidráulicos por palanca: fácil operación y mantenimiento sin depender de electrónica compleja.",
        "Disponible en Línea Equipada ($130.000.000 COP) con mezcladora y banda transportadora.",
        "Capacidad para abastecer múltiples obras y licitaciones de forma simultánea."
      ]
    },
    includesList: [
      "Bloquera hidráulica industrial con central hidráulica y mandos por palanca",
      "Mesa vibratoria industrial y sistema de alimentación",
      "Molde industrial de alta capacidad (8 H10 / 6 H15 / 4 H20 referencial)",
      "Opción Línea Equipada ($130.000.000): incluye mezcladora y banda transportadora"
    ],
    note: "Capacidades sujetas a molde, dosificación, jornada y ficha de la configuración contratada.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 07: Bloquera hidráulica industrial manual ($88.000.000 COP base / $130.000.000 COP línea equipada)."
  },
  {
    id: "bloquera-hidraulica-automatica-plc",
    code: "08",
    line: "Línea Hidráulica Industrial",
    lineId: "hidraulica-industrial",
    name: "Bloquera hidráulica automática PLC",
    price: "$130.000.000 COP",
    priceShort: "$130.000.000",
    previousPrice: null,
    equippedPrice: "$190.000.000 COP",
    equippedDesc: "Incluye mezcladora y banda",
    image: "/images/maquinas/08-bloquera-hidraulica-automatica-plc.png",
    orientation: "landscape",
    description: "Equipo industrial con secuencia automatizada de alimentación, vibración, prensado y desmoldeo.",
    longDescription: "La Bloquera Hidráulica Automática PLC (Ficha 08) representa el tope de gama de MAQTECOLOMBIA. Gobernada por un PLC Kinco K623S con pantalla táctil HMI de 7” y central hidráulica de 7,5 HP (220 V trifásica · 60 Hz), automatiza toda la secuencia de alimentación, vibración, prensado y desmoldeo para alcanzar entre 6.000 y 7.000 bloques por jornada con precisión milimétrica.",
    specs: [
      { label: "Automatización", value: "PLC Kinco K623S y HMI táctil de 7”, según ficha" },
      { label: "Moldeo referencial", value: "8 H10 / 6 H15 / 4 H20 por ciclo" },
      { label: "Producción referencial", value: "6.000–7.000 bloques por jornada, según condiciones" },
      { label: "Alimentación", value: "220 V trifásica · 60 Hz, según diseño" },
      { label: "Central hidráulica", value: "7,5 HP, según ficha de diseño" },
      { label: "Línea equipada", value: "$190.000.000 · incluye mezcladora y banda" }
    ],
    incomeHighlight: {
      headline: "Automatización total PLC Kinco: hasta 7.000 bloques por jornada para liderar tu región",
      dailyOutput: "6.000 – 7.000 bloques/jornada (ciclo automático continuo)",
      operators: "3 a 4 operarios",
      area: "500 a 1.500 m²",
      idealFor: "Grandes plantas de prefabricados, constructoras nacionales e inversionistas industriales",
      formats: ["8 Bloques H10 / ciclo", "6 Bloques H15 / ciclo", "4 Bloques H20 / ciclo", "Adoquines y prefabricados"],
      roiPoints: [
        "Secuencia automática controlada por PLC Kinco K623S y pantalla táctil HMI de 7 pulgadas.",
        "Estandarización total del tiempo de ciclo y densidad de compactación.",
        "La propuesta equipada ($190.000.000 COP) contempla mezcladora, banda, instalación, análisis de mercado y puesta en marcha.",
        "Menor costo unitario de mano de obra por bloque fabricado en producciones masivas."
      ]
    },
    includesList: [
      "Planta bloquera automática con tablero PLC Kinco K623S y pantalla HMI 7”",
      "Central hidráulica industrial de 7,5 HP (220 V trifásica · 60 Hz)",
      "Molde industrial de 8 H10 / 6 H15 / 4 H20 por ciclo",
      "Opción Línea Equipada ($190.000.000): mezcladora, banda, instalación y puesta en marcha"
    ],
    note: "La propuesta equipada contempla acompañamiento, instalación, análisis de mercado y puesta en marcha; alcance a confirmar por escrito.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 08: Bloquera hidráulica automática PLC ($130.000.000 COP base / $190.000.000 COP línea equipada)."
  },
  {
    id: "banda-transportadora-industrial",
    code: "09",
    line: "Equipos Complementarios",
    lineId: "complementarios",
    name: "Banda transportadora industrial",
    price: "$18.000.000 COP",
    priceShort: "$18.000.000",
    previousPrice: null,
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/09-banda-transportadora-industrial.png",
    orientation: "landscape",
    description: "Sistema de transporte de materiales para alimentar una línea de fabricación de bloques.",
    longDescription: "La Banda Transportadora Industrial (Ficha 09) automatiza el traslado de concreto semiseco desde la mezcladora hasta la tolva de la máquina bloquera. Con 6 metros de longitud de referencia, bastidor de ~600 mm de ancho, altura de descarga de 3 metros y motor de 5 HP, elimina los cuellos de botella en la carga manual y mantiene un ritmo constante de producción.",
    specs: [
      { label: "Longitud de referencia", value: "6 metros" },
      { label: "Ancho de bastidor", value: "Aproximadamente 600 mm" },
      { label: "Altura de descarga", value: "3 m de referencia" },
      { label: "Accionamiento", value: "Motor de diseño de 5 HP" },
      { label: "Elementos", value: "Bastidor, rodillos y tensores ajustables" }
    ],
    incomeHighlight: {
      headline: "Elimina la carga manual con pala y acelera hasta un 35% los ciclos de tu bloquera",
      dailyOutput: "Alimentación continua para líneas de 1.500 a 7.000 bloques/día",
      operators: "Reduce 1 a 2 operarios de paleo manual",
      area: "Longitud lineal de 6 m",
      idealFor: "Plantas con bloqueras fijas (Fichas 04, 06, 07 y 08) que buscan flujo continuo",
      formats: ["Transporte de concreto semiseco", "Agregados", "Arena y triturado"],
      roiPoints: [
        "Ahorro directo en nómina operativa al eliminar el paleo manual hacia la tolva.",
        "Alimentación constante que evita tiempos muertos de la máquina bloquera.",
        "Estructura industrial con rodillos y tensores ajustables de larga vida útil.",
        "Motorización de 5 HP diseñada para trabajo pesado en plantas de prefabricados."
      ]
    },
    includesList: [
      "Bastidor estructural de 6 m de longitud y ~600 mm de ancho",
      "Banda de caucho industrial, rodillos de carga/retorno y tensores ajustables",
      "Sistema de accionamiento con motor de 5 HP",
      "Tolva receptora inferior y descarga a 3 m de altura de referencia"
    ],
    note: "Dimensiones, inclinación, motorización y capacidad final según proyecto.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 09: Banda transportadora industrial ($18.000.000 COP)."
  },
  {
    id: "mezcladora-horizontal-dos-bultos",
    code: "10",
    line: "Equipos Complementarios",
    lineId: "complementarios",
    name: "Mezcladora horizontal de dos bultos",
    price: "Consultar precio / Por cotizar",
    priceShort: "Consultar precio / Por cotizar",
    previousPrice: null,
    equippedPrice: null,
    equippedDesc: null,
    image: "/images/maquinas/10-mezcladora-horizontal-dos-bultos.png",
    orientation: "landscape",
    description: "Mezcladora de eje horizontal para concreto semiseco y prefabricados.",
    longDescription: "La Mezcladora Horizontal de Dos Bultos (Ficha 10) está diseñada específicamente para concreto semiseco de bloquera (a diferencia de los trompos convencionales que no homogenizan mezclas secas). Su cuba de 1.200 mm × 800 mm ofrece un volumen útil de 0,45 a 0,55 m³ (capacidad para 2 bultos de cemento de 50 kg más agregados), accionada por un motor trifásico de 10 HP con reducción 60:1 (28–30 rpm) y descarga por compuerta inferior manual.",
    specs: [
      { label: "Capacidad nominal", value: "2 bultos de cemento de 50 kg más agregados y agua" },
      { label: "Volumen útil recomendado", value: "0,45–0,55 m³" },
      { label: "Motor recomendado", value: "10 HP trifásico" },
      { label: "Reducción", value: "60:1 · salida aproximada 28–30 rpm" },
      { label: "Descarga", value: "Compuerta inferior manual" },
      { label: "Cuba", value: "Longitud útil 1.200 mm · ancho interior 800 mm" }
    ],
    incomeHighlight: {
      headline: "Mezcla homogénea en minutos: optimiza el cemento y aumenta la resistencia de tus bloques",
      dailyOutput: "0,45 – 0,55 m³ por bachada (2 bultos de 50 kg + agregados)",
      operators: "1 operario de dosificación",
      area: "2,5 m × 1,5 m en zona de mezcla",
      idealFor: "Plantas bloqueras semindustriales e industriales que requieren mezcla semiseca uniforme",
      formats: ["Concreto semiseco para bloque", "Mezcla para adoquín", "Morteros industriales"],
      roiPoints: [
        "Ahorra cemento logrando la misma o mayor resistencia gracias al mezclado forzado por paletas.",
        "Evita grumos y bloques quebradizos causados por mezclado manual o en trompo.",
        "Descarga inferior directa hacia banda transportadora (Ficha 09) o carretilla.",
        "Capacidad industrial de 2 bultos por ciclo con motor trifásico de 10 HP."
      ]
    },
    includesList: [
      "Cuba horizontal de 1.200 mm de longitud útil y 800 mm de ancho interior",
      "Eje horizontal con paletas mezcladoras de alta resistencia al desgaste",
      "Sistema de transmisión con reducción 60:1 (28–30 rpm) para motor de 10 HP",
      "Compuerta inferior manual de descarga rápida y rejilla superior de seguridad"
    ],
    note: "Especificaciones de diseño sujetas a validación según configuración del proyecto.",
    whatsappMsg: "SW- Hola, quisiera cotizar la Ficha 10: Mezcladora horizontal de dos bultos."
  }
];

export const CATALOG_CONDITIONS =
  "Los valores corresponden a referencias comerciales en COP y pueden cambiar. Antes de contratar, confirmar IVA, transporte, instalación, plazo de entrega, garantía, moldes incluidos y condiciones de pago. Las capacidades de producción son referenciales y dependen del molde, mezcla, personal y jornada.";

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
