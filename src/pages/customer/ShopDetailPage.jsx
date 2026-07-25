import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Store, MapPin, Phone, Mail, Award, Star, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import API from '../../services/api';

const ShopDetailPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      const res = await API.get(`/shops/${id}`);
      setShop(res.data.shop);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-woodly-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Loading shop profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Shop Hero Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden border border-woodly-border">
        <img src={shop.banner} alt={shop.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="flex items-center space-x-4">
            <img src={shop.logo} alt={shop.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-woodly-gold shadow-2xl" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-white">{shop.name}</h1>
                {shop.status === 'APPROVED' && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Seller</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-md line-clamp-1">{shop.description}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-woodly-gold font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span>{shop.rating} Shop Score ({shop.reviewCount || 42} Ratings)</span>
          </div>
        </div>
      </div>

      {/* Shop Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-woodly-card border border-woodly-border p-4 rounded-2xl space-y-2">
          <span className="text-gray-400 font-bold uppercase flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-woodly-gold" />
            <span>Shop Location</span>
          </span>
          <p className="text-white font-bold">{shop.address?.city}, {shop.address?.state}, India</p>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-4 rounded-2xl space-y-2">
          <span className="text-gray-400 font-bold uppercase flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-woodly-gold" />
            <span>Tax GST Registration</span>
          </span>
          <p className="text-white font-mono font-bold">{shop.gstNumber || '27AAAAA0000A1Z5'}</p>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-4 rounded-2xl space-y-2">
          <span className="text-gray-400 font-bold uppercase flex items-center space-x-1">
            <Clock className="w-4 h-4 text-woodly-gold" />
            <span>Working Hours</span>
          </span>
          <p className="text-white font-bold">Mon - Sat (9:00 AM - 8:00 PM)</p>
        </div>
      </div>

      {/* Shop Products Catalog */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-white">Furniture Catalog by {shop.name} ({products.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
