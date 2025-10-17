import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { PWAProvider } from './context/PWAContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BottomNavigation from './components/common/BottomNavigation';
import MobileMenu from './components/common/MobileMenu';
import Toast from './components/common/Toast';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MultiStepCheckout from './components/checkout/MultiStepCheckout';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersManagement from './pages/admin/AdminUsersManagement';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminProductManagement from './pages/admin/AdminProductManagement';
import AdminOrderManagement from './pages/admin/AdminOrderManagement';
import AdminCategoryManagement from './pages/admin/AdminCategoryManagement';
import AdminCouponManagement from './pages/admin/AdminCouponManagement';
import AdminContentManagement from './pages/admin/AdminContentManagement';
import AdminReports from './pages/admin/AdminReports';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import RecentlyViewedPage from './pages/RecentlyViewedPage';
import NotificationsPage from './pages/NotificationsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductComparisonPage from './pages/ProductComparisonPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import CreatorRoute from './components/common/CreatorRoute';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <ComparisonProvider>
                <RecentlyViewedProvider>
                  <PWAProvider>
                    <Router>
                      <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <MobileMenu />
                        <main className="flex-grow">
                          <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/checkout/steps" element={<MultiStepCheckout />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/search" element={<SearchResultsPage />} />
                            <Route path="/compare" element={<ProductComparisonPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            
                            {/* Protected routes */}
                            <Route path="/profile" element={
                              <ProtectedRoute>
                                <ProfilePage />
                              </ProtectedRoute>
                            } />
                            <Route path="/profile/orders" element={
                              <ProtectedRoute>
                                <OrderHistoryPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/profile/orders/:id" element={
                              <ProtectedRoute>
                                <OrderDetailPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/wishlist" element={
                              <ProtectedRoute>
                                <WishlistPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/recently-viewed" element={
                              <ProtectedRoute>
                                <RecentlyViewedPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/notifications" element={
                              <ProtectedRoute>
                                <NotificationsPage />
                              </ProtectedRoute>
                            } />
                            
                            {/* Creator routes */}
                            <Route path="/creator/dashboard" element={
                              <CreatorRoute>
                                <CreatorDashboard />
                              </CreatorRoute>
                            } />
                            
                            {/* Admin routes */}
                            <Route path="/admin/dashboard" element={
                              <AdminRoute>
                                <AdminDashboard />
                              </AdminRoute>
                            } />
                            <Route path="/admin/users" element={
                              <AdminRoute>
                                <AdminUsersManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/users/:id" element={
                              <AdminRoute>
                                <AdminUserDetails />
                              </AdminRoute>
                            } />
                            <Route path="/admin/products" element={
                              <AdminRoute>
                                <AdminProductManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/orders" element={
                              <AdminRoute>
                                <AdminOrderManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/categories" element={
                              <AdminRoute>
                                <AdminCategoryManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/coupons" element={
                              <AdminRoute>
                                <AdminCouponManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/content" element={
                              <AdminRoute>
                                <AdminContentManagement />
                              </AdminRoute>
                            } />
                            <Route path="/admin/reports" element={
                              <AdminRoute>
                                <AdminReports />
                              </AdminRoute>
                            } />
                            <Route path="/admin/settings" element={
                              <AdminRoute>
                                <AdminSiteSettings />
                              </AdminRoute>
                            } />
                            
                            {/* 404 route */}
                            <Route path="*" element={<NotFoundPage />} />
                          </Routes>
                        </main>
                        <Footer />
                        <BottomNavigation />
                        <Toast />
                      </div>
                    </Router>
                  </PWAProvider>
                </RecentlyViewedProvider>
              </ComparisonProvider>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;