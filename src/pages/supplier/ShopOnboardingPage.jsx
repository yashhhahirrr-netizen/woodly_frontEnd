import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Upload, CheckCircle2, ShieldCheck, Building2, MapPin, CreditCard } from 'lucide-react';
import API from '../../services/api';
import { uploadFileToCloudinary } from '../../services/imageUploadService';
import toast from 'react-hot-toast';

import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/slices/authSlice';

const ShopOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gstNumber: '',
    logo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    },
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setFormData((prev) => ({ ...prev, logo: url }));
      toast.success('Shop Logo uploaded to Cloudinary CDN!');
    } catch (err) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const url = await uploadFileToCloudinary(file);
      setFormData((prev) => ({ ...prev, banner: url }));
      toast.success('Shop Banner uploaded to Cloudinary CDN!');
    } catch (err) {
      toast.error('Failed to upload banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);

    try {
      const res = await API.post('/shops', formData);
      dispatch(updateUserProfile({ role: 'SUPPLIER' }));
      toast.success('Shop created successfully! Redirecting to dashboard...', {
        style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
      });
      setTimeout(() => {
        navigate('/supplier');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-woodly-gold flex items-center justify-center text-black mx-auto shadow-goldGlow">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create Your Furniture <span className="text-woodly-gold">Seller Shop</span></h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Set up your shop profile, upload branding photos, and start selling handcrafted furniture across India.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-woodly-card border border-woodly-border p-8 rounded-3xl space-y-6">
        {/* Step 1: Basic Shop Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-woodly-border pb-3">
            <Building2 className="w-4 h-4 text-woodly-gold" />
            <span>1. Shop Identity & Business Info</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-bold block mb-1">Shop Name *</label>
              <input
                type="text"
                placeholder="e.g. Royal Heritage Teak Studio"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">GST Registration Number</label>
              <input
                type="text"
                placeholder="e.g. 27AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-bold block text-xs mb-1">Shop Description</label>
            <textarea
              rows="3"
              placeholder="Describe your furniture specialties, teak wood sources, and craftsmanship experience..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-xs text-white focus:border-woodly-gold"
            />
          </div>
        </div>

        {/* Step 2: Branding Media Uploads */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-woodly-border pb-3">
            <Upload className="w-4 h-4 text-woodly-gold" />
            <span>2. Shop Logo & Cover Banner Uploads</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-gray-300 font-bold block">Shop Logo</label>
              <div className="flex items-center space-x-3">
                <img src={formData.logo} alt="Logo" className="w-16 h-16 rounded-2xl object-cover border border-woodly-gold" />
                <div>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-input" />
                  <label htmlFor="logo-input" className="cursor-pointer bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-woodly-gold px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="text-gray-300 font-bold block">Shop Cover Banner</label>
              <div className="flex items-center space-x-3">
                <img src={formData.banner} alt="Banner" className="w-24 h-16 rounded-xl object-cover border border-woodly-border" />
                <div>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" id="banner-input" />
                  <label htmlFor="banner-input" className="cursor-pointer bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-woodly-gold px-3 py-2 rounded-xl font-bold flex items-center space-x-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingBanner ? 'Uploading...' : 'Upload Banner'}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Location & Payout Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-woodly-border pb-3">
            <CreditCard className="w-4 h-4 text-woodly-gold" />
            <span>3. Address & Bank Payout Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-bold block mb-1">City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank"
                value={formData.bankDetails.bankName}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bankName: e.target.value } })}
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">Account Number</label>
              <input
                type="text"
                placeholder="11-digit account number"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full gold-btn py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-goldGlow"
        >
          {loading ? 'Creating Shop Profile...' : 'Submit & Launch My Shop'}
        </button>
      </form>
    </div>
  );
};

export default ShopOnboardingPage;
