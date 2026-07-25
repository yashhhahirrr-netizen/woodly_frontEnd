import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { toggleCartDrawer, removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';

const CartDrawer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart);

  if (!isCartOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.offerPrice * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCartDrawer())}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-woodly-card border-l border-woodly-border text-white shadow-2xl flex flex-col justify-between p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-woodly-border pb-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-woodly-gold" />
              <h2 className="text-base font-extrabold">Shopping Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-gray-400">Your cart is currently empty</p>
                <button
                  onClick={() => {
                    dispatch(toggleCartDrawer());
                    navigate('/shop');
                  }}
                  className="gold-btn px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between space-x-3 bg-woodly-bg border border-woodly-border p-3 rounded-xl"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                    <p className="text-[10px] text-woodly-gold font-bold mt-0.5">
                      ₹{item.product.offerPrice.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center border border-woodly-border rounded-lg bg-woodly-card">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product._id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="px-2 py-0.5 text-xs text-gray-400 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.product._id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="px-2 py-0.5 text-xs text-gray-400 font-bold"
                      >
                        +
                      </button>
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
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {items.length > 0 && (
            <div className="border-t border-woodly-border pt-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-extrabold text-woodly-gold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    dispatch(toggleCartDrawer());
                    navigate('/cart');
                  }}
                  className="bg-woodly-bg border border-woodly-border hover:border-woodly-gold py-3 rounded-xl text-xs font-bold text-white"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    dispatch(toggleCartDrawer());
                    navigate('/checkout');
                  }}
                  className="gold-btn py-3 rounded-xl text-xs font-extrabold uppercase flex items-center justify-center space-x-1"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
