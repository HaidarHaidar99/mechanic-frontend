import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageMessages from './pages/admin/ManageMessages';
import ManageSettings from './pages/admin/ManageSettings';
import Profile from './pages/admin/Profile';
import ManageAdmins from './pages/admin/ManageAdmins';

// i18n Loader
import './i18n';

// Protected Route Wrapper
function ProtectedRoute({ children, requireSuper }) {
  const { admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#121214]">
        <div className="text-sm font-semibold text-gray-500 animate-pulse">
          Verifying security credentials...
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  if (requireSuper && admin.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AdminAuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <Routes>
                  
                  {/* Public Customer Facing Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<Favorites />} />
                  </Route>

                  {/* Admin Auth Route */}
                  <Route path="/admin" element={<AdminLogin />} />

                  {/* Protected Admin Console Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="messages" element={<ManageMessages />} />
                    <Route path="settings" element={<ManageSettings />} />
                    <Route path="profile" element={<Profile />} />
                    
                    {/* Super Admin Restricted Route */}
                    <Route 
                      path="admins" 
                      element={
                        <ProtectedRoute requireSuper>
                          <ManageAdmins />
                        </ProtectedRoute>
                      } 
                    />
                  </Route>

                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AdminAuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
