import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ChevronLeft, ChevronRight, Shield, Truck,
  Headphones, TrendingUp, Zap, Search, Star, Package,
  ShoppingCart, Wrench, Trees, HardHat, Building2, Wheat,
  Home as HomeIcon, Scissors, CircleDot, Droplets, Flame,
  Wallet, Gem, Trophy, RotateCcw, Target, Sparkles, Percent,
  BadgeCheck
} from 'lucide-react';
import { CategoryIcon } from '../components/IconMap';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  CATEGORIES, BRANDS, STATS, HERO_SLIDES, BRAND
} from '../data/content';
import './Home.css';
import './HeroHud.css';
import './CoverFlow.css';
import './Odometer.css';
import './WhySticky.css';
import './BrandsMatrix.css';
import './ShopSections.css';

/* ─── HUD HERO — Industrial Control Interface ─────────── */

/* Live telemetry data feed */
function useTelemetry() {
  const [data, setData] = useState({
    lat: '1.6144',
    lng: '-75.6062',
    pwr: 98,
    rpm: 3400,
    temp: 72,
    psi: 145,
    time: '00:00:00',
    status: 'SISTEMA OPERATIVO',
  });

  useEffect(() => {
    const iv = setInterval(() => {
      setData(d => ({
        lat: (1.6144 + (Math.random() - 0.5) * 0.001).toFixed(4),
        lng: (-75.6062 + (Math.random() - 0.5) * 0.001).toFixed(4),
        pwr: Math.min(100, Math.max(90, d.pwr + (Math.random() > 0.5 ? 1 : -1))),
        rpm: Math.floor(3350 + Math.random() * 100),
        temp: Math.floor(70 + Math.random() * 8),
        psi: Math.floor(140 + Math.random() * 15),
        time: new Date().toLocaleTimeString('es-CO', { hour12: false }),
        status: d.status,
      }));
    }, 800);
    return () => clearInterval(iv);
  }, []);
  return data;
}

/* Typing effect for status line */
function useTypewriter(texts, speed = 50, pause = 3000) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const text = texts[idx];
    let charIdx = 0;
    let typingTimeout;

    const type = () => {
      if (charIdx <= text.length) {
        setDisplay(text.substring(0, charIdx));
        charIdx++;
        typingTimeout = setTimeout(type, speed);
      } else {
        typingTimeout = setTimeout(() => {
          setIdx(i => (i + 1) % texts.length);
        }, pause);
      }
    };
    type();
    return () => clearTimeout(typingTimeout);
  }, [idx, texts, speed, pause]);

  return display;
}

/* Mouse-tracking crosshair */
function useCrosshair(containerRef) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMove = (e) => {
      const rect = container.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    container.addEventListener('mousemove', handleMove);
    return () => container.removeEventListener('mousemove', handleMove);
  }, [containerRef]);

  return pos;
}

function Hero() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [shockwave, setShockwave] = useState(false);
  const heroRef = useRef(null);
  const intervalRef = useRef(null);

  const slide = HERO_SLIDES[current];
  const tel = useTelemetry();
  const cursor = useCrosshair(heroRef);

  const statusTexts = [
    '> SISTEMA MAQTE COLOMBIA — OPERATIVO',
    '> INVENTARIO: 500+ PRODUCTOS EN STOCK',
    '> DISTRIBUCIÓN NACIONAL ACTIVA',
    '> MARCAS CERTIFICADAS: BOSCH · MAKITA · HONDA',
    '> ÚLTIMA ACTUALIZACIÓN: HOY',
  ];
  const typedText = useTypewriter(statusTexts, 35, 2500);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 500);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goTo((current + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const handleCtaHover = () => {
    setShockwave(true);
    setTimeout(() => setShockwave(false), 700);
  };

  const activeCat = CATEGORIES.find(c => c.label === slide.category);

  return (
    <section className="hud-hero" ref={heroRef} style={{ '--accent': slide.accent }}>
      {/* ── Background Layers ── */}
      <div className="hud-bg">
        <div className="hud-grid" />
        <div className="hud-orb hud-orb-1" style={{ background: slide.accent }} />
        <div className="hud-orb hud-orb-2" />
        <div className="hud-scanline" />
        <div className="hud-noise" />
        {shockwave && <div className="hud-shockwave" />}
      </div>

      {/* ── Crosshair Cursor ── */}
      <div
        className="hud-crosshair"
        style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
      >
        <div className="hud-ch-h" />
        <div className="hud-ch-v" />
        <div className="hud-ch-dot" />
      </div>

      {/* ── HUD Frame Corners ── */}
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-tr" />
      <div className="hud-corner hud-corner-bl" />
      <div className="hud-corner hud-corner-br" />

      {/* ── Top Telemetry Bar ── */}
      <div className="hud-telemetry-top">
        <div className="hud-tel-group">
          <span className="hud-tel-label">LAT</span>
          <span className="hud-tel-value">{tel.lat}°N</span>
        </div>
        <div className="hud-tel-group">
          <span className="hud-tel-label">LNG</span>
          <span className="hud-tel-value">{tel.lng}°W</span>
        </div>
        <div className="hud-tel-sep" />
        <div className="hud-tel-group">
          <span className="hud-tel-label">TIEMPO</span>
          <span className="hud-tel-value">{tel.time}</span>
        </div>
        <div className="hud-tel-sep" />
        <div className="hud-tel-group">
          <span className="hud-tel-label">ESTADO</span>
          <span className="hud-tel-value hud-tel-online">
            <span className="hud-online-dot" /> OPERATIVO
          </span>
        </div>
      </div>

      {/* ── Left Telemetry Panel ── */}
      <div className="hud-panel-left hide-mobile">
        <div className="hud-panel-block">
          <span className="hud-panel-label">PWR</span>
          <div className="hud-bar-track">
            <div className="hud-bar-fill" style={{ width: `${tel.pwr}%` }} />
          </div>
          <span className="hud-panel-num">{tel.pwr}%</span>
        </div>
        <div className="hud-panel-block">
          <span className="hud-panel-label">RPM</span>
          <span className="hud-panel-big">{tel.rpm}</span>
        </div>
        <div className="hud-panel-block">
          <span className="hud-panel-label">TEMP</span>
          <span className="hud-panel-big">{tel.temp}°C</span>
        </div>
        <div className="hud-panel-block">
          <span className="hud-panel-label">PSI</span>
          <span className="hud-panel-big">{tel.psi}</span>
        </div>
        {/* Mini radar */}
        <div className="hud-radar">
          <div className="hud-radar-circle" />
          <div className="hud-radar-circle r2" />
          <div className="hud-radar-sweep" />
          <div className="hud-radar-dot" />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container hud-content">
        <div className={`hud-main ${animating ? 'hud-exit' : 'hud-enter'}`}>
          {/* System badge */}
          <div className="hud-sys-badge">
            <span className="hud-sys-blink" />
            <span>SYS:{String(current + 1).padStart(2, '0')} // {slide.category.toUpperCase()}</span>
          </div>

          {/* Giant Headline */}
          <h1 className="hud-headline">
            <span className="hud-headline-accent">{slide.headline}</span>
            <span className="hud-headline-sub">{slide.subheadline}</span>
          </h1>

          {/* Description */}
          <p className="hud-desc">{slide.description}</p>

          {/* CTA Row */}
          <div className="hud-cta-row">
            <Link
              to={slide.ctaLink}
              className="hud-cta-primary"
              onMouseEnter={handleCtaHover}
            >
              <span className="hud-cta-text">{slide.cta}</span>
              <ArrowRight size={18} />
              <span className="hud-cta-glow" />
            </Link>
            <Link to="/nosotros" className="hud-cta-ghost">
              [ CONÓCENOS ]
            </Link>
          </div>

          {/* Category Selector — "System Modules" */}
          <div className="hud-modules">
            <span className="hud-modules-label">MÓDULOS ACTIVOS</span>
            <div className="hud-modules-row">
              {CATEGORIES.slice(0, 5).map((cat, i) => (
                <button
                  key={cat.id}
                  className={`hud-module-chip ${cat.label === slide.category ? 'active' : ''}`}
                  onClick={() => {
                    const slideIdx = HERO_SLIDES.findIndex(s => s.category === cat.label);
                    if (slideIdx >= 0) goTo(slideIdx);
                  }}
                  style={{ '--chip-color': cat.accent }}
                >
                  <span className="hud-chip-icon"><CategoryIcon name={cat.icon} size={14} /></span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side — System Info Card */}
        <div className={`hud-info-panel hide-mobile ${animating ? 'hud-exit' : 'hud-enter'}`}>
          <div className="hud-info-header">
            <span className="hud-info-tag">{activeCat?.icon} {slide.category}</span>
            <span className="hud-info-status">● EN LÍNEA</span>
          </div>
          <ul className="hud-info-list">
            {(activeCat?.subcategories || []).slice(0, 6).map((sub, i) => (
              <li key={i} className="hud-info-item">
                <span className="hud-info-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="hud-info-name">{sub.label}</span>
                <span className="hud-info-check">✓</span>
              </li>
            ))}
          </ul>
          <div className="hud-info-footer">
            <div className="hud-info-meter">
              <span className="hud-info-meter-label">STOCK</span>
              <div className="hud-bar-track mini">
                <div className="hud-bar-fill" style={{ width: '87%' }} />
              </div>
              <span className="hud-info-meter-val">87%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Status Bar ── */}
      <div className="hud-status-bar">
        <div className="hud-status-left">
          <span className="hud-status-cursor">▌</span>
          <span className="hud-typed-text">{typedText}</span>
        </div>
        <div className="hud-status-right">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`hud-nav-btn ${i === current ? 'active' : ''}`}
              aria-label={`Slide ${i + 1}`}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hud-scroll-hint">
        <div className="hud-scroll-line" />
        <span>SCROLL</span>
      </div>
    </section>
  );
}

/* ─── MARQUEE BRANDS ───────────────────────────────────── */
function BrandsMarquee() {
  const marqueeItems = [...BRANDS, ...BRANDS];
  return (
    <div className="brands-marquee-section">
      <div className="glow-line" />
      <div className="marquee-track brands-track">
        <div className="marquee-inner brands-inner">
          {marqueeItems.map((brand, i) => (
            <span key={i} className="brand-chip">
              <span className="brand-chip-dot" />
              {brand.name}
            </span>
          ))}
        </div>
      </div>
      <div className="glow-line" />
    </div>
  );
}

/* ─── COVER FLOW CATEGORIES ────────────────────────────── */
function CategoriesSection() {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const dragOffset = useRef(0);
  const CARD_W = 340;
  const CARD_GAP = 30;
  const CARD_STEP = CARD_W + CARD_GAP;

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(CATEGORIES.length - 1, idx));
    setActive(clamped);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    dragOffset.current = 0;
  };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    dragOffset.current = e.clientX - dragStart.current;
  };
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragOffset.current) > 60) {
      goTo(active + (dragOffset.current < 0 ? 1 : -1));
    }
    dragOffset.current = 0;
  };

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goTo(active + 1);
      if (e.key === 'ArrowLeft') goTo(active - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active]);

  const activeCat = CATEGORIES[active];

  return (
    <section className="coverflow-section">
      {/* ── Cinematic Background Image ── */}
      <div
        className="coverflow-bg-image"
        style={{ backgroundImage: `url(${activeCat?.image || ''})` }}
      />
      <div className="coverflow-bg-overlay" />
      <div className="coverflow-bg-grid" />

      {/* Dynamic glow */}
      <div
        className="coverflow-glow"
        style={{ background: activeCat?.accent || 'var(--clr-orange)' }}
      />

      {/* Decorative HUD lines */}
      <div className="coverflow-deco-line top" />
      <div className="coverflow-deco-line bottom" />
      <div className="coverflow-deco-line left-vert" />
      <div className="coverflow-deco-line right-vert" />

      {/* Floating active label */}
      <div className="coverflow-active-label">
        SYS.MODULE // {activeCat?.id?.toUpperCase()}
      </div>

      {/* Header */}
      <div className="container coverflow-header">
        <span className="label-upper">Lo que ofrecemos</span>
        <h2 className="heading-xl">
          Todas las líneas<br />
          <span className="text-orange">en un solo lugar</span>
        </h2>
        <p style={{ color: 'var(--clr-text-2)', maxWidth: '500px', margin: '0 auto' }}>
          Desde maquinaria pesada hasta insumos agrícolas. Somos tu aliado industrial completo.
        </p>
      </div>

      {/* Carousel */}
      <div
        className="coverflow-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="coverflow-track">
          {CATEGORIES.map((cat, i) => {
            const offset = i - active;
            const absOffset = Math.abs(offset);
            const x = offset * CARD_STEP;
            const rotateY = offset * -35;
            const z = -absOffset * 120;
            const scale = absOffset === 0 ? 1 : Math.max(0.65, 1 - absOffset * 0.15);
            const opacity = absOffset > 3 ? 0 : Math.max(0.3, 1 - absOffset * 0.25);

            return (
              <div
                key={cat.id}
                className={`coverflow-card ${i === active ? 'active' : ''}`}
                style={{
                  '--card-accent': cat.accent,
                  transform: `translateX(${x}px) translateX(-50%) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 100 - absOffset,
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                }}
                onClick={() => i !== active && goTo(i)}
              >
                <div className="coverflow-card-inner">
                  <div className="coverflow-card-glow" />
                  <div className="cf-card-top">
                    <div className="cf-card-icon-wrap"><CategoryIcon name={cat.icon} size={20} /></div>
                    <span className="cf-card-number">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="cf-card-body">
                    <h3 className="cf-card-title">{cat.label}</h3>
                    <p className="cf-card-desc">{cat.description}</p>
                    <div className="cf-card-subs">
                      {cat.subcategories.slice(0, 5).map((sub, j) => (
                        <span key={j} className="cf-sub-chip">{sub.label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="cf-card-footer">
                    <span className="cf-card-count">
                      {cat.subcategories.length} ITEMS
                    </span>
                    <Link
                      to={cat.slug}
                      className="cf-card-explore"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Explorar <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="coverflow-controls">
        <button className="cf-nav-btn" onClick={() => goTo(active - 1)} aria-label="Anterior">
          <ChevronLeft size={20} />
        </button>
        <span className="cf-counter">
          <span className="cf-counter-active">{String(active + 1).padStart(2, '0')}</span>
          {' / '}
          {String(CATEGORIES.length).padStart(2, '0')}
        </span>
        <div className="cf-dots">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              className={`cf-dot ${i === active ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Categoría ${i + 1}`}
            />
          ))}
        </div>
        <span className="cf-counter" style={{ opacity: 0.5 }}>
          {activeCat?.label}
        </span>
        <button className="cf-nav-btn" onClick={() => goTo(active + 1)} aria-label="Siguiente">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="cf-drag-hint">[ ARRASTRA O USA ← → ]
      </div>
    </section>
  );
}

/* ─── ODOMETER STATS ──────────────────────────────────── */
const DIGITS = ['0','1','2','3','4','5','6','7','8','9'];

function OdometerReel({ digit, delay, triggered }) {
  const targetIdx = DIGITS.indexOf(digit);
  const totalSlots = DIGITS.length;
  const spinOffset = triggered
    ? -((totalSlots * 2 + targetIdx) * 100 / (totalSlots * 3)) + '%'
    : '0%';

  return (
    <div className="odo-reel-mask">
      <div
        className={`odo-reel-strip ${triggered ? '' : 'waiting'}`}
        style={{
          transform: `translateY(${spinOffset})`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {[...DIGITS, ...DIGITS, ...DIGITS].map((d, i) => (
          <div
            key={i}
            className={`odo-reel-digit ${triggered && i === totalSlots * 2 + targetIdx ? 'target' : ''}`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function OdometerStat({ value, label, index }) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  const chars = value.split('');
  let digitCount = 0;
  const SYS_LABELS = ['SYS.CATALOG', 'SYS.UPTIME', 'SYS.CLIENTS', 'SYS.MODULES'];

  return (
    <div className={`odo-stat ${triggered ? 'triggered' : ''}`} ref={ref}>
      <span className="odo-sys-label">{SYS_LABELS[index] || `SYS.${index}`}</span>
      <div className="odo-display">
        {chars.map((char, i) => {
          if (DIGITS.includes(char)) {
            const delay = digitCount * 120 + index * 200;
            digitCount++;
            return (
              <OdometerReel
                key={i}
                digit={char}
                delay={delay}
                triggered={triggered}
              />
            );
          }
          return (
            <span key={i} className="odo-char odo-char-static">
              {char}
            </span>
          );
        })}
      </div>
      <span className="odo-label">{label}</span>
      <div className="odo-accent-bar" />
    </div>
  );
}

function StatsSection() {
  return (
    <section className="odo-section">
      <div className="odo-bg">
        <div className="odo-bg-line top" />
        <div className="odo-bg-line bottom" />
      </div>
      <div className="container">
        <div className="odo-grid">
          {STATS.map((stat, i) => (
            <OdometerStat
              key={i}
              value={stat.value}
              label={stat.label}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── STICKY WHY US ───────────────────────────────────── */
const WHY_ITEMS = [
  {
    icon: <Shield size={20} />,
    title: 'Productos Originales',
    desc: 'Distribuidores oficiales con garantía de fábrica y autenticidad certificada en cada producto.',
  },
  {
    icon: <Truck size={20} />,
    title: 'Envíos a Todo Colombia',
    desc: 'Despachamos a todos los municipios del país con seguimiento en tiempo real y empaque reforzado.',
  },
  {
    icon: <Headphones size={20} />,
    title: 'Asesoría Especializada',
    desc: 'Técnicos expertos disponibles para orientarte en la elección del equipo ideal para tu proyecto.',
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Mejores Precios',
    desc: 'Precios de distribuidor directo. Cotiza con nosotros y te garantizamos competitividad real.',
  },
];

function WhyReasonItem({ item, index, total }) {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '-35% 0px -35% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`why-reason ${isActive ? 'active' : ''}`}>
      <div className="why-reason-num">
        <span className="why-reason-numtext">{String(index + 1).padStart(2, '0')}</span>
        <span className="why-reason-icon">{item.icon}</span>
      </div>
      <div className="why-reason-content">
        <h3 className="why-reason-title">{item.title}</h3>
        <p className="why-reason-desc">{item.desc}</p>
        <div className="why-reason-accent" />
      </div>
    </div>
  );
}

function WhyUsSection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeIdx = Math.min(WHY_ITEMS.length - 1, Math.floor(scrollProgress * WHY_ITEMS.length));

  return (
    <section className="why-sticky-section" ref={sectionRef}>
      <div className="why-sticky-grid" />
      <div className="why-sticky-line top" />
      <div className="why-sticky-line bottom" />

      <div className="why-sticky-inner">
        {/* Left — Sticky */}
        <div className="why-sticky-left">
          <span className="why-sticky-label">¿Por qué elegirnos?</span>
          <h2 className="why-sticky-heading">
            Tu obra merece<br />
            <span className="accent">lo mejor</span>
          </h2>
          <p className="why-sticky-desc">
            En Maqte Colombia llevamos más de una década siendo el aliado de maestros de obra,
            constructores, agricultores y profesionales del campo colombiano. No vendemos solo
            herramientas, vendemos resultados.
          </p>
          <div className="why-sticky-ctas">
            <Link to="/nosotros" className="why-cta-dark">
              Conocer nuestra historia <ArrowRight size={16} />
            </Link>
            <Link to="/contacto" className="why-cta-light">
              Solicitar cotización
            </Link>
          </div>
          <div className="why-progress">
            <div className="why-progress-bar">
              <div
                className="why-progress-fill"
                style={{ width: `${((activeIdx + 1) / WHY_ITEMS.length) * 100}%` }}
              />
            </div>
            <span className="why-progress-text">
              {String(activeIdx + 1).padStart(2, '0')} / {String(WHY_ITEMS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right — Scrolling */}
        <div className="why-sticky-right">
          {WHY_ITEMS.map((item, i) => (
            <WhyReasonItem
              key={i}
              item={item}
              index={i}
              total={WHY_ITEMS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BRANDS MATRIX — Institutional Plaques ──────────── */
function BrandCell({ brand, index }) {
  const cellRef = useRef(null);
  const [isLit, setIsLit] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [logoFailed, setLogoFailed] = useState(false);

  const handleMouseMove = (e) => {
    const el = cellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const tiltX = ((y - cy) / cy) * -4;
    const tiltY = ((x - cx) / cx) * 4;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsLit(true);
  const handleMouseLeave = () => {
    setIsLit(false);
    setTilt({ x: 0, y: 0 });
  };

  const monogram = brand.name.charAt(0);

  return (
    <div
      ref={cellRef}
      className={`brand-cell ${isLit ? 'lit' : ''}`}
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="brand-cell-screw tl" />
      <span className="brand-cell-screw tr" />
      <span className="brand-cell-screw bl" />
      <span className="brand-cell-screw br" />

      {/* Logo or Monogram fallback */}
      {brand.logo && !logoFailed ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className="brand-cell-logo"
          onError={() => setLogoFailed(true)}
          loading="lazy"
        />
      ) : (
        <div className="brand-cell-monogram">{monogram}</div>
      )}

      <div className="brand-cell-name">{brand.name}</div>
      <div className="brand-cell-divider" />

      <div className="brand-cell-footer">
        <span className="brand-cell-cat">{brand.category}</span>
        {brand.est && <span className="brand-cell-est">EST. {brand.est}</span>}
      </div>

      <span className="brand-cell-badge">Distribuidor Autorizado</span>
    </div>
  );
}

function BrandsShowcase() {
  return (
    <section className="brands-matrix-section">
      <div className="brands-matrix-dots" />
      <div className="container">
        <div className="brands-matrix-header">
          <span className="brands-matrix-label">Distribuidores Oficiales</span>
          <h2 className="brands-matrix-title">
            Las marcas que <span className="accent">confían en nosotros</span>
          </h2>
        </div>

        <div className="brands-matrix-grid">
          {BRANDS.map((brand, i) => (
            <BrandCell key={i} brand={brand} index={i} />
          ))}
        </div>

        <div className="brands-matrix-cta">
          <Link to="/marcas" className="brands-matrix-btn">
            Ver todas las marcas <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── TOOL FINDER — Step-by-Step Wizard ───────────────── */
const FINDER_STEPS = [
  {
    id: 'industry',
    title: 'Industria',
    question: '¿En qué sector trabajas?',
    hint: 'Esto nos ayuda a filtrar las herramientas ideales para tu entorno.',
    options: [
      { label: 'Construcción', icon: 'building', value: 'construccion' },
      { label: 'Agricultura', icon: 'wheat', value: 'agro' },
      { label: 'Taller / Herrería', icon: 'wrench', value: 'taller' },
      { label: 'Hogar', icon: 'home', value: 'hogar' },
    ],
  },
  {
    id: 'work',
    title: 'Trabajo',
    question: '¿Qué tipo de trabajo necesitas hacer?',
    hint: 'Selecciona la actividad principal que realizarás.',
    options: [
      { label: 'Corte', icon: 'scissors', value: 'corte' },
      { label: 'Perforación', icon: 'circle-dot', value: 'perforacion' },
      { label: 'Generación Eléctrica', icon: 'zap', value: 'generacion' },
      { label: 'Limpieza Industrial', icon: 'droplets', value: 'limpieza' },
      { label: 'Soldadura', icon: 'flame', value: 'soldadura' },
    ],
  },
  {
    id: 'budget',
    title: 'Presupuesto',
    question: '¿Cuál es tu rango de inversión?',
    hint: 'Encontraremos opciones dentro de tu presupuesto.',
    options: [
      { label: 'Hasta $500.000', icon: 'wallet', value: 'bajo' },
      { label: '$500.000 – $2.000.000', icon: 'gem', value: 'medio' },
      { label: 'Más de $2.000.000', icon: 'trophy', value: 'alto' },
    ],
  },
];

const FINDER_ICON_MAP = {
  building: Building2, wheat: Wheat, wrench: Wrench, home: HomeIcon,
  scissors: Scissors, 'circle-dot': CircleDot, zap: Zap, droplets: Droplets,
  flame: Flame, wallet: Wallet, gem: Gem, trophy: Trophy,
};

const FINDER_PRODUCTS = {
  default: [
    { name: 'Taladro Percutor GSB 13 RE', brand: 'Bosch', price: '$289.900', img: '/images/products/bosch-gsb13re.png' },
    { name: 'Rotomartillo SDS Plus D25133K', brand: 'DeWalt', price: '$689.000', img: '/images/products/dewalt-d25133k.jpg' },
    { name: 'Amoladora GA4530 4½"', brand: 'Makita', price: '$199.900', img: '/images/products/makita-ga4530.png' },
  ],
};

function ToolFinder() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const totalSteps = FINDER_STEPS.length;

  const handleSelect = (stepId, value) => {
    setSelections(prev => ({ ...prev, [stepId]: value }));
  };

  const goNext = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const restart = () => {
    setStep(0);
    setSelections({});
    setShowResults(false);
  };

  const currentStep = FINDER_STEPS[step];
  const currentSelection = currentStep ? selections[currentStep.id] : null;
  const key = `${selections.industry}-${selections.work}-${selections.budget}`;
  const results = FINDER_PRODUCTS[key] || FINDER_PRODUCTS.default;

  return (
    <section className="finder-section">
      <div className="finder-grid-bg" />
      <div className="container">
        <div className="finder-header">
          <span className="finder-label">Configurador</span>
          <h2 className="finder-title">
            ¿Qué vas a <span className="accent">construir hoy</span>?
          </h2>
          <p className="finder-subtitle">
            Responde 3 preguntas rápidas y te recomendamos el equipo ideal.
          </p>
        </div>

        <div className="finder-wizard">
          {/* Progress */}
          <div className="finder-progress">
            {FINDER_STEPS.map((s, i) => (
              <Fragment key={s.id}>
                <div className={`finder-progress-step ${
                  showResults || i < step ? 'done' : i === step && !showResults ? 'active' : ''
                }`}>
                  <div className="finder-progress-dot">
                    {showResults || i < step ? '✓' : i + 1}
                  </div>
                  <span>{s.title}</span>
                </div>
                {i < totalSteps - 1 && (
                  <div className="finder-progress-line">
                    <div className="fill" style={{ width: i < step || showResults ? '100%' : '0%' }} />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Step Content or Results */}
          {showResults ? (
            <div className="finder-results-panel" key="results">
              <div className="finder-results-title"><Target size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px', color: 'var(--clr-orange)' }} /> Equipos recomendados para ti</div>
              <div className="finder-results-desc">
                Basado en: {FINDER_STEPS.map(s => {
                  const opt = s.options.find(o => o.value === selections[s.id]);
                  return opt ? opt.label : '';
                }).join(' → ')}
              </div>
              <div className="finder-results-grid">
                {results.map((p, i) => (
                  <Link to="/tienda" key={i} className="finder-result-card">
                    <div className="finder-result-img">
                      {p.img ? <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={20} />}
                    </div>
                    <div className="finder-result-info">
                      <div className="finder-result-name">{p.name}</div>
                      <div className="finder-result-brand">{p.brand}</div>
                    </div>
                    <div className="finder-result-price">{p.price}</div>
                    <ArrowRight size={14} className="finder-result-arrow" />
                  </Link>
                ))}
              </div>
              <button className="finder-restart" onClick={restart}>
                <RotateCcw size={13} /> Empezar de nuevo
              </button>
            </div>
          ) : (
            <div className="finder-step-content" key={`step-${step}`}>
              <div className="finder-step-question">{currentStep.question}</div>
              <div className="finder-step-hint">{currentStep.hint}</div>
              <div className="finder-options-grid">
                {currentStep.options.map(opt => (
                  <button
                    key={opt.value}
                    className={`finder-option-card ${currentSelection === opt.value ? 'selected' : ''}`}
                    onClick={() => handleSelect(currentStep.id, opt.value)}
                  >
                    <div className="finder-option-emoji">{(() => { const Icon = FINDER_ICON_MAP[opt.icon]; return Icon ? <Icon size={20} /> : null; })()}</div>
                    <div className="finder-option-text">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {!showResults && (
            <div className="finder-nav">
              <button
                className="finder-nav-btn back"
                onClick={goBack}
                style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
              >
                ← Atrás
              </button>
              <span className="finder-nav-step-label">
                PASO {step + 1} / {totalSteps}
              </span>
              <button
                className="finder-nav-btn next"
                onClick={goNext}
                disabled={!currentSelection}
              >
                {step < totalSteps - 1 ? 'Siguiente →' : 'Ver resultados →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURED PRODUCTS — E-commerce Grid ─────────────── */
const FEATURED_PRODUCTS = [
  { name: 'Taladro Percutor GSB 13 RE', brand: 'Bosch', price: '$289.900', badge: 'hot', rating: 4.8, reviews: 124, img: '/images/products/bosch-gsb13re.png' },
  { name: 'Rotomartillo SDS Plus D25133K', brand: 'DeWalt', price: '$689.000', badge: 'new', rating: 4.9, reviews: 87, img: '/images/products/dewalt-d25133k.jpg' },
  { name: 'Amoladora GA4530 4½"', brand: 'Makita', price: '$199.900', badge: null, rating: 4.7, reviews: 203, img: '/images/products/makita-ga4530.png' },
  { name: 'Guadaña a Gasolina 143R-II', brand: 'Husqvarna', price: '$1.290.000', badge: 'hot', rating: 4.9, reviews: 56, img: '/images/products/husqvarna-143r.webp' },
  { name: 'Motosierra MS 250', brand: 'Stihl', price: '$1.850.000', badge: null, rating: 5.0, reviews: 178, img: '/images/products/stihl-ms250.png' },
  { name: 'Generador Eléctrico EP2500', brand: 'Honda', price: '$3.200.000', badge: 'new', rating: 4.8, reviews: 42, img: '/images/products/honda-ep2500.png' },
  { name: 'Hidrolavadora K3 Premium', brand: 'Karcher', price: '$650.000', badge: 'sale', rating: 4.6, reviews: 315, img: '/images/products/karcher-k3.jpg' },
  { name: 'Soldador Inversor MMA 200A', brand: 'Ingco', price: '$385.000', badge: null, rating: 4.5, reviews: 92, img: '/images/products/ingco-mma200.png' },
];

const FEATURED_TABS = ['Todos', 'Herramientas', 'Maquinaria', 'Agro'];

function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('Todos');

  const filtered = activeTab === 'Todos'
    ? FEATURED_PRODUCTS
    : FEATURED_PRODUCTS.filter(p => {
        const brandData = BRANDS.find(b => b.name === p.brand);
        return brandData && brandData.category === activeTab;
      });

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-header">
          <div className="featured-header-left">
            <span className="featured-label">Catálogo</span>
            <h2 className="featured-title">
              Productos <span className="accent">destacados</span>
            </h2>
          </div>
          <div className="featured-tabs">
            {FEATURED_TABS.map(tab => (
              <button
                key={tab}
                className={`featured-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="featured-grid">
          {filtered.map((product, i) => (
            <div key={i} className="featured-card">
              {product.badge && (
                <span className={`featured-card-badge ${product.badge}`}>
                  {product.badge === 'hot' ? <><Flame size={10} /> Popular</> : product.badge === 'new' ? <><Sparkles size={10} /> Nuevo</> : <><Percent size={10} /> Oferta</>}
                </span>
              )}
              <div className="featured-card-img">
                <img src={product.img} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} loading="lazy" />
                <div className="featured-card-action">
                  <Link to="/tienda" className="featured-card-action-btn primary">
                    <ShoppingCart size={12} /> Cotizar
                  </Link>
                  <Link to="/tienda" className="featured-card-action-btn secondary">
                    Ver más
                  </Link>
                </div>
              </div>
              <div className="featured-card-info">
                <div className="featured-card-brand">{product.brand}</div>
                <div className="featured-card-name">{product.name}</div>
                <div className="featured-card-bottom">
                  <div className="featured-card-price">{product.price}</div>
                  <div className="featured-card-rating">
                    <Star size={11} fill="#F59E0B" stroke="none" />
                    {product.rating}
                    <span>({product.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="featured-cta">
          <Link to="/tienda" className="featured-btn">
            Ver todo el catálogo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── CLOSING CTA ──────────────────────────────────────── */
function CtaBand() {
  return (
    <section className="closing-cta">
      <div className="closing-cta-grid-bg" />
      <div className="container closing-cta-inner">
        <span className="closing-cta-label">
          <Zap size={12} /> ¿Listo para empezar?
        </span>
        <h2 className="closing-cta-title">
          Llevamos la herramienta hasta tu <span className="accent">puerta</span>
        </h2>
        <p className="closing-cta-desc">
          Envíos a todo Colombia. Precios de distribuidor. Asesoría personalizada para tu proyecto.
        </p>
        <div className="closing-cta-actions">
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=Hola, me interesa una cotización`}
            target="_blank"
            rel="noreferrer"
            className="closing-cta-btn primary"
          >
            <ShoppingCart size={16} /> Cotizar por WhatsApp
          </a>
          <Link to="/tienda" className="closing-cta-btn secondary">
            Explorar catálogo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── HOME PAGE ────────────────────────────────────────── */
export default function Home() {
  return (
    <main>
      <Hero />
      <BrandsMarquee />
      <CategoriesSection />
      <StatsSection />
      <ToolFinder />
      <FeaturedProducts />
      <WhyUsSection />
      <BrandsShowcase />
      <CtaBand />
    </main>
  );
}
