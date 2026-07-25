import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = items.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingCost = subtotal > 50000 ? 0 : 1500;
  const grandTotal = Math.max(0, subtotal + tax + shippingCost - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await API.post('/coupons/validate', {
        code: couponCode,
        cartTotal: subtotal,
      });
      setAppliedCoupon(res.data.coupon);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-woodly-card border border-woodly-border flex items-center justify-center mx-auto text-woodly-gold">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Explore our handcrafted luxury furniture collections and add your favorite solid teak pieces.
        </p>
        <Link to="/shop" className="gold-btn inline-flex px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
          Explore Catalog Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-woodly-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Shopping <span className="text-woodly-gold">Cart</span> ({items.length} items)
        </h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-red-400 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-woodly-card border border-woodly-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-xl object-cover border border-woodly-border shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.product.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Material: {item.product.material}</p>
                  <span className="text-xs font-bold text-woodly-gold block mt-1">
                    ₹{item.product.offerPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                <div className="flex items-center border border-woodly-border rounded-xl bg-woodly-bg">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="px-3 py-1 text-xs text-gray-400 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-white block">
                    ₹{(item.product.offerPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        productId: item.product._id,
                        selectedColor: item.selectedColor,
                      })
                    )
                  }
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Panel */}
        <div className="space-y-6">
          {/* Coupon Code Input */}
          <div className="bg-woodly-card border border-woodly-border p-5 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Tag className="w-4 h-4 text-woodly-gold" />
              <span>Have a Promo Coupon?</span>
            </label>
            <form onSubmit={handleApplyCoupon} className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. WOODLY10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-xs text-white uppercase focus:border-woodly-gold"
              />
              <button type="submit" className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold">
                Apply
              </button>
            </form>
            {appliedCoupon && (
              <div className="bg-woodly-gold/20 border border-woodly-gold/40 px-3 py-1.5 rounded-lg text-xs text-woodly-gold font-bold flex justify-between items-center">
                <span>Coupon '{appliedCoupon.code}' Applied!</span>
                <span>-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-woodly-border pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Items Subtotal</span>
                <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Estimated GST (18%)</span>
                <span className="font-bold text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>White-Glove Shipping</span>
                <span className="font-bold text-emerald-400">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-woodly-gold font-bold">
                  <span>Promo Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="border-t border-woodly-border pt-4 flex justify-between items-center">
              <span className="text-sm font-extrabold text-white uppercase">Grand Total</span>
              <span className="text-xl font-black text-woodly-gold">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full gold-btn py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-goldGlow"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
