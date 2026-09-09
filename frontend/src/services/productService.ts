import api from "./api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockCount: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our top-of-the-line wireless headphones featuring active noise cancellation and 30-hour battery life.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stockCount: 15,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, and sleep patterns. Water-resistant up to 50 meters with a built-in GPS.",
    price: 199.50,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stockCount: 8,
  },
  {
    id: "3",
    name: "Ultra-Light Running Shoes",
    description: "Designed for speed and comfort. These shoes feature a breathable mesh upper and responsive cushioning for your daily runs.",
    price: 129.00,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stockCount: 42,
  },
  {
    id: "4",
    name: "Minimalist Leather Backpack",
    description: "A stylish and durable leather backpack perfect for daily commutes or weekend getaways. Fits up to a 15-inch laptop.",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stockCount: 0,
  }
];

export const productService = {
  getProducts: async () => {
    try {
      const response = await api.get<Product[]>("/api/products");
      return response.data;
    } catch (error) {
      console.warn("Backend unavailable, returning mock products.", error);
      return mockProducts;
    }
  },
  getProductById: async (id: string) => {
    try {
      const response = await api.get<Product>(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend unavailable, returning mock product ${id}.`, error);
      const product = mockProducts.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      return product;
    }
  },
};
