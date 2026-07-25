import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Crown, Mail, Lock, User, Phone, Store, UserCheck } from 'lucide-react';
import { loginSuccess } from '../../redux/slices/authSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/register', formData);
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      toast.success(res.data.message || 'Registration successful! Verification OTP sent.');
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      const res = await API.post('/auth/google', { credential: response.credential });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      toast.success(`Google Sign-In Successful! Welcome ${res.data.user.name}`, {
        style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
      });

      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'SUPPLIER') navigate('/supplier');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google Auth failed');
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '453560387977-vivqpoerkgl6ukapbpfead081qb5pvn7.apps.googleusercontent.com';

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });

        const btnContainer = document.getElementById('googleBtnContainerRegister');
        if (btnContainer && btnContainer.childElementCount === 0) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_black',
            size: 'large',
            width: 360,
            text: 'signup_with',
            shape: 'pill',
          });
        }
      }
    };

    renderGoogleBtn();
    const interval = setInterval(renderGoogleBtn, 500);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/verify-otp', { otp: otpInput });
      toast.success('Email verified successfully!');
      setShowOtpModal(false);
      navigate('/');
    } catch (err) {
      toast.error('Invalid OTP. Please check your email.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-woodly-gold/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold flex items-center justify-center text-black mx-auto shadow-goldGlow">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create <span className="text-woodly-gold">Woodly</span> Account</h2>
          <p className="text-xs text-gray-400">Join as a Customer or Verified Shop Owner Supplier</p>
        </div>

        {/* Real Official Google Native Signup Button */}
        <div className="w-full flex justify-center min-h-[44px]">
          <div id="googleBtnContainerRegister" className="w-full flex justify-center"></div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-woodly-border"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-bold uppercase">or email signup</span>
          <div className="flex-grow border-t border-woodly-border"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-woodly-bg border border-woodly-border rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'CUSTOMER' })}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                formData.role === 'CUSTOMER' ? 'bg-woodly-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'SUPPLIER' })}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                formData.role === 'SUPPLIER' ? 'bg-woodly-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Shop Owner</span>
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="Ananya Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Email Address</label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-btn py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-goldGlow"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        {/* OTP Modal Overlay */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-woodly-card border border-woodly-gold p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
              <h3 className="text-lg font-extrabold text-white">Email Verification OTP</h3>
              <p className="text-xs text-gray-300">Enter the 6-digit code sent to your registered email.</p>
              <input
                type="text"
                placeholder="123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full bg-woodly-bg border border-woodly-border text-center text-lg tracking-widest font-mono p-2.5 rounded-xl text-woodly-gold focus:border-woodly-gold"
              />
              <button onClick={handleVerifyOtp} className="w-full gold-btn py-2.5 rounded-xl text-xs font-bold">
                Verify OTP & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
