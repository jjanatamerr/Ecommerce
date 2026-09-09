import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import type { Product } from "../../services/productService";
import { useCart } from "../../store/CartContext";
import Button from "../../components/Button";
import Loader from "../../components/Loader";

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, 1);
      navigate("/cart");
    } catch (error) {
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12 bg-white rounded-2xl shadow-xl p-8">
        <div className="w-full md:w-1/2">
          <img
            src={product.imageUrl || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-auto object-cover rounded-xl shadow-sm"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>
          
          <div className="mb-8">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stockCount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
            </span>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            isLoading={adding}
            disabled={product.stockCount === 0}
            className="w-full md:w-auto self-start"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
