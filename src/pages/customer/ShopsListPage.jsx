import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, MapPin, Star, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import API from '../../services/api';

const ShopsListPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await API.get('/shops');
      setShops(res.data.shops || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-woodly-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Loading verified furniture studios & shops...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-woodly-card border border-woodly-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-woodly-gold" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Furniture <span className="text-woodly-gold">Shops & Studios</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse verified solid teak furniture artisans and storefronts across India
          </p>
        </div>
        <div className="bg-woodly-bg border border-woodly-border px-4 py-2 rounded-xl text-xs font-bold text-woodly-gold">
          {shops.length} Verified Sellers
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Link
            key={shop._id}
            to={`/store/${shop._id}`}
            className="group bg-woodly-card border border-woodly-border hover:border-woodly-gold/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-goldGlow flex flex-col justify-between"
          >
            {/* Banner & Logo Overlay */}
            <div className="relative h-40 bg-black/40 overflow-hidden">
              <img
                src={shop.banner}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center space-x-3">
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-woodly-gold shadow-lg"
                />
                <div>
                  <h3 className="text-sm font-extrabold text-white group-hover:text-woodly-gold transition-colors line-clamp-1">
                    {shop.name}
                  </h3>
                  <span className="text-[10px] text-gray-300 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-woodly-gold" />
                    <span>{shop.address?.city || 'Mumbai'}, India</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Shop Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-gray-400 line-clamp-2">{shop.description}</p>

              <div className="pt-3 border-t border-woodly-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-woodly-gold font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{shop.rating || 4.9}</span>
                  <span className="text-gray-500 font-normal">({shop.reviewCount || 42})</span>
                </div>

                <span className="text-woodly-gold font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>View Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopsListPage;
