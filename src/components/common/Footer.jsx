import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-woodly-card border-t border-woodly-border text-gray-400 pt-16 pb-8">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-woodly-border/60">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold/10 border border-woodly-gold/20 flex items-center justify-center text-woodly-gold shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">White-Glove Shipping</h4>
            <p className="text-xs text-gray-400 mt-0.5">Complimentary delivery & assembly</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold/10 border border-woodly-gold/20 flex items-center justify-center text-woodly-gold shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">10-Year Wood Warranty</h4>
            <p className="text-xs text-gray-400 mt-0.5">100% solid teak & oak guarantee</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold/10 border border-woodly-gold/20 flex items-center justify-center text-woodly-gold shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">30-Day Easy Returns</h4>
            <p className="text-xs text-gray-400 mt-0.5">Hassle-free return policy</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold/10 border border-woodly-gold/20 flex items-center justify-center text-woodly-gold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">256-Bit SSL Payment</h4>
            <p className="text-xs text-gray-400 mt-0.5">Encrypted transactions</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-woodly-gold flex items-center justify-center text-black">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">WOOD<span className="text-woodly-gold">LY</span></span>
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            India's premier online destination for handcrafted luxury furniture, bespoke interior collections, and artisan home decor.
          </p>
          <div className="space-y-2 text-gray-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-woodly-gold" />
              <span>Woodly Towers, BKC Commercial Complex, Mumbai - 400051</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-woodly-gold" />
              <span>+91 1800-966-359 (Toll Free)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-woodly-gold" />
              <span>support@woodlyfurniture.com</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-woodly-gold pl-2">Categories</h4>
          <ul className="space-y-2.5">
            <li><Link to="/shop?category=living-room" className="hover:text-woodly-gold transition-colors">Living Room Sofas</Link></li>
            <li><Link to="/shop?category=bedroom" className="hover:text-woodly-gold transition-colors">Solid Wood Beds</Link></li>
            <li><Link to="/shop?category=dining-room" className="hover:text-woodly-gold transition-colors">Dining Table Sets</Link></li>
            <li><Link to="/shop?category=office-study" className="hover:text-woodly-gold transition-colors">Executive Office Desks</Link></li>
            <li><Link to="/shop?isFeatured=true" className="hover:text-woodly-gold transition-colors">Accent Storage & Decor</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-woodly-gold pl-2">Customer Care</h4>
          <ul className="space-y-2.5">
            <li><Link to="/orders" className="hover:text-woodly-gold transition-colors">Track Order Status</Link></li>
            <li><a href="#faq" className="hover:text-woodly-gold transition-colors">Shipping & Delivery Policy</a></li>
            <li><a href="#returns" className="hover:text-woodly-gold transition-colors">Returns & Refunds</a></li>
            <li><a href="#warranty" className="hover:text-woodly-gold transition-colors">Furniture Care Guide</a></li>
            <li><a href="#contact" className="hover:text-woodly-gold transition-colors">Frequently Asked Questions</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-woodly-gold pl-2">Join Woodly Club</h4>
          <p className="text-gray-400 mb-3">Subscribe to receive exclusive preview invitations and ₹2,500 off your first furniture purchase.</p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-woodly-bg border border-woodly-border rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-woodly-gold"
            />
            <button type="submit" className="w-full gold-btn py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-woodly-border/40 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 Woodly Furniture Marketplace Inc. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#privacy" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-300">Terms of Service</a>
          <a href="#sitemap" className="hover:text-gray-300">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
