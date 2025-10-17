# LaunchPad Market - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Frontend Components](#frontend-components)
10. [Backend Services](#backend-services)
11. [Testing](#testing)
12. [Deployment](#deployment)
13. [Performance Optimization](#performance-optimization)
14. [Security](#security)
15. [Troubleshooting](#troubleshooting)

## Project Overview

LaunchPad Market is a modern e-commerce platform with crowdfunding capabilities built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform allows creators to launch innovative products through crowdfunding campaigns and enables backers to support these projects. Once funded, products move to the marketplace where users can purchase them.

### Key Features
- **Crowdfunding Platform**: Creators can launch products in funding stage
- **Marketplace**: Backers can purchase successfully funded products
- **User Management**: Secure authentication and authorization system
- **Product Management**: Comprehensive product creation and management
- **Order Management**: Complete order processing and tracking
- **Payment Processing**: Multiple payment methods (Stripe, PayPal, COD)
- **Search & Filtering**: Advanced search capabilities
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Creator Dashboard**: Tools for product creators
- **Mobile Optimization**: Responsive design with PWA support

## Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Socket.io-client** for real-time communication
- **React Helmet Async** for SEO optimization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **PayPal** for alternative payment processing
- **Socket.io** for real-time features
- **Nodemailer** for email notifications
- **Cloudinary** for image hosting
- **Redis** for caching

### Database
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB

### Development Tools
- **dotenv** for environment variables
- **nodemon** for development server
- **ESLint** for code quality
- **Jest** for testing
- **Postman** for API testing

## Architecture

### System Architecture
The platform follows a client-server architecture with the following components:

1. **Frontend Client**: React application running in the browser
2. **Backend API**: Node.js/Express.js server providing RESTful APIs
3. **Database**: MongoDB for data persistence
4. **External Services**: Stripe, PayPal, Cloudinary, Email services

### Data Flow
1. User interacts with React frontend
2. Frontend makes API calls to backend
3. Backend processes requests and interacts with database
4. Backend returns data to frontend
5. Frontend updates UI based on response

### Folder Structure
```
launchpad-market/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main application component
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── emails/             # Email templates
│   └── index.js            # Server entry point
├── docs/                   # Documentation
└── README.md              # Project README
```

## Features

### User Authentication
- **Registration**: Email/password registration with validation
- **Login**: Secure login with JWT tokens
- **Password Reset**: Email-based password reset functionality
- **Email Verification**: Email verification for new accounts
- **Social Login**: (Future enhancement) Social media login options

### Product Management
- **Product Creation**: Creators can create products with detailed information
- **Product Variants**: Support for size, color, and material options
- **Product Status**: Funding, Successful, In Production, Marketplace statuses
- **Product Images**: Multiple image upload with Cloudinary
- **Product Search**: Advanced search with filters and sorting

### Crowdfunding
- **Pre-order System**: Backers can pre-order products in funding stage
- **Funding Goals**: Creators set funding goals for their products
- **Funding Timeline**: Time-limited funding campaigns
- **Payment Authorization**: Payments authorized but not captured until funding success

### Marketplace
- **Product Purchase**: Purchase products in Marketplace status
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite products for later
- **Recently Viewed**: Track recently viewed products
- **Product Comparison**: Compare up to 4 products side-by-side

### Order Management
- **Order Creation**: Create orders after successful payment
- **Order Tracking**: Track order status from processing to delivery
- **Order History**: View past orders with details
- **Order Cancellation**: Cancel orders in processing status
- **Returns & Refunds**: Request returns and process refunds

### Payment Processing
- **Stripe Integration**: Credit/debit card payments
- **PayPal Integration**: PayPal account payments
- **Cash on Delivery**: Payment at time of delivery
- **Payment Security**: PCI compliance through payment processors
- **Refund Management**: Automated refund processing

### Admin Dashboard
- **User Management**: View, suspend, activate, and delete users
- **Product Management**: Approve, edit, and manage products
- **Order Management**: View and update order statuses
- **Category Management**: Create and manage categories
- **Coupon Management**: Create and manage discount coupons
- **Content Management**: Manage banners, featured products, FAQ
- **Reporting**: Sales, product, and user analytics with export

### Creator Dashboard
- **Product Management**: Create and manage own products
- **Funding Analytics**: Track funding progress and backer information
- **Order Management**: View orders for own products
- **Performance Metrics**: Sales and product performance data

### Real-time Features
- **Notifications**: Real-time notifications for order updates
- **Live Chat**: (Future enhancement) Customer support chat
- **Order Updates**: Real-time order status updates
- **Stock Updates**: Real-time inventory updates

### Mobile Optimization
- **Responsive Design**: Mobile-first responsive layout
- **Touch Gestures**: Swipe, pull-to-refresh, and other touch interactions
- **PWA Support**: Progressive Web App capabilities
- **Mobile Navigation**: Bottom navigation and hamburger menu

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Git

### Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if local)
mongod

# Run server
npm run dev  # Development with nodemon
npm start    # Production
```

### Frontend Setup
```bash
cd client
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL

# Run development server
npm run dev

# Build for production
npm run build
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/launchpad-market
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Creator/Admin)
- `PUT /api/products/:id` - Update product (Creator/Admin)
- `DELETE /api/products/:id` - Delete product (Creator/Admin)

### Order Endpoints
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/:id/track` - Track order
- `GET /api/orders/:id/invoice` - Download invoice

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/profile` - Delete account

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // Guest, Backer, Creator, Admin
  avatar: String,
  addresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  preferences: {
    newsletter: Boolean,
    notifications: Boolean
  }
}
```

### Product Schema
```javascript
{
  title: String,
  description: String,
  shortDescription: String,
  images: [String],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  subcategory: String,
  brand: String,
  price: Number,
  discountPrice: Number,
  stockQuantity: Number,
  sku: String,
  status: String, // Funding, Successful, InProduction, Marketplace, OutOfStock, Discontinued
  tags: [String],
  features: [String],
  variants: [{
    size: String,
    color: String,
    material: String,
    stock: Number,
    price: Number,
    sku: String
  }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  fundingGoal: Number,
  currentFunding: Number,
  fundingDeadline: Date,
  soldQuantity: Number,
  averageRating: Number,
  reviewCount: Number
}
```

### Order Schema
```javascript
{
  buyer: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  paymentMethod: String,
  stripePaymentIntentId: String,
  paypalPaymentId: String,
  paymentStatus: String, // Pending, Completed, Failed, Refunded
  orderStatus: String, // Processing, Confirmed, Shipped, Delivered, Cancelled
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  returnRequested: Boolean,
  returnReason: String,
  returnRequestedAt: Date
}
```

## Frontend Components

### Core Components
- **Navbar**: Main navigation bar with search and user menu
- **Footer**: Site footer with links and information
- **ProductCard**: Display product information in grid/list view
- **CartItem**: Display cart item with quantity controls
- **OrderItem**: Display order information
- **ReviewCard**: Display product review
- **Pagination**: Pagination component for lists

### Page Components
- **HomePage**: Landing page with featured products
- **ProductsPage**: Product listing with filters
- **ProductDetailPage**: Detailed product view
- **CartPage**: Shopping cart management
- **CheckoutPage**: Order checkout process
- **ProfilePage**: User profile management
- **OrderHistoryPage**: User order history
- **WishlistPage**: User wishlist

### Admin Components
- **AdminDashboard**: Admin overview and statistics
- **AdminUsersManagement**: User management interface
- **AdminProductManagement**: Product management interface
- **AdminOrderManagement**: Order management interface
- **AdminCategoryManagement**: Category management interface
- **AdminCouponManagement**: Coupon management interface
- **AdminReports**: Analytics and reporting

## Backend Services

### Core Services
- **AuthService**: User authentication and authorization
- **ProductService**: Product business logic
- **OrderService**: Order processing and management
- **PaymentService**: Payment processing with Stripe and PayPal
- **EmailService**: Email sending and templates
- **SearchService**: Product search and filtering

### Utility Services
- **CloudinaryService**: Image upload and management
- **NotificationService**: User notifications
- **AnalyticsService**: Data analytics and reporting
- **CronService**: Scheduled tasks and jobs

## Testing

### Test Structure
```
__tests__/
├── backend/
│   ├── auth.test.js
│   ├── products.test.js
│   ├── orders.test.js
│   └── cart.test.js
├── frontend/
│   ├── components/
│   │   ├── ProductCard.test.jsx
│   │   └── CartItem.test.jsx
│   ├── pages/
│   │   └── Login.test.jsx
│   └── hooks/
│       └── useAuth.test.js
```

### Testing Commands
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Test coverage
npm run test:coverage
```

## Deployment

### Production Deployment
1. **Backend Deployment**:
   - Set NODE_ENV to production
   - Configure production database
   - Set up environment variables
   - Deploy to hosting service (Heroku, AWS, etc.)

2. **Frontend Deployment**:
   - Build production bundle: `npm run build`
   - Deploy to static hosting (Vercel, Netlify, etc.)
   - Configure environment variables

### CI/CD Pipeline
- **GitHub Actions** for automated testing and deployment
- **Docker** containers for consistent environments
- **Kubernetes** for container orchestration (future enhancement)

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Optimization**: Minification and tree shaking
- **Caching**: Browser caching strategies

### Backend Optimization
- **Database Indexing**: Proper indexing for queries
- **Query Optimization**: Efficient database queries
- **Caching**: Redis caching for frequently accessed data
- **Compression**: Response compression with gzip
- **Connection Pooling**: Database connection pooling

### Monitoring
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Sentry or similar error tracking
- **Uptime Monitoring**: Service uptime monitoring
- **Log Management**: Centralized log management

## Security

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for password encryption
- **Session Management**: Proper session handling
- **Rate Limiting**: API rate limiting for security

### Data Security
- **Input Validation**: Express-validator for input sanitization
- **XSS Protection**: XSS sanitization for user inputs
- **NoSQL Injection**: Mongoose for database security
- **HTTPS**: SSL/TLS encryption for all communications

### API Security
- **CORS**: Proper CORS configuration
- **Helmet**: Security headers with Helmet.js
- **Rate Limiting**: Express-rate-limit for API protection
- **Parameter Pollution**: Protection against HTTP parameter pollution

## Troubleshooting

### Common Issues

#### Database Connection Issues
- **Problem**: Cannot connect to MongoDB
- **Solution**: Check MONGO_URI in .env file and ensure MongoDB is running

#### Payment Processing Issues
- **Problem**: Stripe/PayPal payments failing
- **Solution**: Verify API keys in .env file and check payment processor dashboards

#### Email Sending Issues
- **Problem**: Emails not being sent
- **Solution**: Check email configuration in .env file and verify SMTP settings

#### Performance Issues
- **Problem**: Slow page loading
- **Solution**: Check database indexes, optimize queries, and enable caching

### Debugging Tools
- **MongoDB Compass**: GUI for MongoDB database
- **Postman**: API testing and debugging
- **Chrome DevTools**: Frontend debugging
- **Node Inspector**: Backend debugging
- **Log Files**: Check server logs for errors

### Support
For issues not covered in this documentation, please:
1. Check the GitHub issues for similar problems
2. Open a new issue with detailed information
3. Contact the development team for assistance