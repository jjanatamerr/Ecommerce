import { Link } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col group"
    >
      <div className="bg-gray-100 rounded-lg h-40 mb-4 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <span className="font-medium text-gray-900 line-clamp-2 mb-1">
        {product.name}
      </span>
      <span className="text-orange-500 font-bold mt-auto">
        ${product.price.toFixed(2)}
      </span>
    </Link>
  );
};

export default ProductCard;