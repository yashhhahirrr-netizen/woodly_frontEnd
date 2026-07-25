import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Truck, Lock } from 'lucide-react';
import { clearCart } from '../../redux/slices/cartSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '402 Luxury Heights, Bandra West',
    city: user?.addresses?.[0]?.city || 'Mumbai',
    state: user?.addresses?.[0]?.state || 'Maharashtra',
    postalCode: user?.addresses?.[0]?.postalCode || '400050',
    country: 'India',
    phone: user?.phone || '+91 9876543210',
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // STRIPE, RAZORPAY, COD
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shippingCost = subtotal > 50000 ? 0 : 1500;
  const totalAmount = subtotal + tax + shippingCost;

  // Load Razorpay Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product._id,
          shop: item.product.shop?._id || item.product.shop,
          title: item.product.title,
          image: item.product.images[0],
          price: item.product.offerPrice,
          quantity: item.quantity,
          color: item.selectedColor || item.product.color,
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal,
        tax,
        shippingCost,
        discount: 0,
        totalAmount,
      };

      if (paymentMethod === 'RAZORPAY') {
        // Real Razorpay SDK Modal Execution
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Razorpay SDK failed to load. Please check internet connection.');
          setIsSubmitting(false);
          return;
        }

        const res = await API.post('/orders/create-razorpay-order', { amount: totalAmount });
        const { key, razorpayOrder } = res.data;

        const options = {
          key: key || 'rzp_test_THfxZMNJPrRsr4',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Woodly Furniture Marketplace',
          description: `Order Payment for ${items.length} items`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // Verify Signature
              await API.post('/orders/verify-razorpay', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              // Create Order Record
              await API.post('/orders', {
                ...orderPayload,
                paymentMethod: 'RAZORPAY',
                transactionId: response.razorpay_payment_id,
              });

              dispatch(clearCart());
              toast.success('Razorpay Payment Successful! Order Placed.', {
                style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
              });
              navigate('/orders');
            } catch (err) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: address.phone,
          },
          theme: {
            color: '#FFC107',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setIsSubmitting(false);
        return;
      } else {
        // Cash on Delivery
        await API.post('/orders', { ...orderPayload, paymentMethod: 'COD' });
        dispatch(clearCart());
        toast.success('Order placed successfully via Cash on Delivery!');
        navigate('/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <Lock className="w-6 h-6 text-woodly-gold" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Production <span className="text-woodly-gold">Payment Checkout</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Step */}
          <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-woodly-border pb-3">
              <MapPin className="w-5 h-5 text-woodly-gold" />
              <span>1. Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Postal Code</label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-white focus:border-woodly-gold"
                />
              </div>
            </div>
          </div>

          {/* Real Payment Method Switcher */}
          <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-woodly-border pb-3">
              <CreditCard className="w-5 h-5 text-woodly-gold" />
              <span>2. Select Live Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-woodly-gold bg-woodly-gold/10 shadow-goldGlow'
                    : 'border-woodly-border bg-woodly-bg hover:border-gray-500'
                }`}
              >
                <span className="text-xs font-bold text-white block">Razorpay Payment Gateway</span>
                <span className="text-[10px] text-woodly-gold font-semibold">UPI, GPay, PhonePe, Cards, NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-woodly-gold bg-woodly-gold/10 shadow-goldGlow'
                    : 'border-woodly-border bg-woodly-bg hover:border-gray-500'
                }`}
              >
                <span className="text-xs font-bold text-white block">Cash on Delivery (COD)</span>
                <span className="text-[10px] text-gray-400">Pay upon doorstep assembly</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary & Execution */}
        <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-6 h-fit">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-woodly-border pb-3">
            Summary ({items.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-gray-300 truncate max-w-[180px]">
                  {item.quantity}x {item.product.title}
                </span>
                <span className="font-bold text-white">
                  ₹{(item.product.offerPrice * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-woodly-border pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>GST Tax (18%)</span>
              <span className="text-white font-bold">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-bold">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="flex justify-between text-white font-extrabold text-sm border-t border-woodly-border pt-3">
              <span>Total Amount</span>
              <span className="text-woodly-gold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full gold-btn py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-goldGlow disabled:opacity-50"
          >
            {isSubmitting ? 'Opening Gateway...' : `Pay ₹${totalAmount.toLocaleString('en-IN')} via ${paymentMethod}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
