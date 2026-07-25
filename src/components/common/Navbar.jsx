import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Store,
  Crown,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { toggleCartDrawer } from '../../redux/slices/cartSlice';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-woodly-bg/95 backdrop-blur-md border-b border-woodly-border">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-woodly-card via-woodly-bg to-woodly-card py-1.5 px-4 text-xs text-center border-b border-white/5 text-gray-300 flex justify-between items-center max-w-7xl mx-auto">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="bg-woodly-gold text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded">FESTIVE SALE</span>
          <span>Complimentary White-Glove Furniture Delivery & Assembly Across India</span>
        </div>
        <div className="flex items-center space-x-4 mx-auto sm:mx-0">
          <span>Call Support: 1800-WOODLY-LUX</span>
          <span className="text-woodly-gold font-semibold">Track Order</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-woodly-gold to-yellow-600 flex items-center justify-center shadow-goldGlow group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-wider text-white">WOOD<span className="text-woodly-gold">LY</span></span>
            <p className="text-[10px] tracking-widest text-woodly-gold font-medium uppercase -mt-1">Luxury Furniture</p>
          </div>
        </Link>

        {/* Search Bar with Autocomplete simulation */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search solid teak dining, leather sofas, king beds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-woodly-card border border-woodly-border rounded-full py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-woodly-gold transition-colors"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-woodly-gold hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Wishlist Button */}
          <Link to="/wishlist" className="relative text-gray-300 hover:text-woodly-gold transition-colors p-1.5">
            <Heart className="w-6 h-6" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-woodly-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative text-gray-300 hover:text-woodly-gold transition-colors p-1.5"
          >
            <ShoppingBag className="w-6 h-6" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-woodly-gold text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Dropdown */}
          <div ref={dropdownRef} className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 bg-woodly-card border border-woodly-border hover:border-woodly-gold px-3 py-1.5 rounded-full transition-all"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-woodly-gold"
                />
                <span className="hidden sm:inline text-xs font-semibold text-white max-w-[90px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-woodly-gold" />
              </button>
            ) : (
              <Link
                to="/login"
                className="gold-btn px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-woodly-card border border-woodly-border rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-woodly-border">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold bg-woodly-gold/20 text-woodly-gold px-2 py-0.5 rounded">
                    Role: {user?.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-300 hover:bg-woodly-gold/10 hover:text-woodly-gold transition-colors font-medium"
                >
                  <User className="w-4 h-4 text-woodly-gold" />
                  <span>My Profile & Settings</span>
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-300 hover:bg-woodly-gold/10 hover:text-woodly-gold transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>My Orders</span>
                </Link>

                {user?.role === 'CUSTOMER' && (
                  <Link
                    to="/create-shop"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-gray-300 hover:bg-woodly-gold/10 hover:text-woodly-gold transition-colors font-medium"
                  >
                    <Store className="w-4 h-4 text-woodly-gold" />
                    <span>Create My Shop</span>
                  </Link>
                )}

                {user?.role === 'SUPPLIER' && (
                  <Link
                    to="/supplier"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-woodly-gold hover:bg-woodly-gold/10 transition-colors font-semibold"
                  >
                    <Store className="w-4 h-4" />
                    <span>Supplier Dashboard</span>
                  </Link>
                )}

                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-xs text-woodly-gold hover:bg-woodly-gold/10 transition-colors font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Control Panel</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors border-t border-woodly-border mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Mega Menu Bar) */}
      <nav className="hidden md:block bg-woodly-card/60 border-t border-woodly-border/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-gray-300">
          <Link to="/shop" className="py-3 hover:text-woodly-gold transition-colors flex items-center space-x-1">
            <span>All Catalog</span>
          </Link>
          <Link to="/shops" className="py-3 text-woodly-gold font-bold hover:underline flex items-center space-x-1">
            <Store className="w-3.5 h-3.5" />
            <span>Shops & Studios</span>
          </Link>
          <Link to="/shop?category=living-room" className="py-3 hover:text-woodly-gold transition-colors">
            Living Room
          </Link>
          <Link to="/shop?category=bedroom" className="py-3 hover:text-woodly-gold transition-colors">
            Bedroom
          </Link>
          <Link to="/shop?category=dining-room" className="py-3 hover:text-woodly-gold transition-colors">
            Dining & Kitchen
          </Link>
          <Link to="/shop?category=office-study" className="py-3 hover:text-woodly-gold transition-colors">
            Office & Study
          </Link>
          <Link to="/shop?isFeatured=true" className="py-3 text-woodly-gold font-bold hover:underline">
            ★ Featured Furniture
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-woodly-card border-b border-woodly-border px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-woodly-bg border border-woodly-border rounded-lg py-2 pl-3 pr-9 text-xs text-white"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-woodly-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col space-y-2 text-sm text-gray-300 font-medium">
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop All Products</Link>
            <Link to="/shop?category=living-room" onClick={() => setIsMobileMenuOpen(false)}>Living Room</Link>
            <Link to="/shop?category=bedroom" onClick={() => setIsMobileMenuOpen(false)}>Bedroom</Link>
            <Link to="/shop?category=dining-room" onClick={() => setIsMobileMenuOpen(false)}>Dining & Kitchen</Link>
            <Link to="/shop?category=office-study" onClick={() => setIsMobileMenuOpen(false)}>Office & Study</Link>
          </div>
        </div>
      )}
      <CartDrawer />
    </header>
  );
};

export default Navbar;
