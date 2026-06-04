import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Search, ShoppingCart, User, Phone, Zap
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
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location]);

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
            <div className="navbar-logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#F7BC21"/>
                <path d="M8 24V8l8 10 8-10v16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="navbar-logo-text">
              <span className="navbar-logo-main">MAQTE</span>
              <span className="navbar-logo-sub">COLOMBIA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav hide-mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
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
