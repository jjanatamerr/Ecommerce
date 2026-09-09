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

interface BackendCartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
  total: number;
  createdAt: string;
}

const mapCart = (data: BackendCart): Cart => ({
  id: data.id,
  totalPrice: data.total,
  items: data.items.map((item) => ({
    id: item.cartItemId,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      id: item.productId,
      name: item.productName,
      description: "",
      price: item.unitPrice,
      imageUrl: "",
      stockQuantity: 0,
    },
  })),
});

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get<BackendCart>("/api/v1/cart");
    return mapCart(response.data);
  },

  addToCart: async (
    productId: string,
    quantity: number
  ): Promise<Cart> => {
    const response = await api.post<BackendCart>("/api/v1/cart/items", {
      productId,
      quantity,
    });

    return mapCart(response.data);
  },

  updateCartItem: async (
    cartItemId: string,
    quantity: number
  ): Promise<Cart> => {
    const response = await api.put<BackendCart>(
      `/api/v1/cart/items/${cartItemId}`,
      {
        quantity,
      }
    );

    return mapCart(response.data);
  },

  removeFromCart: async (
    cartItemId: string
  ): Promise<Cart> => {
    const response = await api.delete<BackendCart>(
      `/api/v1/cart/items/${cartItemId}`
    );

    return mapCart(response.data);
  },
};