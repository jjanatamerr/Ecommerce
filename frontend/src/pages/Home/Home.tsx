import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../components/ProductCard";

const mockProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", price: 49.99 },
  { id: "2", name: "Smart Watch", price: 89.5 },
  { id: "3", name: "Running Shoes", price: 35.0 },
  { id: "4", name: "Backpack", price: 25.99 },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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