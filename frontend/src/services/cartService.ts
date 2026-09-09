import api from "./api";
import type { Product } from "./productService";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalPrice: number;
}

export const cartService = {
  getCart: async () => {
    const response = await api.get<Cart>("/api/cart");
    return response.data;
  },
  addToCart: async (productId: string, quantity: number) => {
    const response = await api.post<Cart>("/api/cart/items", { productId, quantity });
    return response.data;
  },
  updateCartItem: async (cartItemId: string, quantity: number) => {
    const response = await api.put<Cart>(`/api/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (cartItemId: string) => {
    const response = await api.delete<Cart>(`/api/cart/items/${cartItemId}`);
    return response.data;
  },
};
