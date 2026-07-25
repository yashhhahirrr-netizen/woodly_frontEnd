import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderHistoryPage from './pages/customer/OrderHistoryPage';
import WishlistPage from './pages/customer/WishlistPage';
import ShopDetailPage from './pages/customer/ShopDetailPage';
import ShopsListPage from './pages/customer/ShopsListPage';
import ProfilePage from './pages/customer/ProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Supplier Pages
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import ManageProducts from './pages/supplier/ManageProducts';
import ManageOrders from './pages/supplier/ManageOrders';
import ShopOnboardingPage from './pages/supplier/ShopOnboardingPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ShopApprovals from './pages/admin/ShopApprovals';
import UserManagement from './pages/admin/UserManagement';
import AuditLogs from './pages/admin/AuditLogs';

function App() {
  return (
    <div className="min-h-screen bg-woodly-bg text-white flex flex-col justify-between selection:bg-woodly-gold selection:text-black">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shops" element={<ShopsListPage />} />
          <Route path="/store/:id" element={<ShopDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPPLIER', 'ADMIN']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPPLIER', 'ADMIN']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPPLIER', 'ADMIN']}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Supplier Routes */}
          <Route
            path="/create-shop"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPPLIER', 'ADMIN']}>
                <ShopOnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier"
            element={
              <ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']}>
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/products"
            element={
              <ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']}>
                <ManageProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/orders"
            element={
              <ProtectedRoute allowedRoles={['SUPPLIER', 'ADMIN']}>
                <ManageOrders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/shops"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ShopApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
