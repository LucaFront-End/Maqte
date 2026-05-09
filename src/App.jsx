import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Nosotros from './pages/Nosotros';
import Marcas from './pages/Marcas';
import Categorias from './pages/Categorias';
import Contacto from './pages/Contacto';
import Producto from './pages/Producto';

// Floating WhatsApp Button
import { MessageCircle } from 'lucide-react';
import { BRAND } from './data/content';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=Hola, me comunico desde la web de Maqte Colombia`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Chat por WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/tienda/*" element={<Tienda />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/marcas" element={<Marcas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
