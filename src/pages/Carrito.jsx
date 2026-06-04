import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, ArrowLeft, ArrowRight, Loader,
  ShieldCheck, Truck, CreditCard, Package
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { getWixImageUrl } from '../lib/wixImageUrl';
import './Carrito.css';

const formatPrice = (amount, currency = 'COP') =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export default function Carrito() {
  const {
    cart, cartCount, isCartLoading,
    removeFromCart, updateCartItemQuantity, checkout
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const lineItems = cart?.lineItems || [];
  const isEmpty = lineItems.length === 0;

  const subtotal = lineItems.reduce((acc, item) => {
    const price = item.price?.amount ? parseFloat(item.price.amount) : 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const handleRemove = async (lineItemId) => {
    setRemovingId(lineItemId);
    try {
      await removeFromCart(lineItemId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
    setRemovingId(null);
  };

  const handleQuantityChange = async (lineItemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItemQuantity(lineItemId, newQty);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await checkout();
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Error al procesar el pago. Intenta de nuevo.');
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="carrito-page">
      {/* Hero */}
      <div className="carrito-hero">
        <div className="carrito-hero-bg" />
        <div className="container carrito-hero-content">
          <span className="label-upper">Tu carrito</span>
          <h1 className="display-lg" style={{ color: 'white', marginTop: '0.5rem' }}>
            Carrito de <span style={{ color: 'var(--clr-orange)' }}>Compras</span>
          </h1>
          {!isEmpty && (
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>
              {cartCount} artículo{cartCount !== 1 && 's'} en tu carrito
            </p>
          )}
        </div>
      </div>

      <section className="section-pad">
        <div className="container">
          {isEmpty ? (
            /* ── Empty State ────────────────────────────── */
            <div className="carrito-empty">
              <div className="carrito-empty-icon">
                <ShoppingCart size={48} />
              </div>
              <h2>Tu carrito está vacío</h2>
              <p>Explora nuestra tienda y encuentra las mejores herramientas y maquinaria para tu proyecto.</p>
              <Link to="/tienda" className="carrito-empty-cta">
                <ArrowLeft size={16} /> Ir a la Tienda
              </Link>
            </div>
          ) : (
            /* ── Cart Content ───────────────────────────── */
            <div className="carrito-layout">
              {/* Items */}
              <div className="carrito-items">
                <div className="carrito-items-header">
                  <span>Producto</span>
                  <span className="hide-mobile">Precio</span>
                  <span>Cantidad</span>
                  <span>Subtotal</span>
                  <span></span>
                </div>

                {lineItems.map((item) => {
                  const imageUrl = getWixImageUrl(item.image) || '/images/placeholder.png';
                  const price = item.price?.amount ? parseFloat(item.price.amount) : 0;
                  const itemTotal = price * (item.quantity || 1);
                  const isRemoving = removingId === item._id;

                  return (
                    <div
                      key={item._id}
                      className={`carrito-item ${isRemoving ? 'removing' : ''}`}
                    >
                      {/* Product info */}
                      <div className="carrito-item-product">
                        <div className="carrito-item-img">
                          <img src={imageUrl} alt={item.productName?.original || 'Producto'} />
                        </div>
                        <div className="carrito-item-details">
                          <h3 className="carrito-item-name">
                            {item.productName?.original || 'Producto'}
                          </h3>
                          <span className="carrito-item-price-mobile">
                            {item.price?.formattedConvertedAmount || formatPrice(price)}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="carrito-item-price hide-mobile">
                        {item.price?.formattedConvertedAmount || formatPrice(price)}
                      </div>

                      {/* Quantity */}
                      <div className="carrito-item-qty">
                        <button
                          className="carrito-qty-btn"
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                          disabled={isCartLoading || item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="carrito-qty-num">{item.quantity || 1}</span>
                        <button
                          className="carrito-qty-btn"
                          onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                          disabled={isCartLoading}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="carrito-item-subtotal">
                        {formatPrice(itemTotal)}
                      </div>

                      {/* Remove */}
                      <button
                        className="carrito-item-remove"
                        onClick={() => handleRemove(item._id)}
                        disabled={isRemoving}
                        title="Eliminar"
                      >
                        {isRemoving ? <Loader size={16} className="spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Summary */}
              <div className="carrito-summary">
                <h3 className="carrito-summary-title">Resumen del Pedido</h3>

                <div className="carrito-summary-rows">
                  <div className="carrito-summary-row">
                    <span>Subtotal ({cartCount} artículo{cartCount !== 1 && 's'})</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="carrito-summary-row">
                    <span>Envío</span>
                    <span className="carrito-summary-shipping">Calculado al pagar</span>
                  </div>
                </div>

                <div className="carrito-summary-total">
                  <span>Total</span>
                  <span className="carrito-summary-total-price">{formatPrice(subtotal)}</span>
                </div>

                <button
                  className="carrito-checkout-btn"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || isCartLoading}
                >
                  {isCheckingOut ? (
                    <><Loader size={18} className="spin" /> Procesando...</>
                  ) : (
                    <><CreditCard size={18} /> Finalizar Compra</>
                  )}
                </button>

                <p className="carrito-checkout-note">
                  Serás redirigido a una página segura para completar el pago.
                </p>

                <Link to="/tienda" className="carrito-continue-link">
                  <ArrowLeft size={14} /> Seguir Comprando
                </Link>

                {/* Trust badges */}
                <div className="carrito-trust">
                  <div className="carrito-trust-item">
                    <ShieldCheck size={16} />
                    <span>Compra segura</span>
                  </div>
                  <div className="carrito-trust-item">
                    <Truck size={16} />
                    <span>Envío a todo Colombia</span>
                  </div>
                  <div className="carrito-trust-item">
                    <Package size={16} />
                    <span>100% original</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
