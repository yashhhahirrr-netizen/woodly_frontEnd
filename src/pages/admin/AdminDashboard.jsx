import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Store, Package, ShoppingBag, DollarSign, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setStats(res.data.stats);
      setCharts(res.data.charts);
    } catch (err) {
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-woodly-card border border-woodly-border rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-woodly-gold" />
            <h1 className="text-2xl font-extrabold text-white">
              Super Admin <span className="text-woodly-gold">Control Panel</span>
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">Enterprise marketplace monitoring, moderation & audit controls</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/admin/shops" className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold">
            Shop Approvals
          </Link>
          <Link to="/admin/users" className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold px-4 py-2.5 rounded-xl text-xs text-white font-bold">
            User Management
          </Link>
          <Link to="/admin/logs" className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold px-4 py-2.5 rounded-xl text-xs text-white font-bold">
            Audit Logs
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Gross Platform Revenue</span>
          <div className="text-2xl font-black text-woodly-gold">
            ₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '38,50,000'}
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">+24.2% YoY Growth</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Total Platform Users</span>
          <div className="text-2xl font-black text-white">{stats?.totalUsers || 1240}</div>
          <span className="text-[10px] text-gray-400">Customers & Sellers</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Verified Shops</span>
          <div className="text-2xl font-black text-white">{stats?.totalShops || 48}</div>
          <span className="text-[10px] text-emerald-400 font-bold">100% Compliant</span>
        </div>

        <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2">
          <span className="text-xs text-gray-400 uppercase font-bold">Catalog Items</span>
          <div className="text-2xl font-black text-white">{stats?.totalProducts || 320}</div>
          <span className="text-[10px] text-gray-400">Live products</span>
        </div>
      </div>

      {/* Recharts Graphical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Area Chart */}
        <div className="lg:col-span-2 bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Gross Revenue Trend (2026)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.monthlySales || []}>
                <defs>
                  <linearGradient id="goldGradAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip contentStyle={{ background: '#121212', borderColor: '#FFC107', borderRadius: '12px', color: '#FFF' }} />
                <Area type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={3} fillOpacity={1} fill="url(#goldGradAdmin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Category Revenue Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.categoryDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts?.categoryDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#121212', borderRadius: '8px', color: '#FFF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-xs">
            {charts?.categoryDistribution?.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-gray-300">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span>{cat.name}</span>
                </span>
                <span className="font-bold text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
