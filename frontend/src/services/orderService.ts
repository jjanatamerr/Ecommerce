import api from "./api";

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const orderService = {
  placeOrder: async (
    _shippingAddress: string,
    _paymentMethod: string
  ): Promise<Order> => {

    const idempotencyKey = crypto.randomUUID();

    const response = await api.post<Order>(
      "/api/v1/orders/checkout",
      {
        idempotencyKey,
      }
    );

    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(
      "/api/v1/orders/my-orders"
    );

    return response.data;
  },
};