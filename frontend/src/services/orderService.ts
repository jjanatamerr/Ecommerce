import api from "./api";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

export const orderService = {
  placeOrder: async (shippingAddress: string, paymentMethod: string) => {
    const response = await api.post<Order>("/api/orders", { shippingAddress, paymentMethod });
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get<Order[]>("/api/orders");
    return response.data;
  },
};
