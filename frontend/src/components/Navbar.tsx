import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Navbar = () => {
  const { fullName, token, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="text-2xl font-extrabold text-orange-500 tracking-tight">
          ShopEase
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-lg transition-colors">
            🔍
          </button>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-orange-500 transition-colors"
          >
            🛒
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          {token ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600">
                Hi, <span className="font-medium text-gray-900">{fullName}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;