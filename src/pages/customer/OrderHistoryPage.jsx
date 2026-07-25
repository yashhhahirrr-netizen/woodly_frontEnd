import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, AlertTriangle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/mine');
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (orderNumber) => {
    toast.success(`Downloading tax invoice PDF for Order #${orderNumber}`, {
      style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-woodly-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400">Fetching order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-woodly-gold mx-auto" />
        <h2 className="text-xl font-extrabold text-white">No Orders Placed Yet</h2>
        <p className="text-xs text-gray-400">Your order history will appear here after placing your first furniture order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        Order <span className="text-woodly-gold">History & Live Tracking</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden">
            {/* Order Header Bar */}
            <div className="p-4 sm:p-6 bg-woodly-card/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-woodly-border">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-extrabold text-white">Order #{order.orderNumber}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : order.orderStatus === 'CANCELLED'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-woodly-gold/20 text-woodly-gold'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDownloadInvoice(order.orderNumber)}
                  className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-xs text-gray-300 hover:text-white px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-4 h-4 text-woodly-gold" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                  className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1"
                >
                  <span>Track Status</span>
                  {expandedOrderId === order._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-4 sm:p-6 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs border-b border-woodly-border/40 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-gray-400">Qty: {item.quantity} | ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Order Tracking Timeline Dropdown */}
            {expandedOrderId === order._id && (
              <div className="bg-black/40 p-6 border-t border-woodly-border space-y-4">
                <h4 className="text-xs font-bold text-woodly-gold uppercase tracking-wider">Live Delivery Status Timeline</h4>
                <div className="space-y-3 pl-4 border-l-2 border-woodly-gold">
                  {order.timeline?.map((step, sIdx) => (
                    <div key={sIdx} className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-woodly-gold" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{step.status}</span>
                        <span className="text-[10px] text-gray-500">{new Date(step.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-400">{step.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
