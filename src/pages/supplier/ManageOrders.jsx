import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/mine');
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error('Failed to load shop orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Manage <span className="text-woodly-gold">Shop Orders</span></h1>
        <p className="text-xs text-gray-400">Process customer orders and update dispatch status</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-woodly-border pb-3">
              <div>
                <span className="text-sm font-extrabold text-white">Order #{order.orderNumber}</span>
                <span className="text-xs text-gray-400 block">Customer: {order.shippingAddress?.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-woodly-gold bg-woodly-gold/20 px-3 py-1 rounded-full uppercase">
                  {order.orderStatus}
                </span>

                <select
                  value={order.orderStatus}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="bg-woodly-bg border border-woodly-border text-xs text-white rounded-lg px-2.5 py-1.5 focus:border-woodly-gold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-gray-300">{item.quantity}x {item.title}</span>
                  <span className="font-bold text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageOrders;
