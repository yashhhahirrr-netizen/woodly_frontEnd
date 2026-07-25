import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`, {
      style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
    });
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    if (isWishlisted) {
      toast.error('Removed from wishlist');
    } else {
      toast.success('Saved to wishlist');
    }
  };

  return (
    <div className="group bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden hover:border-woodly-gold/60 transition-all duration-300 flex flex-col justify-between hover:shadow-goldGlow">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-woodly-gold text-black font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Floating Quick Action Overlay Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? 'bg-woodly-gold text-black shadow-lg'
                : 'bg-black/60 text-white hover:bg-woodly-gold hover:text-black'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <Link
            to={`/product/${product._id}`}
            className="p-2 rounded-full bg-black/60 text-white hover:bg-woodly-gold hover:text-black backdrop-blur-md transition-all"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Material Tag */}
        {product.material && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-gray-300 text-[10px] px-2 py-0.5 rounded border border-white/10">
            {product.material}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="truncate">{product.category?.name || 'Furniture'}</span>
            <div className="flex items-center space-x-1 text-woodly-gold font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.ratingsAverage || 4.8}</span>
              <span className="text-gray-500 font-normal">({product.ratingsCount || 12})</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-bold text-white group-hover:text-woodly-gold transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price and Cart Button */}
        <div className="pt-2 border-t border-woodly-border/60 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-white">
              ₹{(product.offerPrice || product.price).toLocaleString('en-IN')}
            </div>
            {product.discountPercentage > 0 && (
              <div className="text-xs text-gray-500 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="gold-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
