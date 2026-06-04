import { useContext } from "react";
import { WixCartContext } from "../context/WixCartContext";

/**
 * Access cart state and actions.
 *
 * Returns:
 * - cart          — full cart object from Wix
 * - cartCount     — total number of items
 * - isCartLoading — loading state for cart operations
 * - addToCart(productId, quantity)
 * - removeFromCart(lineItemId)
 * - updateCartItemQuantity(lineItemId, newQuantity)
 * - refreshCart()
 * - checkout()
 */
export const useCart = () => {
  const {
    cart,
    cartCount,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    refreshCart,
    checkout,
  } = useContext(WixCartContext);

  return {
    cart,
    cartCount,
    isCartLoading,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    refreshCart,
    checkout,
  };
};
