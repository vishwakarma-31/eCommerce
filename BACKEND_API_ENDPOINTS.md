# Backend API Endpoints (RESTful Architecture)

All routes are prefixed with `/api`

## A. Authentication Routes (/api/auth)

### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### POST /api/auth/login
Login user, return JWT

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

### POST /api/auth/logout
Logout user (clear token client-side)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
Get current user data (protected)

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profileImage": "string",
  "bio": "string",
  "phone": "string",
  "address": "object",
  "isVerified": "boolean",
  "isActive": "boolean"
}
```

### POST /api/auth/forgot-password
Request password reset

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Password reset instructions sent to your email"
}
```

### POST /api/auth/reset-password/:token
Reset password with token

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

### PUT /api/auth/change-password
Change password (protected)

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## B. User Routes (/api/users)

### GET /api/users/:id/profile
Get public user profile

**Response:**
```json
{
  "name": "string",
  "profileImage": "string",
  "bio": "string",
  "role": "string",
  "createdAt": "date"
}
```

### PUT /api/users/profile
Update own profile (protected)

**Request Body:**
```json
{
  "name": "string",
  "bio": "string",
  "phone": "string",
  "address": "object"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "profileImage": "string",
  "bio": "string",
  "phone": "string",
  "address": "object"
}
```

### POST /api/users/profile/image
Upload profile image (protected)

**Response:**
```json
{
  "message": "Profile image uploaded successfully",
  "imageUrl": "string"
}
```

### GET /api/users/wishlist
Get user's wishlist (protected)

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

### POST /api/users/wishlist/:productId
Add to wishlist (protected)

**Response:**
```json
{
  "message": "Product added to wishlist"
}
```

### DELETE /api/users/wishlist/:productId
Remove from wishlist (protected)

**Response:**
```json
{
  "message": "Product removed from wishlist"
}
```

### GET /api/users/recommendations
Get personalized recommendations (protected)

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

## C. Product Routes (/api/products)

### GET /api/products
Get all products (with pagination, filtering, sorting)

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status
- `sort` - Sort by field (deadline, popularity, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:**
```json
{
  "products": [
    {
      // ProductConcept objects
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

### GET /api/products/featured
Get featured products

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

### GET /api/products/trending
Get trending products

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

### GET /api/products/search
Search products by title/description

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

### GET /api/products/:id
Get single product by ID

**Response:**
```json
{
  // ProductConcept object
}
```

### POST /api/products/
Create new product (Creator only, protected)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "fundingGoal": "number",
  "deadline": "date",
  "category": "string",
  "tags": ["string"]
}
```

**Response:**
```json
{
  // ProductConcept object
}
```

### PUT /api/products/:id
Update product (Creator/Admin, protected)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": "number",
  "fundingGoal": "number",
  "deadline": "date",
  "category": "string",
  "tags": ["string"]
}
```

**Response:**
```json
{
  // ProductConcept object
}
```

### DELETE /api/products/:id
Delete product (Creator/Admin, protected)

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### POST /api/products/:id/images
Upload product images (Creator, protected)

**Response:**
```json
{
  "message": "Product images uploaded successfully"
}
```

### POST /api/products/:id/like
Like/unlike product (protected)

**Response:**
```json
{
  "message": "Product liked",
  "likes": "number"
}
```

### POST /api/products/:id/view
Increment view count

**Response:**
```json
{
  "message": "View count incremented",
  "views": "number"
}
```

## D. PreOrder Routes (/api/preorders)

### POST /api/preorders/create-payment-intent
Create Stripe payment intent (protected)

**Request Body:**
```json
{
  "productConceptId": "string",
  "quantity": "number"
}
```

**Response:**
```json
{
  "paymentIntent": {
    "id": "string",
    "amount": "number",
    "currency": "string",
    "client_secret": "string"
  }
}
```

### POST /api/preorders/
Create new pre-order (protected)

**Request Body:**
```json
{
  "productConceptId": "string",
  "quantity": "number",
  "stripePaymentIntentId": "string",
  "shippingAddress": "object"
}
```

**Response:**
```json
{
  // PreOrder object
}
```

### GET /api/preorders/my-preorders
Get user's pre-orders (protected)

**Response:**
```json
[
  {
    // PreOrder objects with populated productConcept
  }
]
```

### GET /api/preorders/:id
Get single pre-order details (protected)

**Response:**
```json
{
  // PreOrder object with populated productConcept and backer
}
```

### PUT /api/preorders/:id/cancel
Cancel pre-order (protected)

**Response:**
```json
{
  "message": "Pre-order cancelled successfully",
  "preOrder": "object"
}
```

## E. Order Routes (/api/orders)

### POST /api/orders/create-payment
Create payment for marketplace order (protected)

**Request Body:**
```json
{
  "items": [
    {
      "product": "string",
      "quantity": "number"
    }
  ]
}
```

**Response:**
```json
{
  "paymentIntent": {
    "id": "string",
    "amount": "number",
    "currency": "string",
    "client_secret": "string"
  }
}
```

### POST /api/orders/
Create new order (protected)

**Request Body:**
```json
{
  "items": [
    {
      "product": "string",
      "quantity": "number"
    }
  ],
  "paymentMethod": "string",
  "stripePaymentIntentId": "string",
  "shippingAddress": "object"
}
```

**Response:**
```json
{
  // Order object
}
```

### GET /api/orders/my-orders
Get user's orders (protected)

**Response:**
```json
[
  {
    // Order objects with populated items
  }
]
```

### GET /api/orders/:id
Get single order details (protected)

**Response:**
```json
{
  // Order object with populated items and buyer
}
```

### PUT /api/orders/:id/cancel
Cancel order (protected)

**Response:**
```json
{
  "message": "Order cancelled successfully",
  "order": "object"
}
```

### GET /api/orders/:id/track
Get order tracking info (protected)

**Response:**
```json
{
  "orderId": "string",
  "orderStatus": "string",
  "trackingNumber": "string",
  "estimatedDelivery": "date",
  "deliveredAt": "date"
}
```

## F. Cart Routes (/api/cart)

### GET /api/cart/
Get user's cart (protected)

**Response:**
```json
[
  {
    "product": "object",
    "quantity": "number"
  }
]
```

### POST /api/cart/add
Add item to cart (protected)

**Request Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

**Response:**
```json
[
  {
    "product": "object",
    "quantity": "number"
  }
]
```

### PUT /api/cart/update/:productId
Update item quantity (protected)

**Request Body:**
```json
{
  "quantity": "number"
}
```

**Response:**
```json
[
  {
    "product": "object",
    "quantity": "number"
  }
]
```

### DELETE /api/cart/remove/:productId
Remove item from cart (protected)

**Response:**
```json
[
  {
    "product": "object",
    "quantity": "number"
  }
]
```

### DELETE /api/cart/clear
Clear entire cart (protected)

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

## G. Review Routes (/api/reviews)

### GET /api/reviews/product/:productId
Get all reviews for a product

**Response:**
```json
[
  {
    // Review objects with populated author
  }
]
```

### POST /api/reviews/
Create new review (protected, verified purchase only)

**Request Body:**
```json
{
  "product": "string",
  "rating": "number",
  "title": "string",
  "comment": "string"
}
```

**Response:**
```json
{
  // Review object with populated author
}
```

### PUT /api/reviews/:id
Update own review (protected)

**Request Body:**
```json
{
  "rating": "number",
  "title": "string",
  "comment": "string"
}
```

**Response:**
```json
{
  // Review object with populated author
}
```

### DELETE /api/reviews/:id
Delete own review (protected)

**Response:**
```json
{
  "message": "Review removed"
}
```

### POST /api/reviews/:id/helpful
Mark review as helpful (protected)

**Response:**
```json
{
  "message": "Review marked as helpful",
  "helpfulCount": "number"
}
```

## H. Comment Routes (/api/comments)

### GET /api/comments/product/:productId
Get all comments for a product

**Response:**
```json
[
  {
    // Comment objects with populated author and replies
  }
]
```

### POST /api/comments/
Create new comment (protected)

**Request Body:**
```json
{
  "productConcept": "string",
  "text": "string"
}
```

**Response:**
```json
{
  // Comment object with populated author
}
```

### POST /api/comments/:id/reply
Reply to a comment (protected)

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  // Comment object with populated author
}
```

### PUT /api/comments/:id
Update own comment (protected)

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  // Comment object with populated author
}
```

### DELETE /api/comments/:id
Delete own comment (protected)

**Response:**
```json
{
  "message": "Comment removed"
}
```

### POST /api/comments/:id/like
Like/unlike comment (protected)

**Response:**
```json
{
  "message": "Comment liked",
  "likes": "number"
}
```

## I. Category Routes (/api/categories)

### GET /api/categories/
Get all categories

**Response:**
```json
[
  {
    // Category objects
  }
]
```

### GET /api/categories/:id
Get category by ID

**Response:**
```json
{
  // Category object
}
```

### POST /api/categories/
Create category (Admin only)

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "image": "string",
  "parentCategory": "string"
}
```

**Response:**
```json
{
  // Category object
}
```

### PUT /api/categories/:id
Update category (Admin only)

**Request Body:**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "image": "string",
  "parentCategory": "string",
  "isActive": "boolean"
}
```

**Response:**
```json
{
  // Category object
}
```

### DELETE /api/categories/:id
Delete category (Admin only)

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

## J. Creator Dashboard Routes (/api/creator)

### GET /api/creator/dashboard
Get creator dashboard overview (Creator only)

**Response:**
```json
{
  "totalProducts": "number",
  "fundingProducts": "number",
  "successfulProducts": "number",
  "marketplaceProducts": "number",
  "totalEarnings": "number"
}
```

### GET /api/creator/projects
Get all creator's projects (Creator only)

**Response:**
```json
[
  {
    // ProductConcept objects
  }
]
```

### GET /api/creator/analytics/:productId
Get product analytics (Creator only)

**Response:**
```json
{
  "product": "object",
  "totalPreOrders": "number",
  "totalPreOrderRevenue": "number",
  "totalOrders": "number",
  "totalOrderRevenue": "number",
  "totalRevenue": "number"
}
```

### GET /api/creator/earnings
Get earnings summary (Creator only)

**Response:**
```json
{
  "total": "number",
  "thisMonth": "number",
  "thisYear": "number",
  "preOrders": "number",
  "marketplace": "number"
}
```

## K. Admin Routes (/api/admin)

### GET /api/admin/dashboard
Get admin dashboard stats (Admin only)

**Response:**
```json
{
  "totalUsers": "number",
  "totalProducts": "number",
  "totalOrders": "number",
  "totalPreOrders": "number",
  "recentOrders": "array"
}
```

### GET /api/admin/users
Get all users with pagination (Admin only)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "users": "array",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

### PUT /api/admin/users/:id/status
Activate/deactivate user (Admin only)

**Request Body:**
```json
{
  "isActive": "boolean"
}
```

**Response:**
```json
{
  // User object
}
```

### DELETE /api/admin/users/:id
Delete user (Admin only)

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### GET /api/admin/products/pending
Get products pending approval (Admin only)

**Response:**
```json
[
  {
    // ProductConcept objects with populated creator
  }
]
```

### PUT /api/admin/products/:id/approve
Approve product (Admin only)

**Response:**
```json
{
  "message": "Product approved successfully",
  "product": "object"
}
```

### PUT /api/admin/products/:id/reject
Reject product (Admin only)

**Response:**
```json
{
  "message": "Product rejected successfully",
  "product": "object"
}
```

### GET /api/admin/orders
Get all orders (Admin only)

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "orders": "array",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

### GET /api/admin/analytics
Get platform analytics (Admin only)

**Response:**
```json
{
  "totalUsers": "number",
  "totalProducts": "number",
  "totalOrders": "number",
  "totalPreOrders": "number",
  "totalRevenue": "number"
}
```

### GET /api/admin/sales-report
Generate sales report (Admin only)

**Query Parameters:**
- `startDate` - Start date for report
- `endDate` - End date for report

**Response:**
```json
{
  "period": {
    "startDate": "date",
    "endDate": "date"
  },
  "totalOrders": "number",
  "totalPreOrders": "number",
  "orderRevenue": "number",
  "preOrderRevenue": "number",
  "totalRevenue": "number",
  "dailySales": "object"
}
```