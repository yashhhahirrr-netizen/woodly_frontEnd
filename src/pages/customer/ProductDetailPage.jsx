import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCw,
  Award,
  Check,
  Store,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import ImageZoom from '../../components/common/ImageZoom';
import Viewer360 from '../../components/common/Viewer360';
import ProductCard from '../../components/common/ProductCard';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import API from '../../services/api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [show360Modal, setShow360Modal] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.product);
      setRelatedProducts(res.data.relatedProducts || []);
      if (res.data.product?.images?.length > 0) {
        setSelectedImage(res.data.product.images[0]);
      }
    } catch (err) {
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: selectedQuantity }));
    toast.success(`Added ${selectedQuantity} item(s) to cart!`, {
      style: { background: '#1E1E1E', color: '#FFC107', border: '1px solid #FFC107' },
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await API.post('/reviews', {
        productId: id,
        rating: newRating,
        comment: newComment,
      });
      toast.success('Thank you for your review!');
      setNewComment('');
      fetchReviews();
      fetchProductDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-woodly-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading handcrafted furniture details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        <span>Home</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span>{product.category?.name || 'Furniture'}</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-white font-bold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery & 360 Viewer */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden border border-woodly-border">
            <ImageZoom src={selectedImage || product.images[0]} alt={product.title} />

            {/* 360 Trigger Button */}
            {product.images360?.length > 0 && (
              <button
                onClick={() => setShow360Modal(!show360Modal)}
                className="absolute bottom-4 right-4 bg-woodly-gold text-black font-bold text-xs px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform"
              >
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Launch 360° Viewer</span>
              </button>
            )}
          </div>

          {/* Thumbnail Selector */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImage === img ? 'border-woodly-gold scale-105 shadow-goldGlow' : 'border-woodly-border opacity-70'
                  }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* 360 Rotator Modal / Container */}
          {show360Modal && (
            <div className="mt-4">
              <Viewer360 images={product.images360} />
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 text-xs mb-2">
              <span className="bg-woodly-gold/20 text-woodly-gold font-bold px-2.5 py-0.5 rounded uppercase">
                {product.material}
              </span>
              <div className="flex items-center space-x-1 text-woodly-gold font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingsAverage}</span>
                <span className="text-gray-400 font-normal">({product.ratingsCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">{product.title}</h1>
            <p className="text-xs text-gray-400 mt-1">SKU: <span className="text-white font-mono">{product.sku}</span></p>
          </div>

          {/* Pricing Box */}
          <div className="bg-woodly-card border border-woodly-border p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white">
                ₹{product.offerPrice.toLocaleString('en-IN')}
              </div>
              {product.discountPercentage > 0 && (
                <div className="flex items-center space-x-2 text-xs mt-0.5">
                  <span className="text-gray-500 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="bg-woodly-gold text-black font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                    SAVE {product.discountPercentage}%
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                ✓ Ready for Shipping
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Est. Delivery in 3-5 Business Days</p>
            </div>
          </div>

          {/* Seller Shop Card */}
          {product.shop && (
            <div className="bg-woodly-card/60 border border-woodly-border p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="w-6 h-6 text-woodly-gold" />
                <div>
                  <span className="text-xs text-gray-400">Sold by Verified Artisan</span>
                  <h4 className="text-xs font-bold text-white">{product.shop.name}</h4>
                </div>
              </div>
              <span className="text-xs font-bold text-woodly-gold border border-woodly-gold/30 px-3 py-1 rounded-full">
                ★ {product.shop.rating} Seller Score
              </span>
            </div>
          )}

          {/* Dimensions & Material Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-woodly-card border border-woodly-border p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Length</span>
              <span className="font-bold text-white">{product.dimensions?.length || 180} cm</span>
            </div>
            <div className="bg-woodly-card border border-woodly-border p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Width</span>
              <span className="font-bold text-white">{product.dimensions?.width || 90} cm</span>
            </div>
            <div className="bg-woodly-card border border-woodly-border p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Height</span>
              <span className="font-bold text-white">{product.dimensions?.height || 75} cm</span>
            </div>
            <div className="bg-woodly-card border border-woodly-border p-2.5 rounded-xl">
              <span className="text-gray-400 block text-[10px]">Weight</span>
              <span className="font-bold text-white">{product.weight || 45} kg</span>
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-woodly-border rounded-xl bg-woodly-card">
                <button
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-white">{selectedQuantity}</span>
                <button
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="gold-btn py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="bg-white hover:bg-gray-100 text-black py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <div className="space-y-8 pt-8 border-t border-woodly-border">
        <h2 className="text-xl font-extrabold text-white">Verified Customer Reviews ({reviews.length})</h2>

        {/* Review Submission Form */}
        <form onSubmit={handleReviewSubmit} className="bg-woodly-card border border-woodly-border p-6 rounded-2xl space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">Write a Product Review</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className={`text-lg ${star <= newRating ? 'text-woodly-gold' : 'text-gray-600'}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            rows="3"
            placeholder="Share your feedback regarding comfort, timber quality, and finish..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
          />
          <button type="submit" className="gold-btn px-6 py-2 rounded-xl text-xs font-bold">
            Submit Verified Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-woodly-card/60 border border-woodly-border p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{rev.user?.name || 'Verified Buyer'}</span>
                <span className="text-woodly-gold font-bold">★ {rev.rating}/5</span>
              </div>
              <p className="text-xs text-gray-300">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
