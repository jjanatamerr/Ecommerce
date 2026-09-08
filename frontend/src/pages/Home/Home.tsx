import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../components/ProductCard";

const mockProducts: Product[] = [
  { id: "1", name: "Premium Wireless Headphones", price: 299.99, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
  { id: "2", name: "Smart Fitness Watch", price: 199.50, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  { id: "3", name: "Ultra-Light Running Shoes", price: 129.00, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" },
  { id: "4", name: "Minimalist Leather Backpack", price: 159.99, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
];

const Home = () => {
  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Everything you need,{" "}
            <span className="text-orange-500">delivered fast</span>
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Browse thousands of products at the best prices, all in one place.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;