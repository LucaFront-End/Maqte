import { useState } from 'react';
import { ShoppingCart, Check, Loader } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function AddToCartButton({ productId, productName, compact = false }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (isLoading || !productId) return;
    setIsLoading(true);
    setError(null);

    try {
      await addToCart(productId, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error('[AddToCart] Error:', err);
      setError('Error al añadir. Intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
        className={`add-to-cart-compact ${added ? 'added' : ''}`}
        disabled={isLoading}
        title="Añadir al carrito"
      >
        {isLoading ? (
          <Loader size={16} className="spin" />
        ) : added ? (
          <Check size={16} />
        ) : (
          <ShoppingCart size={16} />
        )}
      </button>
    );
  }

  return (
    <div className="add-to-cart-wrap">
      {/* Quantity selector */}
      <div className="add-to-cart-qty">
        <button
          className="add-to-cart-qty-btn"
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          disabled={isLoading}
        >
          −
        </button>
        <span className="add-to-cart-qty-num">{quantity}</span>
        <button
          className="add-to-cart-qty-btn"
          onClick={() => setQuantity(q => q + 1)}
          disabled={isLoading}
        >
          +
        </button>
      </div>

      {/* Main button */}
      <button
        onClick={handleAdd}
        className={`add-to-cart-btn ${added ? 'added' : ''} ${error ? 'error' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader size={18} className="spin" />
            <span>Añadiendo...</span>
          </>
        ) : added ? (
          <>
            <Check size={18} />
            <span>¡Añadido al carrito!</span>
          </>
        ) : error ? (
          <span>{error}</span>
        ) : (
          <>
            <ShoppingCart size={18} />
            <span>Añadir al Carrito</span>
          </>
        )}
      </button>
    </div>
  );
}
