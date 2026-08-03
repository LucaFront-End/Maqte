import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, ShoppingCart, User, Phone, Zap, ChevronDown, ArrowRight
} from 'lucide-react';
import { NAV_LINKS, CATEGORIES, BRAND } from '../data/content';
import { CategoryIcon } from './IconMap';
import { useCart } from '../hooks/useCart';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const megaTimeoutRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setMegaMenuOpen(false);
    setSearchQuery('');
  }, [location]);

  const handleMegaEnter = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const submitSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="navbar-topbar">
        <div className="container navbar-topbar-inner">
          <span className="navbar-topbar-msg">
            <Zap size={12} /> Envíos a todo Colombia — <a href={`https://wa.me/${BRAND.whatsapp}?text=SW- Quisiera más información de sus productos.`} target="_blank" rel="noreferrer">Contáctanos por WhatsApp</a>
          </span>
          <a href={`tel:${BRAND.phone}`} className="navbar-topbar-phone">
            <Phone size={12} /> {BRAND.phone}
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src="/images/logo.png" alt="Maqte Colombia Logo" className="navbar-logo-img" />
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav hide-mobile">
            {NAV_LINKS.map((link) => {
              if (link.isMegaMenu) {
                return (
                  <div
                    key={link.path}
                    className="navbar-item"
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `navbar-link ${isActive || megaMenuOpen ? 'active' : ''}`
                      }
                      onClick={() => setMegaMenuOpen(false)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`navbar-chevron ${megaMenuOpen ? 'rotated' : ''}`}
                      />
                    </NavLink>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="navbar-action-btn"
              onClick={searchOpen ? submitSearch : openSearch}
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
            <Link to="/cuenta" className="navbar-action-btn hide-mobile" aria-label="Mi cuenta">
              <User size={18} />
            </Link>
            <Link to="/carrito" className="navbar-action-btn" aria-label="Carrito">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
            <button
              className="navbar-hamburger hide-desktop"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="navbar-search-bar">
            <div className="container navbar-search-inner">
              <Search size={16} className="navbar-search-icon" />
              <input
                ref={searchInputRef}
                className="navbar-search-input"
                type="text"
                placeholder="Buscar productos, marcas, categorías... (Enter para buscar)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
              />
              {searchQuery && (
                <button className="navbar-search-clear" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
              <button
                className="navbar-search-btn"
                onClick={submitSearch}
                disabled={!searchQuery.trim()}
              >
                Buscar
              </button>
            </div>
          </div>
        )}

        {/* Expanded Mega Menu Panel */}
        {megaMenuOpen && (
          <div
            className="mega-menu-overlay"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
          >
            <div className="container mega-menu-inner">
              <div className="mega-menu-header">
                <h3 className="mega-menu-title">
                  Explorar por <span style={{ color: '#F7BC21' }}>categoría</span>
                </h3>
              </div>

              <div className="mega-menu-grid">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="mega-cat-card">
                    <div className="mega-cat-header">
                      <div className="mega-cat-icon-box">
                        <CategoryIcon name={cat.icon} size={20} />
                      </div>
                      <div>
                        <h4 className="mega-cat-name">{cat.label}</h4>
                        <p className="mega-cat-desc">{cat.description}</p>
                      </div>
                    </div>

                    <ul className="mega-cat-subs">
                      {cat.subcategories.slice(0, 4).map((sub, sIdx) => (
                        <li key={sIdx}>
                          <Link
                            to={sub.slug}
                            className="mega-sub-link"
                            onClick={() => setMegaMenuOpen(false)}
                          >
                            <span className="mega-sub-arrow">→</span> {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={cat.slug}
                      className="mega-cat-btn"
                      onClick={() => setMegaMenuOpen(false)}
                    >
                      VER TODO <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {open && (
          <div className="navbar-mobile-menu">
            <div className="container">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} className="navbar-mobile-link">
                  {link.label}
                </NavLink>
              ))}
              <div className="navbar-mobile-divider" />
              <NavLink to="/cuenta" className="navbar-mobile-link">Mi Cuenta</NavLink>
              <NavLink to="/carrito" className="navbar-mobile-link">
                Carrito {cartCount > 0 && `(${cartCount})`}
              </NavLink>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=SW- Quisiera más información de sus productos.`}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
