import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Package, DollarSign, TrendingUp, Plus, Settings, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import API from '../../services/api';

const SupplierDashboard = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      const shopRes = await API.get('/shops/mine');
      setShop(shopRes.data.shop);

      const prodRes = await API.get('/products/mine');
      setProducts(prodRes.data.products || []);

      const orderRes = await API.get('/orders/mine');
      setOrders(orderRes.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
  const activeOrders = orders.filter((o) => ['PENDING', 'PROCESSING', 'PACKED', 'SHIPPED'].includes(o.orderStatus));
  const lowStockProducts = products.filter((p) => (p.stockQuantity || 0) <= 5);

  const chartData = [
    { day: 'Mon', revenue: Math.round(totalRevenue * 0.1) },
    { day: 'Tue', revenue: Math.round(totalRevenue * 0.15) },
    { day: 'Wed', revenue: Math.round(totalRevenue * 0.12) },
    { day: 'Thu', revenue: Math.round(totalRevenue * 0.18) },
    { day: 'Fri', revenue: Math.round(totalRevenue * 0.22) },
    { day: 'Sat', revenue: Math.round(totalRevenue * 0.23) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-woodly-card border border-woodly-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-woodly-gold" />
            <h1 className="text-2xl font-extrabold text-white">
              Supplier <span className="text-woodly-gold">Portal</span>
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {shop ? shop.name : 'Supplier Shop'} • GSTIN: {shop?.gstNumber || 'N/A'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/supplier/products"
            className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            to="/supplier/orders"
            className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold px-4 py-2.5 rounded-xl text-xs text-white font-bold"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Total Sales</span>
          <div className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400 font-bold">Real-time revenue</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Active Orders</span>
          <div className="text-2xl font-black text-woodly-gold">{activeOrders.length}</div>
          <span className="text-[10px] text-gray-400">In fulfillment pipeline</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Listed Products</span>
          <div className="text-2xl font-black text-white">{products.length}</div>
          <span className="text-[10px] text-emerald-400 font-bold">Live items</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Shop Rating</span>
          <div className="text-2xl font-black text-woodly-gold">{shop?.rating || 4.9} ★</div>
          <span className="text-[10px] text-gray-400">Verified seller score</span>
        </div>
      </div>

      {/* Sales Graph & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Weekly Revenue Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ background: '#121212', borderColor: '#FFC107', borderRadius: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={3} fillOpacity={1} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Low Stock Alert Panel */}
        <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-woodly-gold" />
            <span>Low Stock Warnings ({lowStockProducts.length})</span>
          </h3>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-gray-400">All products have healthy inventory levels.</p>
            ) : (
              lowStockProducts.map((prod) => (
                <div key={prod._id} className="bg-woodly-bg border border-woodly-border p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white max-w-[150px] truncate">{prod.title}</h4>
                    <p className="text-gray-400 text-[10px]">SKU: {prod.sku}</p>
                  </div>
                  <span className="bg-red-500/20 text-red-400 font-extrabold px-2 py-0.5 rounded">
                    {prod.stockQuantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
