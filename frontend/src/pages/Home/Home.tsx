import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../components/ProductCard";
import { productService } from "../../services/productService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getProducts();

        // Show first 4 real products as featured products
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Everything you need,{" "}
            <span className="text-orange-500">
              delivered fast
            </span>
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

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;