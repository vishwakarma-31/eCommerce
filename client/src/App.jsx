import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProductComparisonPage = React.lazy(() => import('./pages/ProductComparisonPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('./pages/OrderDetailPage'));
const CreatorDashboard = React.lazy(() => import('./pages/CreatorDashboard'));
const CreateProductPage = React.lazy(() => import('./pages/CreateProductPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const LegalDocumentsPage = React.lazy(() => import('./pages/LegalDocumentsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Route components (not lazy loaded as they're needed for routing)
import PrivateRoute from './routes/PrivateRoute';
import CreatorRoute from './routes/CreatorRoute';
import AdminRoute from './routes/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <SearchProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <ErrorBoundary>
                    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader /></div>}>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/compare" element={<ProductComparisonPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/legal" element={<LegalDocumentsPage />} />
                        
                        {/* Legal routes */}
                        <Route path="/terms-of-service" element={<iframe src="/terms-of-service.html" title="Terms of Service" className="w-full h-screen" />} />
                        <Route path="/privacy-policy" element={<iframe src="/privacy-policy.html" title="Privacy Policy" className="w-full h-screen" />} />
                        <Route path="/refund-policy" element={<iframe src="/refund-policy.html" title="Refund Policy" className="w-full h-screen" />} />
                        <Route path="/creator-agreement" element={<iframe src="/creator-agreement.html" title="Creator Agreement" className="w-full h-screen" />} />
                        <Route path="/backer-agreement" element={<iframe src="/backer-agreement.html" title="Backer Agreement" className="w-full h-screen" />} />
                        <Route path="/cookie-policy" element={<iframe src="/cookie-policy.html" title="Cookie Policy" className="w-full h-screen" />} />
                        <Route path="/gdpr-compliance" element={<iframe src="/gdpr-compliance.html" title="GDPR Compliance" className="w-full h-screen" />} />
                        
                        {/* Private routes */}
                        <Route path="/profile" element={
                          <PrivateRoute>
                            <ProfilePage />
                          </PrivateRoute>
                        } />
                        <Route path="/wishlist" element={
                          <PrivateRoute>
                            <WishlistPage />
                          </PrivateRoute>
                        } />
                        <Route path="/cart" element={
                          <PrivateRoute>
                            <CartPage />
                          </PrivateRoute>
                        } />
                        <Route path="/checkout" element={
                          <PrivateRoute>
                            <CheckoutPage />
                          </PrivateRoute>
                        } />
                        <Route path="/orders" element={
                          <PrivateRoute>
                            <OrdersPage />
                          </PrivateRoute>
                        } />
                        <Route path="/order/:id" element={
                          <PrivateRoute>
                            <OrderDetailPage />
                          </PrivateRoute>
                        } />
                        
                        {/* Creator routes */}
                        <Route path="/creator/dashboard" element={
                          <CreatorRoute>
                            <CreatorDashboard />
                          </CreatorRoute>
                        } />
                        <Route path="/creator/products/new" element={
                          <CreatorRoute>
                            <CreateProductPage />
                          </CreatorRoute>
                        } />
                        
                        {/* Admin routes */}
                        <Route path="/admin/dashboard" element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        } />
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                <ToastContainer 
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </Router>
          </SearchProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;