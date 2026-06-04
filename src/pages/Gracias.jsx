import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingCart, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { BRAND } from '../data/content';

export default function Gracias() {
  return (
    <main className="producto-page">
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '520px' }}>
          {/* Success Icon */}
          <div style={{
            width: '90px',
            height: '90px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '2px solid rgba(34, 197, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle size={42} color="#22C55E" />
          </div>

          <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>
            ¡Gracias por tu <span style={{ color: 'var(--clr-orange)' }}>compra</span>!
          </h1>

          <p style={{
            color: 'var(--clr-text-2)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            marginBottom: '2rem'
          }}>
            Tu pedido ha sido procesado exitosamente. Recibirás un correo con los detalles
            de tu compra y la información de seguimiento del envío.
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <Link
              to="/tienda"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                background: 'var(--clr-orange)',
                color: 'var(--clr-bg)',
                fontWeight: 700,
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <ShoppingCart size={18} />
              Seguir Comprando
            </Link>

            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=SW- Quisiera más información de sus productos. Acabo de realizar una compra en su web y quiero confirmar mi pedido.`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                color: 'var(--clr-text-2)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          </div>

          {/* Trust note */}
          <p style={{
            color: 'var(--clr-text-3)',
            fontSize: '0.8rem',
            marginTop: '3rem',
            lineHeight: 1.6
          }}>
            Si tienes alguna duda sobre tu pedido, contáctanos al{' '}
            <a href={`tel:${BRAND.phone}`} style={{ color: 'var(--clr-orange)' }}>
              {BRAND.phone}
            </a>{' '}
            o por WhatsApp. Estamos para ayudarte.
          </p>
        </div>
      </div>
    </main>
  );
}
