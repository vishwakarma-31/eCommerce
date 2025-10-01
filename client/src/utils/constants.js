// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PRODUCTS: '/products',
  PREORDERS: '/preorders',
  ORDERS: '/orders',
  CART: '/cart',
  REVIEWS: '/reviews',
  COMMENTS: '/comments',
  CATEGORIES: '/categories',
  CREATOR: '/creator',
  ADMIN: '/admin'
};

// User Roles
export const USER_ROLES = {
  GUEST: 'Guest',
  BACKER: 'Backer',
  CREATOR: 'Creator',
  ADMIN: 'Admin'
};

// Product Statuses
export const PRODUCT_STATUSES = {
  FUNDING: 'Funding',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed',
  IN_PRODUCTION: 'InProduction',
  MARKETPLACE: 'Marketplace',
  OUT_OF_STOCK: 'OutOfStock',
  DISCONTINUED: 'Discontinued'
};

// Order Statuses
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
};

// PreOrder Statuses
export const PREORDER_STATUSES = {
  AUTHORIZED: 'Authorized',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  PAYPAL: 'PayPal',
  STRIPE: 'Stripe'
};

// Sort Options
export const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  AVERAGE_RATING: 'averageRating',
  VIEWS: 'views',
  CURRENT_FUNDING: 'currentFunding'
};

// Sort Orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist'
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Logged in successfully',
    REGISTER: 'Account created successfully',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATE: 'Profile updated successfully',
    PRODUCT_CREATE: 'Product created successfully',
    PRODUCT_UPDATE: 'Product updated successfully',
    PRODUCT_DELETE: 'Product deleted successfully',
    ORDER_CREATE: 'Order placed successfully',
    ORDER_CANCEL: 'Order cancelled successfully'
  },
  ERROR: {
    LOGIN: 'Invalid email or password',
    REGISTER: 'Failed to create account',
    PROFILE_UPDATE: 'Failed to update profile',
    PRODUCT_CREATE: 'Failed to create product',
    PRODUCT_UPDATE: 'Failed to update product',
    PRODUCT_DELETE: 'Failed to delete product',
    ORDER_CREATE: 'Failed to place order',
    ORDER_CANCEL: 'Failed to cancel order',
    NETWORK: 'Network error. Please try again.'
  }
};