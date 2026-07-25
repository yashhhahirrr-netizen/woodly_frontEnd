import React from 'react';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';

const WishlistPage = () => {
  const { items } = useSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-16 h-16 text-woodly-gold mx-auto" />
        <h2 className="text-xl font-extrabold text-white">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-400">Save your favorite furniture pieces while exploring our catalog.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
        My Saved <span className="text-woodly-gold">Wishlist</span> ({items.length} items)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
