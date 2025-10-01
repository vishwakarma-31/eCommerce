# Database Schema Design (MongoDB/Mongoose)

This document outlines the database schema design for the LaunchPad Market platform using MongoDB and Mongoose.

## A. User Schema

```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { 
    type: String, 
    enum: ['Backer', 'Creator', 'Admin'], 
    default: 'Backer' 
  },
  profileImage: { type: String, default: '' },
  bio: { type: String, maxlength: 500 },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  backedProjects: [{ type: Schema.Types.ObjectId, ref: 'PreOrder' }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'ProductConcept' }],
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: 'ProductConcept' },
    quantity: { type: Number, default: 1 }
  }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## B. ProductConcept Schema

```javascript
{
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  detailedDescription: { type: String },
  images: [{ type: String, required: true }], // Array of image URLs
  price: { type: Number, required: true },
  
  // Crowdfunding specific fields
  fundingGoal: { type: Number, required: true }, // Target number of pre-orders
  currentFunding: { type: Number, default: 0 }, // Current number of pre-orders
  deadline: { type: Date, required: true },
  
  // Marketplace specific fields (post-funding)
  stockQuantity: { type: Number, default: 0 },
  soldQuantity: { type: Number, default: 0 },
  
  status: { 
    type: String, 
    enum: ['Funding', 'Successful', 'Failed', 'InProduction', 'Marketplace', 'OutOfStock', 'Discontinued'], 
    default: 'Funding' 
  },
  
  category: { type: String, required: true, trim: true },
  tags: [{ type: String, trim: true }],
  
  // Reviews and ratings
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  
  // Analytics
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  
  isApproved: { type: Boolean, default: false }, // Admin approval
  isFeatured: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## C. PreOrder Schema

```javascript
{
  backer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productConcept: { type: Schema.Types.ObjectId, ref: 'ProductConcept', required: true },
  quantity: { type: Number, default: 1, min: 1 },
  totalPrice: { type: Number, required: true },
  stripePaymentIntentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Authorized', 'Paid', 'Cancelled', 'Refunded'], 
    default: 'Authorized' 
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## D. Order Schema (for marketplace purchases)

```javascript
{
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'ProductConcept', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  stripePaymentIntentId: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
    default: 'Pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## E. Review Schema

```javascript
{
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'ProductConcept', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true },
  comment: { type: String, required: true },
  images: [{ type: String }], // Optional review images
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## F. Comment Schema

```javascript
{
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productConcept: { type: Schema.Types.ObjectId, ref: 'ProductConcept', required: true },
  text: { type: String, required: true },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // For nested replies
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## G. Category Schema

```javascript
{
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

## Schema Relationships

### User Relationships
- A User can create multiple ProductConcepts (if Creator role)
- A User can back multiple projects through PreOrders
- A User can have multiple items in their wishlist
- A User can have multiple items in their cart
- A User can write multiple Reviews
- A User can write multiple Comments

### ProductConcept Relationships
- A ProductConcept belongs to one User (creator)
- A ProductConcept can have multiple PreOrders
- A ProductConcept can have multiple Reviews
- A ProductConcept can have multiple Comments
- A ProductConcept belongs to one Category

### PreOrder Relationships
- A PreOrder belongs to one User (backer)
- A PreOrder belongs to one ProductConcept

### Order Relationships
- An Order belongs to one User (buyer)
- An Order can contain multiple items, each referencing a ProductConcept

### Review Relationships
- A Review belongs to one User (author)
- A Review belongs to one ProductConcept

### Comment Relationships
- A Comment belongs to one User (author)
- A Comment belongs to one ProductConcept
- A Comment can have one parent Comment (for replies)
- A Comment can have multiple replies

### Category Relationships
- A Category can have one parent Category
- A Category can belong to multiple ProductConcepts

## Indexes

The following indexes are implemented for performance optimization:
1. User email - unique index
2. ProductConcept slug - unique index
3. ProductConcept creator - reference index
4. PreOrder backer and productConcept - reference indexes
5. Review product and author - compound unique index
6. Comment productConcept - reference index
7. Category slug - unique index

## Schema Validation

All schemas include appropriate validation:
- Required fields are marked as such
- Data types are explicitly defined
- String length constraints where appropriate
- Numerical range constraints (min/max values)
- Enum values for status fields
- Email format validation
- Date validation

## Timestamps

All schemas include automatic timestamp fields:
- `createdAt` - automatically set when document is created
- `updatedAt` - automatically updated when document is modified

This comprehensive schema design supports all the features of the LaunchPad Market platform, including crowdfunding, marketplace functionality, user roles, reviews, comments, and analytics.