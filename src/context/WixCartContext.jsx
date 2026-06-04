// =============================================================
// WixCartContext — Global Wix + Cart State Provider
//
// Handles:
// - Wix client initialization with visitor token generation
// - Cart state (items, count, loading)
// - Add to cart, remove from cart, update quantity
// - Checkout redirect to Wix hosted checkout
// =============================================================

import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { createWixClient, WIX_STORES_APP_ID } from "../lib/wixClient";

// ─── Context ─────────────────────────────────────────────
export const WixCartContext = createContext({
  wixClient: null,
  isReady: false,
  cart: null,
  cartCount: 0,
  isCartLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartItemQuantity: async () => {},
  refreshCart: async () => {},
  checkout: async () => {},
});

// ─── Provider ────────────────────────────────────────────
export function WixCartProvider({ children }) {
  const [wixClient] = useState(() => createWixClient());
  const [isReady, setIsReady] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const initRef = useRef(false);

  // ── Initialize visitor tokens ──────────────────────────
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      try {
        const tokenKey = "maqte_wix_session";
        const existing = localStorage.getItem(tokenKey);
        if (!existing) {
          await wixClient.auth.generateVisitorTokens();
        }
      } catch (err) {
        console.error("[Wix] Failed to generate visitor tokens:", err);
      }
      setIsReady(true);
    };
    init();
  }, [wixClient]);

  // ── Fetch current cart ─────────────────────────────────
  const refreshCart = useCallback(async () => {
    if (!isReady) return;
    try {
      const currentCart = await wixClient.currentCart.getCurrentCart();
      setCart(currentCart);
      const count = currentCart?.lineItems?.reduce(
        (acc, item) => acc + (item.quantity || 0),
        0
      ) || 0;
      setCartCount(count);
    } catch (error) {
      // Cart doesn't exist yet — that's fine
      if (
        error?.details?.applicationError?.code === "OWNED_CART_NOT_FOUND" ||
        error?.message?.includes("not found")
      ) {
        setCart(null);
        setCartCount(0);
      } else {
        console.error("[Cart] Error fetching cart:", error);
      }
    }
  }, [wixClient, isReady]);

  // Auto-fetch cart when ready
  useEffect(() => {
    if (isReady) refreshCart();
  }, [isReady, refreshCart]);

  // ── Add to Cart ────────────────────────────────────────
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isReady) return;
      setIsCartLoading(true);
      try {
        await wixClient.currentCart.addToCurrentCart({
          lineItems: [
            {
              catalogReference: {
                catalogItemId: productId,
                appId: WIX_STORES_APP_ID,
              },
              quantity,
            },
          ],
        });
        await refreshCart();
      } catch (error) {
        console.error("[Cart] Error adding to cart:", error);
        throw error;
      } finally {
        setIsCartLoading(false);
      }
    },
    [wixClient, isReady, refreshCart]
  );

  // ── Remove from Cart ──────────────────────────────────
  const removeFromCart = useCallback(
    async (lineItemId) => {
      if (!isReady) return;
      setIsCartLoading(true);
      try {
        await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
        await refreshCart();
      } catch (error) {
        console.error("[Cart] Error removing from cart:", error);
        throw error;
      } finally {
        setIsCartLoading(false);
      }
    },
    [wixClient, isReady, refreshCart]
  );

  // ── Update Cart Item Quantity ──────────────────────────
  const updateCartItemQuantity = useCallback(
    async (lineItemId, newQuantity) => {
      if (!isReady) return;
      setIsCartLoading(true);
      try {
        await wixClient.currentCart.updateCurrentCartLineItemQuantity([
          { _id: lineItemId, quantity: newQuantity },
        ]);
        await refreshCart();
      } catch (error) {
        console.error("[Cart] Error updating quantity:", error);
        throw error;
      } finally {
        setIsCartLoading(false);
      }
    },
    [wixClient, isReady, refreshCart]
  );

  // ── Checkout ───────────────────────────────────────────
  const checkout = useCallback(async () => {
    if (!isReady) return;
    setIsCartLoading(true);
    try {
      const checkoutResult =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: "WEB",
        });

      const checkoutId = checkoutResult?.checkoutId;
      if (!checkoutId) throw new Error("No se recibió checkoutId");

      // Redirect directly to Wix hosted checkout (same pattern as Restomueble)
      const thankYouUrl = encodeURIComponent(window.location.origin + "/gracias");
      const checkoutBase = import.meta.env.VITE_WIX_CHECKOUT_BASE;
      window.location.href = `${checkoutBase}/__ecom/checkout?checkoutId=${checkoutId}&origin=${thankYouUrl}`;
    } catch (error) {
      console.error("[Checkout] Error:", error?.message || error);
      alert("Error al procesar el pago. Intenta de nuevo.");
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  }, [wixClient, isReady]);

  const value = {
    wixClient,
    isReady,
    cart,
    cartCount,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    refreshCart,
    checkout,
  };

  return (
    <WixCartContext.Provider value={value}>{children}</WixCartContext.Provider>
  );
}
