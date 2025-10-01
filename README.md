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
- **Frontend**: React with Vite, Tailwind CSS, React Router, Context API
- **Backend**: Node.js with Express.js, MongoDB with Mongoose
- **Authentication**: JWT with role-based access control
- **Payments**: Stripe integration with secure payment flows
- **File Uploads**: Multer with Sharp for image processing
- **Email**: Nodemailer with HTML templates
- **Deployment**: PM2 for process management

## Key Features
- **Crowdfunding Platform**: Creators can pitch products and collect pre-orders
- **Marketplace**: Successfully funded products transition to a traditional e-commerce marketplace
- **User Roles**: Guest, Backer, Creator, and Admin roles with appropriate permissions
- **Payment Processing**: Secure payment handling with Stripe integration
- **Social Features**: Reviews, comments, and wishlist functionality
- **Analytics**: Creator and admin dashboards with performance metrics
- **Advanced Features**: Notification system, following system, referral system, enhanced search, product comparison
- **Email Notifications**: Professional HTML email templates for all user interactions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- Git
- Stripe Account (for payment processing)

## Installation

### Clone the Repository
```bash
git clone https://github.com/your-username/launchpad-market.git
cd launchpad-market
```

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your configuration values
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Update .env with your configuration values
```

## Running the Application

### Development Mode
```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

### Production Mode
```bash
# Build and start backend
cd server
npm start

# Build and serve frontend
cd client
npm run build
npm run preview
```

## Project Structure

```
├── client/                    # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main App component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── .env.example          # Environment variables template
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
├── server/                   # Node.js backend
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── emails/               # Email templates
│   ├── .env.example          # Environment variables template
│   ├── index.js              # Entry point
│   └── package.json          # Backend dependencies
├── .gitignore                # Git ignore file
├── LICENSE                   # License file
└── README.md                 # Project documentation
```

## Database Schema

The platform uses MongoDB with the following core models:

1. **User** - Handles all user roles and authentication
2. **ProductConcept** - Represents products in both crowdfunding and marketplace modes
3. **PreOrder** - Tracks crowdfunding commitments
4. **Order** - Manages marketplace purchases
5. **Review** - Handles product reviews with verified purchase validation
6. **Comment** - Enables discussion on product concepts
7. **Category** - Organizes products into categories
8. **Notification** - Manages user notifications

See [DATABASE_SCHEMA_DESIGN.md](DATABASE_SCHEMA_DESIGN.md) for detailed schema definitions.

## API Endpoints

All routes are prefixed with `/api` and implement proper role-based access control.

Key endpoint groups:
- Authentication (`/api/auth`)
- Users (`/api/users`)
- Products (`/api/products`)
- PreOrders (`/api/preorders`)
- Orders (`/api/orders`)
- Cart (`/api/cart`)
- Reviews (`/api/reviews`)
- Comments (`/api/comments`)
- Categories (`/api/categories`)
- Creator Dashboard (`/api/creator`)
- Admin (`/api/admin`)
- Notifications (`/api/notifications`)
- Following (`/api/following`)
- Referral (`/api/referral`)
- Comparison (`/api/compare`)
- Stripe Webhooks (`/api/stripe`)

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

## User Roles & Permissions

### Guest (Unauthenticated)
- Browse all products (funding + marketplace)
- Search and filter products
- View product details, reviews, and ratings
- View creator profiles

### Backer (Authenticated User)
- All Guest privileges
- Back crowdfunding projects
- Add products to wishlist
- Purchase marketplace products
- Add items to cart and checkout
- Write reviews and ratings
- Comment on product concepts
- Track order history
- Manage profile
- Receive notifications
- Follow creators
- Use referral system

### Creator (Special Authenticated Role)
- All Backer privileges
- Create and manage product concepts
- Access Creator Dashboard with analytics
- Manage product inventory (post-funding)
- Respond to comments and reviews
- Update project status
- View revenue reports
- Notify followers

### Admin (Super User)
- Full system access
- User management
- Product moderation
- Order management
- Sales analytics
- Category management
- System configuration
- Content moderation

## Deployment

### Backend
- Uses PM2 for process management
- Winston for logging
- Health check endpoint at `/health`
- Environment-specific configuration

### Frontend
- Build with Vite
- Static asset optimization
- Environment-specific builds

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
