import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load cart on initial render and when user changes
  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  const addToCart = async (productId, variant, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please log in to add items to cart');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/cart/add', {
        productId,
        variant,
        quantity
      });
      setCart(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      setError('Please log in to update cart');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.put(`/cart/update/${itemId}`, {
        quantity
      });
      setCart(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error updating cart item:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      setError('Please log in to remove items from cart');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.delete(`/cart/remove/${itemId}`);
      setCart(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setError('Please log in to clear cart');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    if (!isAuthenticated) {
      setError('Please log in to apply coupon');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/cart/apply-coupon', {
        couponCode
      });
      setCart(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error applying coupon:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.totalItems || 0;
  const cartTotal = cart?.totalPrice || 0;

  const value = {
    cart,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;