# LaunchPad Market

LaunchPad Market is a modern e-commerce platform with crowdfunding capabilities built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform allows creators to launch innovative products through crowdfunding campaigns and enables backers to support these projects. Once funded, products move to the marketplace where users can purchase them.

![Project Status](https://img.shields.io/badge/status-complete-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### Core Features
- **User Authentication** - Secure registration and login with JWT
- **Product Management** - Create, view, and manage products with variants
- **Crowdfunding** - Pre-order products in the funding stage with deadline tracking
- **Marketplace** - Purchase products in production or marketplace status
- **Shopping Cart** - Add, remove, and manage cart items with coupon support
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

## Completed Implementation Checklist

### Phase 1: Critical Missing Features
- ✅ Email service with all templates
- ✅ Image upload with Cloudinary & optimization
- ✅ Production payment processing
- ✅ Advanced search & filters
- ✅ Security enhancements

### Phase 2: Analytics & Performance
- ✅ Complete analytics dashboard
- ✅ Cron jobs for automated tasks
- ✅ Database indexing
- ✅ Response compression
- ✅ Frontend optimizations

### Phase 3: User Experience
- ✅ Complete user dashboard
- ✅ Wishlist functionality
- ✅ Recently viewed products
- ✅ Notification center
- ✅ Multi-step checkout

### Phase 4: Admin Features
- ✅ User management
- ✅ Product management
- ✅ Order management
- ✅ Category management
- ✅ Coupon management
- ✅ Reports & exports

### Phase 5: Advanced Features
- ✅ Product variants
- ✅ Product comparison
- ✅ Q&A system
- ✅ Real-time features (Socket.io)
- ✅ Testing (Jest, React Testing Library)

### Phase 6: Polish & Deploy
- ✅ Mobile optimizations
- ✅ PWA features
- ✅ SEO optimization
- ✅ Documentation
- ✅ Deployment

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

For detailed information about the payment processing system, see [Payment Processing Documentation](docs/PAYMENT_PROCESSING.md).

## SEO Optimization

The platform includes comprehensive SEO optimization features:

1. **Dynamic Meta Tags** - Page-specific titles, descriptions, and keywords
2. **Structured Data** - JSON-LD markup for products, organization, and breadcrumbs
3. **Performance Optimization** - Fast loading times and mobile responsiveness
4. **Mobile-First Design** - Responsive design with PWA capabilities
5. **Sitemap Generation** - Automatic sitemap generation for search engines

For detailed information about the SEO optimization implementation, see [SEO Optimization Documentation](docs/SEO_OPTIMIZATION.md).

## Analytics & Reporting

The platform features a comprehensive analytics system:

1. **Dashboard Metrics** - Real-time revenue, orders, users, and product metrics
2. **Sales Analytics** - Revenue trends, category performance, and time-based analysis
3. **Product Analytics** - View counts, review metrics, stock alerts, and rating analysis
4. **User Analytics** - Registration trends, role distribution, and engagement metrics
5. **Order Analytics** - Status tracking, delivery times, and payment method analysis
6. **Data Export** - CSV and PDF export capabilities for all reports

## Automated Tasks (Cron Jobs)

The platform includes an extensive cron job system for automated maintenance:

### Daily Tasks (Midnight)
- Crowdfunding project deadline checking
- Payment capture for successful projects
- Payment cancellation for failed projects
- Product stock status updates
- Expired cart item clearing
- Abandoned cart email notifications
- Daily sales reporting
- Old notification archiving

### Hourly Tasks
- Low stock product checking
- Low stock alerts to admins
- Product popularity score updates

### Weekly Tasks (Sunday Midnight)
- Weekly sales reporting
- Newsletter distribution to subscribers
- Old search history clearing

### Monthly Tasks (1st of Month)
- Old order archiving
- Monthly performance reporting
- Unused image cleanup from Cloudinary

## Project Documentation

Comprehensive documentation is available for all aspects of the platform:

- [Project Documentation](docs/PROJECT_DOCUMENTATION.md) - Complete project overview
- [Payment Processing](docs/PAYMENT_PROCESSING.md) - Payment system implementation
- [SEO Optimization](docs/SEO_OPTIMIZATION.md) - Search engine optimization guide
- [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Stripe and PayPal accounts (for payment processing)
- Git

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Local or MongoDB Atlas
- npm or yarn
- Stripe and PayPal accounts (for payment processing)
- Git

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd launchpad-market
```

#### 2. Backend Setup
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

#### 3. Frontend Setup
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

#### 4. Database Seeding (Optional)
```bash
cd server
npm run seed  # Seed sample data
```

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

## User Roles & Permissions

The platform supports multiple user roles:

- **Guest** - Unauthenticated users
- **Backer** - Regular users who can purchase and back products
- **Creator** - Users who can create and manage products and campaigns
- **Admin** - Administrators with full platform access

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

## Performance Optimizations

The platform includes several performance optimizations:

1. **Database Indexing** - Strategic indexing for fast query performance
2. **Response Compression** - Gzip compression for API responses
3. **Caching** - Redis caching for frequently accessed data
4. **Image Optimization** - Sharp for image processing and optimization
5. **Code Splitting** - Efficient bundle splitting for frontend
6. **Lazy Loading** - Component lazy loading for improved initial load times

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.