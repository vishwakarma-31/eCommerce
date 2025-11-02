# LaunchPad Market

LaunchPad Market is a modern e-commerce platform with crowdfunding capabilities built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform allows creators to launch innovative products through crowdfunding campaigns and enables backers to support these projects. Once funded, products move to the marketplace where users can purchase them.

![Project Status](https://img.shields.io/badge/status-complete-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Folder Structure](#folder-structure)
- [Key Components](#key-components)
- [Database Schema](#database-schema)
- [Real-time Features](#real-time-features)
- [Payment Processing](#payment-processing)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [License](#license)
- [Support](#support)

## Features

### Core Features
- **User Authentication** - Secure registration and login with JWT
- **Product Management** - Create, view, and manage products with variants
- **Crowdfunding** - Pre-order products in the funding stage with deadline tracking
- **Marketplace** - Purchase products in production or marketplace status
- **Shopping Cart** - Add, remove, and manage cart items
- **Order Management** - Track orders and view order history with real-time updates
- **Reviews & Ratings** - Leave reviews and ratings for products
- **Search & Filtering** - Advanced search with filters, sorting, and autocomplete
- **Wishlist** - Save favorite products for later
- **Recently Viewed** - Track recently viewed products
- **Notifications** - Real-time notifications with Socket.io
- **Admin Dashboard** - Comprehensive admin panel for managing the platform
- **Creator Dashboard** - Tools for product creators to manage their products and campaigns

### Advanced Features
- **Multi-step Checkout** - Complete checkout flow with multiple steps and guest checkout
- **Multiple Payment Methods** - Stripe, PayPal, and Cash on Delivery with webhook handling
- **Responsive Design** - Mobile-first design with touch optimizations
- **PWA Support** - Progressive Web App capabilities with offline support
- **Real-time Features** - Live chat, order updates, and notifications via Socket.io
- **Analytics Dashboard** - Sales, product, and user analytics with data visualization
- **Product Variants** - Size, color, and material options with inventory tracking
- **Product Comparison** - Compare products side-by-side
- **Product Q&A** - Ask questions and get answers from sellers
- **Recommendation Engine** - Personalized product recommendations
- **Cron Jobs** - Automated tasks for maintenance and updates
- **SEO Optimization** - Search engine optimization with dynamic meta tags and structured data
- **Email System** - Comprehensive email templates for all user interactions
- **Security Features** - Rate limiting, input sanitization, XSS protection, and secure headers

## Technology Stack

### Frontend
- **React 18** with Hooks and Context API
- **React Router v7** for navigation
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Socket.io-client** for real-time communication
- **Recharts** for data visualization
- **React Hook Form** for form validation
- **React Helmet Async** for SEO management

### Backend
- **Node.js** with Express.js v5
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **PayPal** for alternative payment processing
- **Socket.io** for real-time features
- **Nodemailer** for email notifications
- **Cloudinary** for image hosting
- **Redis** caching with NodeCache fallback
- **Node-cron** for scheduled tasks
- **Compression** for response optimization
- **Helmet** for security headers
- **Express Rate Limit** for rate limiting
- **MongoDB Sanitize** for NoSQL injection protection
- **XSS** for cross-site scripting protection

### Database
- **MongoDB** - Primary database
- **Mongoose** - ODM for MongoDB

### Development Tools
- **dotenv** for environment variables
- **nodemon** for development server
- **ESLint** for code quality
- **Jest** for testing
- **Vitest** for frontend testing
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

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

Note: MongoDB installation is optional. You can use MongoDB Atlas (cloud-hosted) instead of installing MongoDB locally. See [Database Setup](DATABASE_SETUP.md) for detailed instructions.

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd launchpad-market
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# For MongoDB setup options, see DATABASE_SETUP.md
# If using local MongoDB:
mongod
```

### 3. Frontend Setup
```bash
cd client
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# Database
# For local MongoDB:
# MONGO_URI=mongodb://localhost:27017/launchpad-market
# For MongoDB Atlas (see DATABASE_SETUP.md for setup instructions):
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/launchpad-market

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for image hosting)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Running the Application

### Start Backend Server
```bash
cd server
npm run dev  # Development with nodemon
# or
npm start    # Production
```

### Start Frontend Server
```bash
cd client
npm run dev
```

### Build for Production
```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

## API Documentation

The API is documented using Postman. You can find the collection in the root directory:
- [LaunchPad-Market-API.postman_collection.json](LaunchPad-Market-API.postman_collection.json)

Key API endpoints include:
- Authentication (`/api/auth`)
- Users (`/api/users`)
- Products (`/api/products`)
- Orders (`/api/orders`)
- Cart (`/api/cart`)
- Reviews (`/api/reviews`)
- Categories (`/api/categories`)
- Creator Dashboard (`/api/creator`)
- Admin Dashboard (`/api/admin`)

## Testing

The platform includes comprehensive tests:

- **Backend Tests** - Unit and integration tests for all API endpoints
- **Frontend Tests** - Component and integration tests for React components
- **End-to-End Tests** - Cypress tests for critical user flows

To run tests:
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
1. Set `NODE_ENV=production` in backend .env
2. Update database connection string in `MONGO_URI`
3. Configure production URLs for Stripe, PayPal, and email services
4. Build frontend for production: `npm run build`
5. Serve built files from `client/dist`
6. Start backend server with `npm start`

### Using PM2 for Production
```bash
cd server
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

## Folder Structure

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

## Key Components

### User Roles
- **Guest** - Unauthenticated users
- **Backer** - Regular users who can purchase and back products
- **Creator** - Users who can create and manage products and campaigns
- **Admin** - Administrators with full platform access

### Product Statuses
- **Funding** - Product is in crowdfunding phase
- **Successful** - Product has reached funding goal
- **Failed** - Product did not reach funding goal
- **InProduction** - Product is being manufactured
- **Marketplace** - Product is available for purchase
- **OutOfStock** - Product is temporarily unavailable
- **Discontinued** - Product is no longer available

### Order Statuses
- **Processing** - Order is being processed
- **Confirmed** - Order has been confirmed
- **Shipped** - Order has been shipped
- **Delivered** - Order has been delivered
- **Cancelled** - Order has been cancelled

## Database Schema

### User Model
- Authentication and profile information
- Role-based access control (Backer, Creator, Admin)
- Address management
- Wishlist and recently viewed products
- Following system for creators
- Referral system

### Product Concept Model
- Product information and descriptions
- Images and media
- Pricing and discounts
- Categories and tags
- Variants (size, color, material)
- Crowdfunding data (funding goal, deadline)
- Reviews and ratings
- Questions and answers
- Analytics (views, sales, popularity)

### Order Model
- Buyer information
- Order items and quantities
- Payment information
- Shipping address
- Order and payment status tracking
- Status history

## Real-time Features

The platform includes comprehensive real-time functionality powered by Socket.io:

1. **Order Status Updates** - Real-time notifications when order status changes
2. **New Order Alerts** - Admins receive instant notifications for new orders
3. **Stock Updates** - Real-time inventory updates across all connected clients
4. **Live Chat** - Real-time messaging between users with typing indicators
5. **Notifications** - Instant notification delivery for all user interactions

All real-time connections are secured with JWT authentication and role-based room management.

## Payment Processing

The platform supports multiple payment methods:

1. **Stripe** - Credit and debit card payments with webhook handling
2. **PayPal** - PayPal account payments with webhook handling
3. **Cash on Delivery** - Payment at time of delivery

### Security Features
- PCI compliance through Stripe and PayPal
- Webhook verification for payment confirmations
- Refund and cancellation handling
- Payment status tracking

## Security Features

The platform implements comprehensive security measures:

1. **Authentication** - JWT-based authentication with secure token handling
2. **Rate Limiting** - API rate limiting to prevent abuse
3. **Input Sanitization** - Protection against NoSQL injection attacks
4. **XSS Protection** - Cross-site scripting attack prevention
5. **Security Headers** - Helmet.js for secure HTTP headers
6. **Data Validation** - Express-validator for input validation
7. **Password Security** - Bcrypt for password hashing
8. **Session Management** - Secure session handling with timeouts
9. **Account Lockout** - Protection against brute force attacks

## Performance Optimizations

The platform includes several performance optimizations:

1. **Database Indexing** - Strategic indexing for fast query performance
2. **Response Compression** - Gzip compression for API responses
3. **Caching** - Redis caching for frequently accessed data
4. **Image Optimization** - Sharp for image processing and optimization
5. **Code Splitting** - Efficient bundle splitting for frontend
6. **Lazy Loading** - Component lazy loading for improved initial load times
7. **Database Connection Pooling** - Efficient database connection management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.