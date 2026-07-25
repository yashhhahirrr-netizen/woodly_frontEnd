import React, { useState, useEffect } from 'react';
import { Users, Shield, Ban, CheckCircle } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await API.put(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User status changed to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Platform <span className="text-woodly-gold">User Directory</span></h1>
        <p className="text-xs text-gray-400">Manage accounts, roles, and suspend malicious users</p>
      </div>

      <div className="bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-woodly-bg border-b border-woodly-border uppercase text-woodly-gold font-bold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Verified</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodly-border">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-black/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-white">{u.name}</h4>
                      <p className="text-gray-400 text-[10px]">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-woodly-gold uppercase">{u.role}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold ${u.isVerified ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {u.isVerified ? '✓ Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u._id, u.status)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        u.status === 'ACTIVE' ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
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

export default UserManagement;
