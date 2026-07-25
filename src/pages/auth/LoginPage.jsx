import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Crown, Mail, Lock, LogIn } from 'lucide-react';
import { loginSuccess } from '../../redux/slices/authSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      toast.success(`Welcome back, ${res.data.user.name}!`, {
        style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
      });

      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'SUPPLIER') navigate('/supplier');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
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
      toast.error(err.response?.data?.message || 'Google Authentication failed');
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '453560387977-vivqpoerkgl6ukapbpfead081qb5pvn7.apps.googleusercontent.com';

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false,
        });

        const btnContainer = document.getElementById('googleBtnContainer');
        if (btnContainer && btnContainer.childElementCount === 0) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'filled_black',
            size: 'large',
            width: 360,
            text: 'continue_with',
            shape: 'pill',
          });
        }
      }
    };

    renderGoogleBtn();
    const interval = setInterval(renderGoogleBtn, 500);
    return () => clearInterval(interval);
  }, []);

  const triggerGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Auth script loading... Please wait a moment');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-woodly-gold/30 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-woodly-gold flex items-center justify-center text-black mx-auto shadow-goldGlow">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to <span className="text-woodly-gold">Woodly</span></h2>
          <p className="text-xs text-gray-400">Access your enterprise furniture marketplace portal</p>
        </div>

        {/* Real Official Google OAuth Button Container */}
        <div className="space-y-3 flex flex-col items-center">
          <div id="googleBtnContainer" className="w-full flex justify-center min-h-[44px]"></div>

        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-woodly-border"></div>
          <span className="flex-shrink mx-4 text-[10px] text-gray-500 font-bold uppercase">or email</span>
          <div className="flex-grow border-t border-woodly-border"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-woodly-bg border border-woodly-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-btn py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-goldGlow"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-woodly-gold font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
