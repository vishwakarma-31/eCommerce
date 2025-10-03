# LaunchPad Market - Advanced Co-Creation E-commerce Platform

## Project Overview
LaunchPad Market is a revolutionary e-commerce platform that combines crowdfunding mechanics with traditional e-commerce features.

### Core Concept
Creators pitch innovative product ideas, and customers "back" them through pre-orders. If a product reaches its funding goal within a deadline, it goes into production and backers are charged. If it fails, no charges occur. Successfully funded products transition to a marketplace where they can be purchased normally, building a community-driven ecosystem that validates ideas before mass production.

### What Makes This Unique
- **Dual-mode marketplace**: Crowdfunding + Traditional E-commerce
- **Risk-free backing**: Payment authorization without immediate charging
- **Community validation**: Products proven by market demand
- **Creator empowerment**: Direct creator-to-consumer relationship
- **Social proof system**: Reviews, ratings, and community engagement

## Technology Stack

### Frontend
- **React** (using Vite for faster development)
- **React Router DOM** for navigation
- **Context API + useReducer** for state management
- **Axios** for API calls
- **Tailwind CSS** for modern, responsive UI
- **React Hook Form** for form handling
- **React Toastify** for notifications

### Backend
- **Node.js with Express.js**
- **Express Validator** for input validation
- **bcryptjs** for password hashing
- **jsonwebtoken (JWT)** for authentication
- **node-cron** for scheduled tasks
- **multer** for file uploads
- **cors** for cross-origin requests
- **Stripe** for payment processing
- **MongoDB with Mongoose ODM** for database
- **Winston** for logging
- **Helmet.js** for security headers
- **Rate limiting** for API protection

### Database
- **MongoDB** with Mongoose ODM
- **MongoDB Aggregation Pipeline** for analytics

### Development Tools
- **dotenv** for environment variables
- **nodemon** for development server
- **ESLint** for code quality
- **Jest** for testing
- **Postman** for API testing

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Guide

#### Frontend (Client) Deployment
1. The client can be deployed to Vercel, Netlify, or any static hosting service
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:
   - `VITE_API_URL` - URL of your deployed backend
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

#### Backend (Server) Deployment
1. The server can be deployed to Render, Heroku, or any Node.js hosting service
2. Start command: `npm start`
3. Required environment variables:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - And other variables as defined in [DEPLOYMENT.md](DEPLOYMENT.md)

## User Roles & Permissions

### Guest (Unauthenticated)
- Browse all products (funding + marketplace)
- Search and filter products
- View product details, reviews, and ratings
- View creator profiles
- Access to public pages only

### Backer (Authenticated User)
- All Guest privileges
- Back crowdfunding projects
- Add products to wishlist
- Purchase marketplace products
- Add items to cart and checkout
- Write reviews and ratings (only for purchased/received items)
- Comment on product concepts
- Track order history and status
- Manage profile and preferences
- Receive personalized recommendations
- Follow creators
- Participate in referral program

### Creator (Special Authenticated Role)
- All Backer privileges
- Create and manage product concepts
- Access Creator Dashboard with analytics
- View project performance metrics
- Manage product inventory (post-funding)
- Respond to comments and reviews
- Update project status and information
- View revenue and sales reports

### Admin (Super User)
- Full system access
- User management (view, suspend, delete users)
- Product moderation (approve, reject, remove)
- Order management and dispute resolution
- Sales analytics and reporting
- Category and tag management
- System configuration
- View platform-wide metrics
- Moderate user-generated content

## Database Schema Design

The LaunchPad Market platform uses a comprehensive MongoDB schema design with the following models:

### Core Models
1. **User** - Handles all user roles and authentication
2. **ProductConcept** - Represents products in both crowdfunding and marketplace modes
3. **PreOrder** - Tracks crowdfunding commitments
4. **Order** - Manages marketplace purchases
5. **Review** - Handles product reviews with verified purchase validation
6. **Comment** - Enables discussion on product concepts
7. **Category** - Organizes products into categories
8. **Notification** - Manages user notifications

### Schema Features
- Comprehensive validation for all fields
- Proper relationships and references between models
- Indexes for performance optimization
- Automatic timestamp management
- Support for both crowdfunding and marketplace functionality

See [DATABASE_SCHEMA_DESIGN.md](DATABASE_SCHEMA_DESIGN.md) for detailed schema definitions.

## Backend API Endpoints

The LaunchPad Market platform implements a comprehensive RESTful API with the following endpoint groups:

### Core API Groups
1. **Authentication** - User registration, login, and password management
2. **Users** - Profile management, wishlist, and recommendations
3. **Products** - Product listing, search, and management
4. **PreOrders** - Crowdfunding backing functionality
5. **Orders** - Marketplace purchase functionality
6. **Cart** - Shopping cart management
7. **Reviews** - Product review system
8. **Comments** - Product discussion system
9. **Categories** - Product categorization
10. **Creator Dashboard** - Creator-specific analytics and management
11. **Admin** - Platform administration and analytics
12. **Notifications** - User notification system
13. **Following** - Creator following system
14. **Referral** - Referral program system
15. **Comparison** - Product comparison system
16. **Moderation** - Content moderation system
17. **Metrics** - Success metrics and analytics

All routes are prefixed with `/api` and implement proper role-based access control.

See [BACKEND_API_ENDPOINTS.md](BACKEND_API_ENDPOINTS.md) for detailed API documentation with request/response examples.

## Advanced Backend Logic

The LaunchPad Market platform implements sophisticated backend systems to handle complex business logic:

### Automated Deadline Checking
- Daily cron job that checks for expired crowdfunding projects
- Automatically captures payments for successful projects
- Cancels payments for failed projects
- Sends notifications to creators and backers

### Payment Processing
- Stripe integration with manual capture for pre-orders
- Standard payment processing for marketplace orders
- Webhook handling for payment confirmations
- Refund and cancellation support

### Recommendation Engine
- Personalized product recommendations based on user behavior
- Category-based suggestions
- Trending products algorithm
- Popular items in similar categories

### Analytics Aggregation
- MongoDB aggregation pipeline for performance analytics
- Sales and revenue tracking
- User engagement metrics
- Conversion rate analysis

## State Management

The frontend implements a comprehensive state management system using React Context API:

### AuthContext
- Manages user authentication state
- Handles login, registration, and logout functionality
- Persists authentication data in localStorage
- Provides currentUser, token, and isAuthenticated properties

### CartContext
- Manages shopping cart state
- Handles adding, removing, and updating cart items
- Calculates cart count and total
- Persists cart data in localStorage

### WishlistContext
- Manages wishlist state
- Handles adding and removing wishlist items
- Provides wishlist count and item lookup
- Persists wishlist data in localStorage

### SearchContext
- Manages search state and filters
- Handles search queries and parameters
- Persists search preferences

## Security Implementation

The LaunchPad Market platform implements comprehensive security measures to protect user data and prevent attacks:

### Authentication & Authorization
- Password hashing with bcryptjs (12 salt rounds)
- JWT tokens with 24-hour expiration
- Role-based access control middleware
- Protected routes on frontend and backend

### Input Validation & Sanitization
- Express-validator for all API endpoints
- XSS sanitization for user inputs
- Email format validation
- Strong password requirements (min 8 chars, mixed case, numbers, symbols)

### API Security
- Rate limiting on sensitive endpoints (login, register)
- CORS configuration with allowed origins
- Helmet.js for security headers
- MongoDB injection prevention through Mongoose
- Stripe webhook signature verification

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Git

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Local or MongoDB Atlas
- npm or yarn
- Stripe account (for payment processing)
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

### Environment Setup

#### Server .env
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/launchpad-market
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_EXPIRE=24h
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
CLIENT_URL=http://localhost:5173
```

#### Client .env
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Running the Application

### Development Mode

#### Backend
```bash
cd server
npm run dev
```

#### Frontend
```bash
cd client
npm run dev
```

### Production Mode

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

## Project Structure

### Backend (server/)
```
server/
├── controllers/          # Request handlers
├── middleware/           # Custom middleware functions
├── models/               # Mongoose models
├── routes/               # API route definitions
├── services/             # Business logic services
├── utils/                # Utility functions
├── config/               # Configuration files
├── tests/                # Test files
├── uploads/              # Uploaded files
├── logs/                 # Log files
├── index.js              # Application entry point
└── ecosystem.config.js   # PM2 configuration
```

### Frontend (client/)
```
client/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom hooks
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   ├── routes/           # Route components
│   ├── assets/           # Images and other assets
│   ├── tests/            # Test files
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Entry point
├── dist/                 # Build output
└── vite.config.js        # Vite configuration
```

## API Endpoints Summary

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login user | Public |
| `/api/auth/me` | GET | Get current user | Authenticated |
| `/api/products` | GET | Get all products | Public |
| `/api/products/:id` | GET | Get product by ID | Public |
| `/api/products` | POST | Create new product | Creator |
| `/api/preorders` | POST | Create pre-order | Authenticated |
| `/api/cart` | GET | Get cart items | Authenticated |
| `/api/cart` | POST | Add item to cart | Authenticated |
| `/api/orders` | POST | Create order | Authenticated |

*For complete API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)*

## Testing

### Backend Testing
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Frontend Testing
```bash
cd client
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Health Checks

### Backend
```
/health
```

### Frontend
```
/health.html
```

## Known Issues and Limitations

1. **Email Service**: Currently uses console logging instead of actual email sending in development
2. **File Uploads**: Limited to 5MB per file with basic validation
3. **Payment Processing**: Uses Stripe test mode by default
4. **Search Functionality**: Basic text search without advanced filtering
5. **Analytics**: Limited analytics implementation for demonstration purposes

## Future Enhancements

1. **Advanced Search**: Implement Elasticsearch for better search capabilities
2. **Real-time Notifications**: Add WebSocket support for real-time updates
3. **Mobile App**: Develop React Native mobile application
4. **Social Features**: Add social sharing and community features
5. **Advanced Analytics**: Implement comprehensive business intelligence dashboard
6. **Multi-language Support**: Add internationalization support
7. **Performance Optimization**: Implement Redis caching for better performance

## Contributing Guidelines

We welcome contributions to LaunchPad Market! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Write clear comments for complex logic
- Keep functions small and focused

### Testing
- Write unit tests for new functionality
- Ensure existing tests continue to pass
- Test edge cases and error conditions

## License Information

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows for commercial use, modification, distribution, and patent use, with the only requirement being that the original copyright and license notice be included in all copies or substantial portions of the software.