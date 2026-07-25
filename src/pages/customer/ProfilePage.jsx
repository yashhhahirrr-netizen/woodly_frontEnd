import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Upload, Plus, Trash2, CheckCircle2, ShieldCheck, ShoppingBag, Store } from 'lucide-react';
import { updateUserProfile } from '../../redux/slices/authSlice';
import API from '../../services/api';
import { uploadFileToCloudinary } from '../../services/imageUploadService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile'); // profile, address, security

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    label: 'Home',
  });

  // Password Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setAvatar(url);
      dispatch(updateUserProfile({ avatar: url }));
      toast.success('Profile avatar updated via Cloudinary!');
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      await API.put('/auth/update-profile', { name, phone, avatar });
      dispatch(updateUserProfile({ name, phone, avatar }));
      toast.success('Profile information updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    try {
      const updatedAddresses = [...addresses, newAddress];
      await API.put('/auth/update-profile', { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      dispatch(updateUserProfile({ addresses: updatedAddresses }));
      toast.success('Delivery address saved successfully!');
      setShowAddressModal(false);
      setNewAddress({ street: '', city: '', state: '', postalCode: '', label: 'Home' });
    } catch (err) {
      toast.error('Failed to save address');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      await API.post('/auth/forgot-password', { email: user?.email });
      toast.success('Password update requested. Check your email!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner (Avatar & Details Left, Actions Right) */}
      <div className="bg-woodly-card border border-woodly-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="flex items-center space-x-5">
          <div className="relative group">
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-woodly-gold shadow-goldGlow"
            />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-file" />
          </div>

          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              <span className="bg-woodly-gold/20 text-woodly-gold text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-woodly-gold/30">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-woodly-gold" />
              <span>{user?.email}</span>
            </p>
            <div className="mt-2">
              <label htmlFor="avatar-file-btn" className="cursor-pointer inline-flex items-center space-x-1.5 bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-woodly-gold text-[11px] font-bold px-3 py-1 rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Change Profile Picture'}</span>
              </label>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-file-btn" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/orders" className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all">
            <ShoppingBag className="w-4 h-4 text-woodly-gold" />
            <span>My Orders</span>
          </Link>
          {user?.role === 'CUSTOMER' && (
            <Link to="/create-shop" className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md">
              <Store className="w-4 h-4" />
              <span>Create Shop</span>
            </Link>
          )}
        </div>
      </div>

      {/* LOWER SECTION - CENTERED LAYOUT */}
      <div className="space-y-8 text-center">
        {/* Centered Tab Switcher */}
        <div className="flex justify-center border-b border-woodly-border space-x-6 sm:space-x-10 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors border-b-2 ${activeTab === 'profile' ? 'border-woodly-gold text-woodly-gold' : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Personal Details
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`pb-3 transition-colors border-b-2 ${activeTab === 'address' ? 'border-woodly-gold text-woodly-gold' : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Saved Delivery Addresses ({addresses.length})
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 transition-colors border-b-2 ${activeTab === 'security' ? 'border-woodly-gold text-woodly-gold' : 'border-transparent text-gray-400 hover:text-white'
              }`}
          >
            Security & Password
          </button>
        </div>

        {/* Centered Tab 1: Personal Details */}
        {activeTab === 'profile' && (
          <div className="bg-woodly-card border border-woodly-border p-8 rounded-3xl max-w-xl mx-auto space-y-6 text-center shadow-xl">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-woodly-border pb-3 flex items-center justify-center space-x-2">
              <User className="w-4 h-4 text-woodly-gold" />
              <span>Account Profile Details</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1 text-center">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center focus:border-woodly-gold"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1 text-center">Email Address</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-woodly-bg/40 border border-woodly-border rounded-xl p-3 text-gray-500 text-center cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1 text-center">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center focus:border-woodly-gold"
                />
              </div>

              <button type="submit" disabled={updatingProfile} className="w-full gold-btn py-3.5 rounded-xl font-extrabold uppercase shadow-goldGlow">
                {updatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        )}

        {/* Centered Tab 2: Saved Addresses */}
        {activeTab === 'address' && (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Delivery Destinations</h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="gold-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-woodly-card border border-woodly-border p-8 rounded-3xl text-center space-y-2">
                <MapPin className="w-8 h-8 text-woodly-gold mx-auto" />
                <p className="text-xs text-gray-400">No saved addresses found. Add a shipping address for 1-click checkout.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-2 text-xs text-center flex flex-col items-center justify-center">
                    <span className="font-bold text-woodly-gold bg-woodly-gold/10 px-2.5 py-0.5 rounded-lg border border-woodly-gold/20">
                      {addr.label || 'Home'}
                    </span>
                    <p className="text-white font-bold">{addr.street}</p>
                    <p className="text-gray-400">{addr.city}, {addr.state} - {addr.postalCode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Centered Tab 3: Security */}
        {activeTab === 'security' && (
          <div className="bg-woodly-card border border-woodly-border p-8 rounded-3xl max-w-md mx-auto space-y-6 text-center shadow-xl">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-woodly-border pb-3 flex items-center justify-center space-x-2">
              <Lock className="w-4 h-4 text-woodly-gold" />
              <span>Update Account Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs text-center">
              <div>
                <label className="text-gray-300 font-bold block mb-1 text-center">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center focus:border-woodly-gold"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1 text-center">New Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center focus:border-woodly-gold"
                />
              </div>

              <button type="submit" className="w-full gold-btn py-3.5 rounded-xl font-extrabold uppercase shadow-goldGlow">
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Centered Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-woodly-card border border-woodly-gold p-6 rounded-3xl max-w-md w-full space-y-4 text-center">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-woodly-border pb-3">
              New Shipping Address
            </h3>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Street Address / House No."
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                required
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center"
                />
              </div>
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                required
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white text-center"
              />

              <div className="flex space-x-3 pt-2">
                <button type="submit" className="flex-1 gold-btn py-3 rounded-xl font-bold">Save Address</button>
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-5 py-3 bg-woodly-bg border border-woodly-border text-gray-300 rounded-xl font-bold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
