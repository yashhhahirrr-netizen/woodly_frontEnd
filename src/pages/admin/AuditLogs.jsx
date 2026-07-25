import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
import API from '../../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await API.get('/admin/audit-logs');
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System <span className="text-woodly-gold">Audit Trail</span></h1>
        <p className="text-xs text-gray-400">Security compliance and administrative action records</p>
      </div>

      <div className="bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-woodly-bg border-b border-woodly-border uppercase text-woodly-gold font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin Email</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodly-border">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-black/30 transition-colors">
                  <td className="p-4 font-mono text-[10px] text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white">{log.userEmail}</td>
                  <td className="p-4 font-bold text-woodly-gold uppercase">{log.action}</td>
                  <td className="p-4 text-gray-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
