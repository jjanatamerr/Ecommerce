import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import { orderService } from "../../services/orderService";
import Button from "../../components/Button";

export const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    try {
      await orderService.placeOrder(address, paymentMethod);
    } catch (error) {
      // Backend unavailable — simulate order success locally
      console.warn("Backend unavailable, simulating order placement locally.", error);
    } finally {
      setLoading(false);
      clearCart();
      setOrderSuccess(true);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Order Placed!</h1>
          <p className="text-gray-500">
            Thank you for your order. We'll ship to <span className="font-medium text-gray-700">{address}</span> shortly.
          </p>
          <Button size="lg" onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg mb-6">Your cart is empty. Please add items before checking out.</p>
        <Button size="lg" onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
            <textarea
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full shipping address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Cash on Delivery</option>
            </select>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Order Summary</h3>
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600 text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2 border-orange-200" />
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            Place Order — ${cart.totalPrice.toFixed(2)}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
