import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Package, Check, X, Upload } from 'lucide-react';
import API from '../../services/api';
import { uploadFileToCloudinary } from '../../services/imageUploadService';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit Product
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: 0,
    material: 'Solid Teak Wood',
    color: 'Walnut Brown',
    stockQuantity: 10,
    category: '',
    images: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products/mine');
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error('Failed to load shop products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/products/categories');
      setCategories(res.data.categories || []);
      if (res.data.categories?.length > 0) {
        setFormData((prev) => ({ ...prev, category: res.data.categories[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const imageUrl = await uploadFileToCloudinary(file);
      setFormData((prev) => ({ ...prev, images: imageUrl }));
      toast.success('Photo uploaded to Cloudinary CDN!');
    } catch (err) {
      toast.error(err || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditProduct(prod);
      setFormData({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        discountPercentage: prod.discountPercentage || 0,
        material: prod.material,
        color: prod.color,
        stockQuantity: prod.stockQuantity,
        category: prod.category?._id || prod.category,
        images: prod.images?.[0] || '',
      });
    } else {
      setEditProduct(null);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        stockQuantity: Number(formData.stockQuantity),
        images: [formData.images],
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      if (editProduct) {
        await API.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', payload);
        toast.success('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this furniture listing?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-woodly-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manage <span className="text-woodly-gold">Shop Inventory</span></h1>
          <p className="text-xs text-gray-400">Add, edit, or upload real furniture photos to your shop</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="gold-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-woodly-card border border-woodly-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-woodly-bg border-b border-woodly-border uppercase text-woodly-gold font-bold">
              <tr>
                <th className="p-4">Furniture Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Offer</th>
                <th className="p-4">Stock Qty</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-woodly-border">
              {products.map((prod) => (
                <tr key={prod._id} className="hover:bg-black/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-white max-w-xs truncate">{prod.title}</h4>
                      <p className="text-gray-400 text-[10px]">SKU: {prod.sku}</p>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-white">{prod.category?.name || 'Furniture'}</td>
                  <td className="p-4 font-extrabold text-woodly-gold">₹{prod.offerPrice?.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-bold text-white">{prod.stockQuantity}</td>
                  <td className="p-4">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                      APPROVED
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(prod)}
                      className="p-1.5 bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-woodly-gold rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-1.5 bg-woodly-bg border border-woodly-border hover:border-red-500 text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with Real Cloudinary File Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-woodly-card border border-woodly-gold p-6 rounded-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-woodly-border pb-3">
              <h3 className="text-lg font-extrabold text-white">
                {editProduct ? 'Edit Furniture Listing' : 'Add New Furniture Listing'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                />
              </div>

              {/* Real Cloudinary Image File Upload */}
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Upload Product Photo to Cloudinary CDN</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cloudinary-upload-input"
                  />
                  <label
                    htmlFor="cloudinary-upload-input"
                    className="cursor-pointer bg-woodly-bg border border-woodly-border hover:border-woodly-gold text-woodly-gold px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading to CDN...' : 'Choose Local File'}</span>
                  </label>
                  {formData.images && (
                    <img src={formData.images} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-woodly-gold" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                    className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full bg-woodly-bg border border-woodly-border rounded-xl p-2.5 text-white focus:border-woodly-gold"
                />
              </div>

              <button type="submit" className="w-full gold-btn py-3 rounded-xl font-bold uppercase tracking-wider">
                {editProduct ? 'Save Changes' : 'Create Product Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
