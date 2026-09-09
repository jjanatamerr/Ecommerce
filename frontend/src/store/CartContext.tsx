import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartService } from "../services/cartService";
import type { Cart, CartItem } from "../services/cartService";
import { useAuth } from "./AuthContext";
import { productService } from "../services/productService";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate a simple unique id for local cart items
let _localIdCounter = 1;
const newLocalId = () => `local-${_localIdCounter++}`;

const makeEmptyCart = (): Cart => ({ id: "local-cart", items: [], totalPrice: 0 });

const recalcTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [useLocalCart, setUseLocalCart] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      setUseLocalCart(false);
    } catch (error) {
      console.warn("Backend unavailable, switching to local cart.", error);
      setUseLocalCart(true);
      setCart((prev) => prev ?? makeEmptyCart());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // If not authenticated, still allow local cart to work
    if (!isAuthenticated) {
      setUseLocalCart(true);
      setCart((prev) => prev ?? makeEmptyCart());
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number) => {
    // Try backend first
    if (!useLocalCart) {
      try {
        const data = await cartService.addToCart(productId, quantity);
        setCart(data);
        return;
      } catch (error) {
        console.warn("Backend unavailable, falling back to local cart.", error);
        setUseLocalCart(true);
      }
    }

    // Local cart fallback
    try {
      const product = await productService.getProductById(productId);
      setCart((prev) => {
        const current = prev ?? makeEmptyCart();
        const existingIndex = current.items.findIndex((i) => i.productId === productId);
        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = current.items.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: newLocalId(),
            productId,
            product,
            quantity,
          };
          newItems = [...current.items, newItem];
        }
        return { ...current, items: newItems, totalPrice: recalcTotal(newItems) };
      });
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!useLocalCart) {
      try {
        const data = await cartService.updateCartItem(cartItemId, quantity);
        setCart(data);
        return;
      } catch (error) {
        console.warn("Backend unavailable, using local cart.", error);
        setUseLocalCart(true);
      }
    }
    setCart((prev) => {
      if (!prev) return prev;
      const newItems = prev.items
        .map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
      return { ...prev, items: newItems, totalPrice: recalcTotal(newItems) };
    });
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!useLocalCart) {
      try {
        const data = await cartService.removeFromCart(cartItemId);
        setCart(data);
        return;
      } catch (error) {
        console.warn("Backend unavailable, using local cart.", error);
        setUseLocalCart(true);
      }
    }
    setCart((prev) => {
      if (!prev) return prev;
      const newItems = prev.items.filter((item) => item.id !== cartItemId);
      return { ...prev, items: newItems, totalPrice: recalcTotal(newItems) };
    });
  };

  const clearCart = () => {
    setCart(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
