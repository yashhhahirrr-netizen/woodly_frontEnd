import React, { useState, useEffect } from 'react';
import { Store, Check, X, ShieldCheck } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ShopApprovals = () => {
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
      toast.error('Failed to load shop applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId, status) => {
    try {
      await API.put(`/admin/shops/${shopId}/approve`, { status });
      toast.success(`Shop ${status.toLowerCase()} successfully`);
      fetchShops();
    } catch (err) {
      toast.error('Moderation action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Supplier Shop <span className="text-woodly-gold">Moderation Queue</span></h1>
        <p className="text-xs text-gray-400">Review GSTIN credentials and approve supplier applications</p>
      </div>

      <div className="bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-woodly-bg border-b border-woodly-border uppercase text-woodly-gold font-bold">
              <tr>
                <th className="p-4">Shop Name</th>
                <th className="p-4">Owner</th>
                <th className="p-4">GST Number</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodly-border">
              {shops.map((shop) => (
                <tr key={shop._id} className="hover:bg-black/30 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center space-x-2">
                    <Store className="w-4 h-4 text-woodly-gold" />
                    <span>{shop.name}</span>
                  </td>
                  <td className="p-4">{shop.owner?.name || shop.contactEmail}</td>
                  <td className="p-4 font-mono">{shop.gstNumber || '27AAAAA0000A1Z5'}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      shop.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {shop.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleApprove(shop._id, 'APPROVED')}
                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprove(shop._id, 'REJECTED')}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopApprovals;
