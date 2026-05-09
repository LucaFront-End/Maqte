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
  phone: "+57 300 000 0000",
  whatsapp: "573000000000",
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
    slug: "/tienda/maquinaria",
    label: "Maquinaria",
    icon: "settings",
    accent: "#F7BC21",
    image: "/images/categories/maquinaria.png",
    description: "Potencia industrial para tu proyecto",
    subcategories: [
      { label: "Máquinas Bloqueras", slug: "/tienda/maquinaria/bloqueras" },
      { label: "Generadores Eléctricos", slug: "/tienda/maquinaria/generadores" },
      { label: "Mezcladoras de Concreto", slug: "/tienda/maquinaria/mezcladoras" },
      { label: "Equipos de Corte y Soldadura", slug: "/tienda/maquinaria/soldadura" },
      { label: "Hidrolavadoras", slug: "/tienda/maquinaria/hidrolavadoras" },
      { label: "Compactación", slug: "/tienda/maquinaria/compactacion" },
    ],
  },
  {
    id: "construccion",
    slug: "/tienda/construccion",
    label: "Construcción",
    icon: "building",
    accent: "#3B82F6",
    image: "/images/categories/construccion.png",
    description: "Todo para tu obra de principio a fin",
    subcategories: [
      { label: "Pisos y Cerámicas", slug: "/tienda/construccion/pisos" },
      { label: "Obra Blanca y Acabados", slug: "/tienda/construccion/acabados" },
      { label: "Cemento", slug: "/tienda/construccion/cemento" },
      { label: "Bloques y Ladrillos", slug: "/tienda/construccion/bloques" },
      { label: "Cubiertas y Techos", slug: "/tienda/construccion/cubiertas" },
      { label: "Hierro y Mallas", slug: "/tienda/construccion/hierro" },
    ],
  },
  {
    id: "ferreteria",
    slug: "/tienda/ferreteria",
    label: "Ferretería",
    icon: "wrench",
    accent: "#10B981",
    image: "/images/categories/ferreteria.png",
    description: "Insumos esenciales para cada trabajo",
    subcategories: [
      { label: "Plomería", slug: "/tienda/ferreteria/plomeria" },
      { label: "Hogar", slug: "/tienda/ferreteria/hogar" },
      { label: "Tornillería", slug: "/tienda/ferreteria/tornilleria" },
      { label: "Pinturas", slug: "/tienda/ferreteria/pinturas" },
      { label: "PVC", slug: "/tienda/ferreteria/pvc" },
      { label: "Eléctricos", slug: "/tienda/ferreteria/electricos" },
    ],
  },
  {
    id: "herramientas",
    slug: "/tienda/herramientas",
    label: "Herramientas",
    icon: "hammer",
    accent: "#8B5CF6",
    image: "/images/categories/herramientas.png",
    description: "Precisión profesional en cada tarea",
    subcategories: [
      { label: "Taladros y Rotomartillos", slug: "/tienda/herramientas/taladros" },
      { label: "Pulidoras y Lijadoras", slug: "/tienda/herramientas/pulidoras" },
      { label: "Herramientas Eléctricas", slug: "/tienda/herramientas/electricas" },
      { label: "Herramientas Inalámbricas", slug: "/tienda/herramientas/inalambricas" },
      { label: "Soldadura y Corte", slug: "/tienda/herramientas/soldadura" },
      { label: "Equipos de Medición", slug: "/tienda/herramientas/medicion" },
      { label: "Herramientas Manuales", slug: "/tienda/herramientas/manuales" },
      { label: "Compresores y Aire", slug: "/tienda/herramientas/compresores" },
      { label: "Jardinería y Agro", slug: "/tienda/herramientas/jardineria" },
      { label: "Combos y Promociones", slug: "/tienda/herramientas/combos" },
    ],
  },
  {
    id: "repuestos",
    slug: "/tienda/repuestos",
    label: "Repuestos",
    icon: "cog",
    accent: "#EF4444",
    image: "/images/categories/generadores.png",
    description: "Mantén tu maquinaria al 100%",
    subcategories: [
      { label: "Repuestos para Maquinaria", slug: "/tienda/repuestos/maquinaria" },
      { label: "Repuestos Eléctricos", slug: "/tienda/repuestos/electricos" },
      { label: "Motores y Componentes", slug: "/tienda/repuestos/motores" },
      { label: "Bandas y Rodamientos", slug: "/tienda/repuestos/bandas" },
      { label: "Discos y Accesorios", slug: "/tienda/repuestos/discos" },
      { label: "Repuestos Hidráulicos", slug: "/tienda/repuestos/hidraulicos" },
      { label: "Repuestos para Hidrolavadoras", slug: "/tienda/repuestos/hidrolavadoras" },
      { label: "Repuestos para Generadores", slug: "/tienda/repuestos/generadores" },
    ],
  },
  {
    id: "agro",
    slug: "/tienda/agro",
    label: "Agro",
    icon: "leaf",
    accent: "#22C55E",
    image: "/images/categories/agro.png",
    description: "Equipamiento para el campo colombiano",
    subcategories: [
      { label: "Guadañas y Desbrozadoras", slug: "/tienda/agro/guadanas" },
      { label: "Motosierras", slug: "/tienda/agro/motosierras" },
      { label: "Fumigadoras", slug: "/tienda/agro/fumigadoras" },
      { label: "Riego y Mangueras", slug: "/tienda/agro/riego" },
      { label: "Herramientas Agrícolas", slug: "/tienda/agro/herramientas" },
      { label: "Bombas de Agua", slug: "/tienda/agro/bombas" },
      { label: "Insumos Agropecuarios", slug: "/tienda/agro/insumos" },
    ],
  },
  {
    id: "ofertas",
    slug: "/tienda/ofertas",
    label: "Ofertas",
    icon: "flame",
    accent: "#F59E0B",
    image: "/images/categories/soldadura.png",
    description: "Los mejores precios del mercado",
    subcategories: [
      { label: "Ofertas de Herramientas", slug: "/tienda/ofertas/herramientas" },
      { label: "Combos Profesionales", slug: "/tienda/ofertas/combos" },
      { label: "Liquidaciones", slug: "/tienda/ofertas/liquidaciones" },
      { label: "Últimas Unidades", slug: "/tienda/ofertas/ultimas-unidades" },
      { label: "Nuevos Ingresos", slug: "/tienda/ofertas/nuevos" },
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
  { label: "Marcas", path: "/marcas" },
  { label: "Nosotros", path: "/nosotros" },
  { label: "Contacto", path: "/contacto" },
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
