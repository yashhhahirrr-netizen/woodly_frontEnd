import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import API from '../../services/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const isFeaturedParam = searchParams.get('isFeatured') || '';

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [keywordParam, selectedCategory, minPrice, maxPrice, selectedMaterial, selectedColor, minRating, sortBy, isFeaturedParam]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/products/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `/products?sort=${sortBy}`;
      if (keywordParam) query += `&keyword=${encodeURIComponent(keywordParam)}`;
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat) query += `&category=${cat._id}`;
      }
      if (minPrice) query += `&minPrice=${minPrice}`;
      if (maxPrice) query += `&maxPrice=${maxPrice}`;
      if (selectedMaterial) query += `&material=${encodeURIComponent(selectedMaterial)}`;
      if (selectedColor) query += `&color=${encodeURIComponent(selectedColor)}`;
      if (minRating) query += `&minRating=${minRating}`;
      if (isFeaturedParam) query += `&isFeatured=true`;

      const res = await API.get(query);
      setProducts(res.data.products || []);
      setTotalCount(res.data.total || res.data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSelectedColor('');
    setMinRating('');
    setSortBy('newest');
    setSearchParams({});
  };

  const materialsList = ['Solid Teak Wood', 'White Oak', 'Sheesham Wood', 'Italian Velvet', 'Leather'];
  const colorsList = ['Walnut Brown', 'Royal Amber Gold', 'Natural Oak', 'Honey Oak', 'Matte Charcoal Black'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-woodly-card border border-woodly-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Furniture <span className="text-woodly-gold">Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {keywordParam ? `Search results for "${keywordParam}"` : 'Browse enterprise luxury furniture collections'}
          </p>
        </div>
        <div className="bg-woodly-bg border border-woodly-border px-4 py-2 rounded-xl text-xs font-bold text-woodly-gold flex items-center space-x-2">
          <span>{totalCount} Products Found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="space-y-6 bg-woodly-card border border-woodly-border p-6 rounded-2xl h-fit">
          <div className="flex items-center justify-between border-b border-woodly-border pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-woodly-gold" />
              <span>Filter Products</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-woodly-gold hover:underline flex items-center space-x-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Price Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-woodly-bg border border-woodly-border rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-woodly-bg border border-woodly-border rounded-lg p-2 text-xs text-white placeholder-gray-500 focus:border-woodly-gold"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Category</label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  !selectedCategory ? 'bg-woodly-gold/20 text-woodly-gold font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-woodly-gold/20 text-woodly-gold font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Material Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Material</label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedMaterial('')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  !selectedMaterial ? 'bg-woodly-gold/20 text-woodly-gold font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Materials
              </button>
              {materialsList.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedMaterial === mat
                      ? 'bg-woodly-gold/20 text-woodly-gold font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Minimum Rating</label>
            <div className="space-y-1 text-xs">
              {[4.5, 4.0, 3.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(rate.toString())}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    minRating === rate.toString()
                      ? 'bg-woodly-gold/20 text-woodly-gold font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ★ {rate} & Above
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Catalog Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="bg-woodly-card border border-woodly-border p-3.5 rounded-xl flex items-center justify-between text-xs">
            <span className="text-gray-400">Showing <span className="text-white font-bold">{products.length}</span> items</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-woodly-bg border border-woodly-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-woodly-gold"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-woodly-card h-80 rounded-2xl animate-pulse border border-woodly-border" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-woodly-card border border-woodly-border rounded-2xl p-12 text-center space-y-4">
              <p className="text-gray-400 text-sm">No furniture found matching your selected criteria.</p>
              <button onClick={handleResetFilters} className="gold-btn px-6 py-2 rounded-full text-xs font-bold">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
