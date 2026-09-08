import type { CartItem as CartItemType } from "../services/cartService";
import Button from "./Button";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg mb-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.product.imageUrl || "https://via.placeholder.com/150"}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
          <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            +
          </button>
        </div>
        <div className="text-lg font-semibold">
          ${(item.product.price * item.quantity).toFixed(2)}
        </div>
        <Button variant="danger" size="sm" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
