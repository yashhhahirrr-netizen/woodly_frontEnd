import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ArrowRight, ShieldCheck, Star, Award, RotateCw } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import Viewer360 from '../../components/common/Viewer360';
import API from '../../services/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products?isFeatured=true&limit=8');
        setFeaturedProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    {
      name: 'Living Room',
      slug: 'living-room',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      tagline: 'Chesterfield Sofas & Recliners',
    },
    {
      name: 'Bedroom',
      slug: 'bedroom',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
      tagline: 'Solid Oak & Teak Beds',
    },
    {
      name: 'Dining & Kitchen',
      slug: 'dining-room',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
      tagline: '6 & 8-Seater Dining Sets',
    },
    {
      name: 'Office & Study',
      slug: 'office-study',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
      tagline: 'Ergonomic Desk & Workstations',
    },
  ];

  return (
    <main className="space-y-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center overflow-hidden border-b border-woodly-border" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80')` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-woodly-gold/15 border border-woodly-gold/40 px-3.5 py-1.5 rounded-full text-woodly-gold text-xs font-bold uppercase tracking-widest shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Enterprise Luxury Furniture Collection 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight">
              Crafting Timeless <span className="gold-gradient-text">Elegance</span> for Modern Living
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Explore 100% solid teak wood furniture, handcrafted Italian velvet sofas, and ergonomic office suites with white-glove doorstep assembly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/shop" className="gold-btn px-8 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-goldGlow hover:scale-105 transition-transform">
                <span>Explore Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/shop?isFeatured=true" className="bg-woodly-card border border-woodly-border hover:border-woodly-gold text-white px-7 py-4 rounded-full text-sm font-bold transition-all hover:scale-105">
                View Bestsellers
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
              <div>
                <span className="text-2xl font-extrabold text-woodly-gold">50,000+</span>
                <p className="text-xs text-gray-400">Homes Furnished</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-woodly-gold">10-Year</span>
                <p className="text-xs text-gray-400">Teak Wood Warranty</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-woodly-gold">4.9 ★</span>
                <p className="text-xs text-gray-400">Verified Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Floating Interactive 360 Feature Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="glass-panel p-6 rounded-3xl border border-woodly-gold/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-woodly-gold uppercase tracking-wider flex items-center space-x-1">
                  <Crown className="w-4 h-4" />
                  <span>360° Interactive Showcase</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">IN STOCK</span>
              </div>
              <Viewer360 />
              <div className="flex items-center justify-between text-xs text-gray-300 pt-2">
                <span className="font-bold">Verona Solid Teak Chesterfield Sofa</span>
                <span className="text-woodly-gold font-extrabold">₹71,999</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid with Scroll Animations */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Curated Furniture <span className="text-woodly-gold">Categories</span></h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Handpicked themes for every room in your residence</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-woodly-gold hover:underline flex items-center space-x-1">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative h-80 rounded-2xl overflow-hidden border border-woodly-border hover:border-woodly-gold transition-all duration-300 block shadow-lg hover:shadow-goldGlow"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-woodly-gold tracking-widest">{cat.tagline}</span>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-woodly-gold transition-colors">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products Catalog with Scroll Animations */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Trending <span className="text-woodly-gold">Masterpieces</span></h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Our highest rated, top-selling solid teak & oak designs</p>
          </div>
          <Link to="/shop" className="text-xs font-bold text-woodly-gold hover:underline flex items-center space-x-1">
            <span>Browse Full Catalog ({featuredProducts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-woodly-card h-80 rounded-2xl animate-pulse border border-woodly-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div key={product._id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Trust & Craftsmanship Guarantee Banner */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-woodly-gold/30 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-woodly-gold text-black flex items-center justify-center font-bold mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Solid Teak Wood</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every timber beam is seasoned for 6 months and treated for zero termite infestation.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-woodly-gold text-black flex items-center justify-center font-bold mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Pass Quality Audit</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Inspected by senior wood artisans before dispatch to ensure immaculate joinery and finish.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-woodly-gold text-black flex items-center justify-center font-bold mx-auto md:mx-0">
              <RotateCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">30-Day Money Back Guarantee</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              If your furniture isn't perfect, return it with zero hassle within 30 days.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default HomePage;
