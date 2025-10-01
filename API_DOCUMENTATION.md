# LaunchPad Market API Documentation

This document provides comprehensive documentation for the LaunchPad Market RESTful API.

## Table of Contents
1. [Authentication](#authentication)
2. [Rate Limiting](#rate-limiting)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
   - [Authentication Routes](#authentication-routes)
   - [User Routes](#user-routes)
   - [Product Routes](#product-routes)
   - [PreOrder Routes](#preorder-routes)
   - [Order Routes](#order-routes)
   - [Cart Routes](#cart-routes)
   - [Review Routes](#review-routes)
   - [Comment Routes](#comment-routes)
   - [Category Routes](#category-routes)
   - [Creator Dashboard Routes](#creator-dashboard-routes)
   - [Admin Routes](#admin-routes)
   - [Success Metrics Routes](#success-metrics-routes)

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). To authenticate, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained through the authentication endpoints.

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address for general requests
- 5 requests per 15 minutes per IP address for authentication endpoints

Exceeding these limits will result in a 429 (Too Many Requests) response.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

Error responses follow this format:
```json
{
  "error": {
    "message": "Error description",
    "details": "Additional error details (optional)"
  }
}
```

## API Endpoints

All routes are prefixed with `/api`.

---

## Authentication Routes

### POST /api/auth/register
Register a new user

**Permissions:** Public

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 409: Email already exists

---

### POST /api/auth/login
Login user, return JWT

**Permissions:** Public

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

**Error Codes:**
- 400: Missing credentials
- 401: Invalid credentials

---

### POST /api/auth/logout
Logout user (clear token client-side)

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me
Get current user data

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/auth/forgot-password
Request password reset

**Permissions:** Public

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

**Error Codes:**
- 400: Invalid email
- 404: User not found

---

### POST /api/auth/reset-password/:token
Reset password with token

**Permissions:** Public

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Codes:**
- 400: Invalid token or password
- 404: Token not found

---

### PUT /api/auth/change-password
Change password

**Permissions:** Authenticated

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
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Codes:**
- 400: Invalid current password
- 401: Unauthorized

---

## User Routes

### GET /api/users/:id/profile
Get public user profile

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "profileImage": "string",
    "bio": "string",
    "role": "string",
    "createdAt": "date"
  }
}
```

**Error Codes:**
- 404: User not found

---

### PUT /api/users/profile
Update own profile

**Permissions:** Authenticated

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "profileImage": "string",
    "bio": "string",
    "phone": "string",
    "address": "object"
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### POST /api/users/profile/image
Upload profile image

**Permissions:** Authenticated

**Request Body:**
Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile image uploaded successfully",
    "imageUrl": "string"
  }
}
```

**Error Codes:**
- 400: Invalid file
- 401: Unauthorized

---

### GET /api/users/wishlist
Get user's wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/users/wishlist/:productId
Add to wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product added to wishlist"
  }
}
```

**Error Codes:**
- 400: Invalid product ID
- 401: Unauthorized
- 404: Product not found
- 409: Product already in wishlist

---

### DELETE /api/users/wishlist/:productId
Remove from wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product removed from wishlist"
  }
}
```

**Error Codes:**
- 400: Invalid product ID
- 401: Unauthorized
- 404: Product not in wishlist

---

### GET /api/users/recommendations
Get personalized recommendations

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

## Product Routes

### GET /api/products
Get all products (with pagination, filtering, sorting)

**Permissions:** Public

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status (Funding, Active, Ended)
- `sort` - Sort by field (deadline, popularity, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

---

### GET /api/products/featured
Get featured products

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/trending
Get trending products

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/search
Search products by title/description

**Permissions:** Public

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/:id
Get single product by ID

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/products/
Create new product

**Permissions:** Creator/Admin

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
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/products/:id
Update product

**Permissions:** Creator/Admin (own products), Admin (all products)

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
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### DELETE /api/products/:id
Delete product

**Permissions:** Creator/Admin (own products), Admin (all products)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### POST /api/products/:id/images
Upload product images

**Permissions:** Creator/Admin (own products), Admin (all products)

**Request Body:**
Multipart form data with image files

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product images uploaded successfully"
  }
}
```

**Error Codes:**
- 400: Invalid file
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### POST /api/products/:id/like
Like/unlike product

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product liked",
    "likes": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Product not found

---

### POST /api/products/:id/view
Increment view count

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "View count incremented",
    "views": "number"
  }
}
```

**Error Codes:**
- 404: Product not found

---

## PreOrder Routes

### POST /api/preorders/create-payment-intent
Create Stripe payment intent

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    "paymentIntent": {
      "id": "string",
      "amount": "number",
      "currency": "string",
      "client_secret": "string"
    }
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### POST /api/preorders/
Create new pre-order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    // PreOrder object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### GET /api/preorders/my-preorders
Get user's pre-orders

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // PreOrder objects with populated productConcept
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### GET /api/preorders/:id
Get single pre-order details

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    // PreOrder object with populated productConcept and backer
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Pre-order not found

---

### PUT /api/preorders/:id/cancel
Cancel pre-order

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Pre-order cancelled successfully",
    "preOrder": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Pre-order not found
- 409: Pre-order cannot be cancelled

---

## Order Routes

### POST /api/orders/create-payment
Create payment for marketplace order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    "paymentIntent": {
      "id": "string",
      "amount": "number",
      "currency": "string",
      "client_secret": "string"
    }
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### POST /api/orders/
Create new order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    // Order object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### GET /api/orders/my-orders
Get user's orders

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Order objects with populated items
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### GET /api/orders/:id
Get single order details

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    // Order object with populated items and buyer
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found

---

### PUT /api/orders/:id/cancel
Cancel order

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Order cancelled successfully",
    "order": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found
- 409: Order cannot be cancelled

---

### GET /api/orders/:id/track
Get order tracking info

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "string",
    "orderStatus": "string",
    "trackingNumber": "string",
    "estimatedDelivery": "date",
    "deliveredAt": "date"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found

---

## Cart Routes

### GET /api/cart/
Get user's cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/cart/add
Add item to cart

**Permissions:** Authenticated

**Request Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### PUT /api/cart/update/:productId
Update item quantity

**Permissions:** Authenticated

**Request Body:**
```json
{
  "quantity": "number"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not in cart

---

### DELETE /api/cart/remove/:productId
Remove item from cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Product not in cart

---

### DELETE /api/cart/clear
Clear entire cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Cart cleared successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized

---

## Review Routes

### GET /api/reviews/product/:productId
Get all reviews for a product

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Review objects with populated author
    }
  ]
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/reviews/
Create new review

**Permissions:** Authenticated (verified purchase only)

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
  "success": true,
  "data": {
    // Review object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Not a verified purchaser
- 404: Product not found
- 409: Review already exists

---

### PUT /api/reviews/:id
Update own review

**Permissions:** Authenticated (owner)

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
  "success": true,
  "data": {
    // Review object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Review not found

---

### DELETE /api/reviews/:id
Delete own review

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Review removed"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Review not found

---

### POST /api/reviews/:id/helpful
Mark review as helpful

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Review marked as helpful",
    "helpfulCount": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Review not found

---

## Comment Routes

### GET /api/comments/product/:productId
Get all comments for a product

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Comment objects with populated author and replies
    }
  ]
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/comments/
Create new comment

**Permissions:** Authenticated

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
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### POST /api/comments/:id/reply
Reply to a comment

**Permissions:** Authenticated

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Comment not found

---

### PUT /api/comments/:id
Update own comment

**Permissions:** Authenticated (owner)

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Comment not found

---

### DELETE /api/comments/:id
Delete own comment

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Comment removed"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Comment not found

---

### POST /api/comments/:id/like
Like/unlike comment

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Comment liked",
    "likes": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Comment not found

---

## Category Routes

### GET /api/categories/
Get all categories

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Category objects
    }
  ]
}
```

---

### GET /api/categories/:id
Get category by ID

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 404: Category not found

---

### POST /api/categories/
Create category

**Permissions:** Admin

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
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/categories/:id
Update category

**Permissions:** Admin

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
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Category not found

---

### DELETE /api/categories/:id
Delete category

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Category not found
- 409: Category cannot be deleted (has products)

---

## Creator Dashboard Routes

### GET /api/creator/dashboard
Get creator dashboard overview

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": "number",
    "fundingProducts": "number",
    "successfulProducts": "number",
    "marketplaceProducts": "number",
    "totalEarnings": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/creator/projects
Get all creator's projects

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/creator/analytics/:productId
Get product analytics

**Permissions:** Creator (own products)

**Response:**
```json
{
  "success": true,
  "data": {
    "product": "object",
    "totalPreOrders": "number",
    "totalPreOrderRevenue": "number",
    "totalOrders": "number",
    "totalOrderRevenue": "number",
    "totalRevenue": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### GET /api/creator/earnings
Get earnings summary

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": {
    "total": "number",
    "thisMonth": "number",
    "thisYear": "number",
    "preOrders": "number",
    "marketplace": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

## Admin Routes

### GET /api/admin/dashboard
Get admin dashboard stats

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalProducts": "number",
    "totalOrders": "number",
    "totalPreOrders": "number",
    "recentOrders": "array"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/users
Get all users with pagination

**Permissions:** Admin

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": "array",
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/admin/users/:id/status
Activate/deactivate user

**Permissions:** Admin

**Request Body:**
```json
{
  "isActive": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // User object
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: User not found

---

### DELETE /api/admin/users/:id
Delete user

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: User not found

---

### GET /api/admin/products/pending
Get products pending approval

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects with populated creator
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/admin/products/:id/approve
Approve product

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product approved successfully",
    "product": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### PUT /api/admin/products/:id/reject
Reject product

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product rejected successfully",
    "product": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### GET /api/admin/orders
Get all orders

**Permissions:** Admin

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": "array",
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/analytics
Get platform analytics

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalProducts": "number",
    "totalOrders": "number",
    "totalPreOrders": "number",
    "totalRevenue": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/sales-report
Generate sales report

**Permissions:** Admin

**Query Parameters:**
- `startDate` - Start date for report
- `endDate` - End date for report

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

**Error Codes:**
- 400: Invalid date range
- 401: Unauthorized
- 403: Insufficient permissions
```

```
# LaunchPad Market API Documentation

This document provides comprehensive documentation for the LaunchPad Market RESTful API.

## Table of Contents
1. [Authentication](#authentication)
2. [Rate Limiting](#rate-limiting)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
   - [Authentication Routes](#authentication-routes)
   - [User Routes](#user-routes)
   - [Product Routes](#product-routes)
   - [PreOrder Routes](#preorder-routes)
   - [Order Routes](#order-routes)
   - [Cart Routes](#cart-routes)
   - [Review Routes](#review-routes)
   - [Comment Routes](#comment-routes)
   - [Category Routes](#category-routes)
   - [Creator Dashboard Routes](#creator-dashboard-routes)
   - [Admin Routes](#admin-routes)
   - [Success Metrics Routes](#success-metrics-routes)

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). To authenticate, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained through the authentication endpoints.

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address for general requests
- 5 requests per 15 minutes per IP address for authentication endpoints

Exceeding these limits will result in a 429 (Too Many Requests) response.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

Error responses follow this format:
```json
{
  "error": {
    "message": "Error description",
    "details": "Additional error details (optional)"
  }
}
```

## API Endpoints

All routes are prefixed with `/api`.

---

## Authentication Routes

### POST /api/auth/register
Register a new user

**Permissions:** Public

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 409: Email already exists

---

### POST /api/auth/login
Login user, return JWT

**Permissions:** Public

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "token": "string"
  }
}
```

**Error Codes:**
- 400: Missing credentials
- 401: Invalid credentials

---

### POST /api/auth/logout
Logout user (clear token client-side)

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/me
Get current user data

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/auth/forgot-password
Request password reset

**Permissions:** Public

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email"
}
```

**Error Codes:**
- 400: Invalid email
- 404: User not found

---

### POST /api/auth/reset-password/:token
Reset password with token

**Permissions:** Public

**Request Body:**
```json
{
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Codes:**
- 400: Invalid token or password
- 404: Token not found

---

### PUT /api/auth/change-password
Change password

**Permissions:** Authenticated

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
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Codes:**
- 400: Invalid current password
- 401: Unauthorized

---

## User Routes

### GET /api/users/:id/profile
Get public user profile

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "profileImage": "string",
    "bio": "string",
    "role": "string",
    "createdAt": "date"
  }
}
```

**Error Codes:**
- 404: User not found

---

### PUT /api/users/profile
Update own profile

**Permissions:** Authenticated

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
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "profileImage": "string",
    "bio": "string",
    "phone": "string",
    "address": "object"
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### POST /api/users/profile/image
Upload profile image

**Permissions:** Authenticated

**Request Body:**
Multipart form data with image file

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile image uploaded successfully",
    "imageUrl": "string"
  }
}
```

**Error Codes:**
- 400: Invalid file
- 401: Unauthorized

---

### GET /api/users/wishlist
Get user's wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/users/wishlist/:productId
Add to wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product added to wishlist"
  }
}
```

**Error Codes:**
- 400: Invalid product ID
- 401: Unauthorized
- 404: Product not found
- 409: Product already in wishlist

---

### DELETE /api/users/wishlist/:productId
Remove from wishlist

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product removed from wishlist"
  }
}
```

**Error Codes:**
- 400: Invalid product ID
- 401: Unauthorized
- 404: Product not in wishlist

---

### GET /api/users/recommendations
Get personalized recommendations

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

## Product Routes

### GET /api/products
Get all products (with pagination, filtering, sorting)

**Permissions:** Public

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status (Funding, Active, Ended)
- `sort` - Sort by field (deadline, popularity, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

---

### GET /api/products/featured
Get featured products

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/trending
Get trending products

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/search
Search products by title/description

**Permissions:** Public

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

---

### GET /api/products/:id
Get single product by ID

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/products/
Create new product

**Permissions:** Creator/Admin

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
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/products/:id
Update product

**Permissions:** Creator/Admin (own products), Admin (all products)

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
  "success": true,
  "data": {
    // ProductConcept object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### DELETE /api/products/:id
Delete product

**Permissions:** Creator/Admin (own products), Admin (all products)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### POST /api/products/:id/images
Upload product images

**Permissions:** Creator/Admin (own products), Admin (all products)

**Request Body:**
Multipart form data with image files

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product images uploaded successfully"
  }
}
```

**Error Codes:**
- 400: Invalid file
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### POST /api/products/:id/like
Like/unlike product

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product liked",
    "likes": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Product not found

---

### POST /api/products/:id/view
Increment view count

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "View count incremented",
    "views": "number"
  }
}
```

**Error Codes:**
- 404: Product not found

---

## PreOrder Routes

### POST /api/preorders/create-payment-intent
Create Stripe payment intent

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    "paymentIntent": {
      "id": "string",
      "amount": "number",
      "currency": "string",
      "client_secret": "string"
    }
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### POST /api/preorders/
Create new pre-order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    // PreOrder object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### GET /api/preorders/my-preorders
Get user's pre-orders

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // PreOrder objects with populated productConcept
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### GET /api/preorders/:id
Get single pre-order details

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    // PreOrder object with populated productConcept and backer
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Pre-order not found

---

### PUT /api/preorders/:id/cancel
Cancel pre-order

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Pre-order cancelled successfully",
    "preOrder": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Pre-order not found
- 409: Pre-order cannot be cancelled

---

## Order Routes

### POST /api/orders/create-payment
Create payment for marketplace order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    "paymentIntent": {
      "id": "string",
      "amount": "number",
      "currency": "string",
      "client_secret": "string"
    }
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### POST /api/orders/
Create new order

**Permissions:** Authenticated (Backer/Creator/Admin)

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
  "success": true,
  "data": {
    // Order object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized

---

### GET /api/orders/my-orders
Get user's orders

**Permissions:** Authenticated (Backer/Creator/Admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Order objects with populated items
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### GET /api/orders/:id
Get single order details

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    // Order object with populated items and buyer
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found

---

### PUT /api/orders/:id/cancel
Cancel order

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Order cancelled successfully",
    "order": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found
- 409: Order cannot be cancelled

---

### GET /api/orders/:id/track
Get order tracking info

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "string",
    "orderStatus": "string",
    "trackingNumber": "string",
    "estimatedDelivery": "date",
    "deliveredAt": "date"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Order not found

---

## Cart Routes

### GET /api/cart/
Get user's cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized

---

### POST /api/cart/add
Add item to cart

**Permissions:** Authenticated

**Request Body:**
```json
{
  "productId": "string",
  "quantity": "number"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### PUT /api/cart/update/:productId
Update item quantity

**Permissions:** Authenticated

**Request Body:**
```json
{
  "quantity": "number"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not in cart

---

### DELETE /api/cart/remove/:productId
Remove item from cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product": "object",
      "quantity": "number"
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Product not in cart

---

### DELETE /api/cart/clear
Clear entire cart

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Cart cleared successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized

---

## Review Routes

### GET /api/reviews/product/:productId
Get all reviews for a product

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Review objects with populated author
    }
  ]
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/reviews/
Create new review

**Permissions:** Authenticated (verified purchase only)

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
  "success": true,
  "data": {
    // Review object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Not a verified purchaser
- 404: Product not found
- 409: Review already exists

---

### PUT /api/reviews/:id
Update own review

**Permissions:** Authenticated (owner)

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
  "success": true,
  "data": {
    // Review object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Review not found

---

### DELETE /api/reviews/:id
Delete own review

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Review removed"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Review not found

---

### POST /api/reviews/:id/helpful
Mark review as helpful

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Review marked as helpful",
    "helpfulCount": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Review not found

---

## Comment Routes

### GET /api/comments/product/:productId
Get all comments for a product

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Comment objects with populated author and replies
    }
  ]
}
```

**Error Codes:**
- 404: Product not found

---

### POST /api/comments/
Create new comment

**Permissions:** Authenticated

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
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Product not found

---

### POST /api/comments/:id/reply
Reply to a comment

**Permissions:** Authenticated

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 404: Comment not found

---

### PUT /api/comments/:id
Update own comment

**Permissions:** Authenticated (owner)

**Request Body:**
```json
{
  "text": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Comment object with populated author
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Comment not found

---

### DELETE /api/comments/:id
Delete own comment

**Permissions:** Authenticated (owner), Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Comment removed"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Comment not found

---

### POST /api/comments/:id/like
Like/unlike comment

**Permissions:** Authenticated

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Comment liked",
    "likes": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 404: Comment not found

---

## Category Routes

### GET /api/categories/
Get all categories

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // Category objects
    }
  ]
}
```

---

### GET /api/categories/:id
Get category by ID

**Permissions:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 404: Category not found

---

### POST /api/categories/
Create category

**Permissions:** Admin

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
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/categories/:id
Update category

**Permissions:** Admin

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
  "success": true,
  "data": {
    // Category object
  }
}
```

**Error Codes:**
- 400: Invalid input data
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Category not found

---

### DELETE /api/categories/:id
Delete category

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Category deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Category not found
- 409: Category cannot be deleted (has products)

---

## Creator Dashboard Routes

### GET /api/creator/dashboard
Get creator dashboard overview

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": "number",
    "fundingProducts": "number",
    "successfulProducts": "number",
    "marketplaceProducts": "number",
    "totalEarnings": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/creator/projects
Get all creator's projects

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/creator/analytics/:productId
Get product analytics

**Permissions:** Creator (own products)

**Response:**
```json
{
  "success": true,
  "data": {
    "product": "object",
    "totalPreOrders": "number",
    "totalPreOrderRevenue": "number",
    "totalOrders": "number",
    "totalOrderRevenue": "number",
    "totalRevenue": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### GET /api/creator/earnings
Get earnings summary

**Permissions:** Creator

**Response:**
```json
{
  "success": true,
  "data": {
    "total": "number",
    "thisMonth": "number",
    "thisYear": "number",
    "preOrders": "number",
    "marketplace": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

## Admin Routes

### GET /api/admin/dashboard
Get admin dashboard stats

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalProducts": "number",
    "totalOrders": "number",
    "totalPreOrders": "number",
    "recentOrders": "array"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/users
Get all users with pagination

**Permissions:** Admin

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": "array",
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/admin/users/:id/status
Activate/deactivate user

**Permissions:** Admin

**Request Body:**
```json
{
  "isActive": "boolean"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // User object
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: User not found

---

### DELETE /api/admin/users/:id
Delete user

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: User not found

---

### GET /api/admin/products/pending
Get products pending approval

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": [
    {
      // ProductConcept objects with populated creator
    }
  ]
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### PUT /api/admin/products/:id/approve
Approve product

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product approved successfully",
    "product": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### PUT /api/admin/products/:id/reject
Reject product

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Product rejected successfully",
    "product": "object"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions
- 404: Product not found

---

### GET /api/admin/orders
Get all orders

**Permissions:** Admin

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": "array",
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/analytics
Get platform analytics

**Permissions:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalProducts": "number",
    "totalOrders": "number",
    "totalPreOrders": "number",
    "totalRevenue": "number"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Insufficient permissions

---

### GET /api/admin/sales-report
Generate sales report

**Permissions:** Admin

**Query Parameters:**
- `startDate` - Start date for report
- `endDate` - End date for report

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

**Error Codes:**
- 400: Invalid date range
- 401: Unauthorized
- 403: Insufficient permissions

---

## Success Metrics Routes

### GET /api/metrics/kpis
Get key performance indicators

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRegisteredUsers": 1250,
    "activeProjects": 42,
    "successfullyFundedProjectsRatio": "68.50%",
    "totalRevenueProcessed": 125000,
    "averageProjectFundingTime": "12.50 days",
    "userRetentionRate": "72.30%",
    "averageOrderValue": 85.50,
    "conversionRate": "3.20%"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (Admin access required)
- 500: Internal server error

---

### GET /api/metrics/tracking
Get tracking analytics

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "pageViewsPerProduct": [
      {
        "title": "Smart Fitness Tracker",
        "views": 1250
      }
    ],
    "averageTimeOnSite": "3 minutes 45 seconds",
    "bounceRate": "42.5%",
    "cartAbandonmentRate": "68.20%",
    "popularSearchQueries": ["electronics", "home decor", "fitness"],
    "popularCategories": [
      {
        "category": "Electronics",
        "productCount": 120,
        "totalViews": 3500
      }
    ],
    "creatorSuccessRate": "75.80%"
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (Admin access required)
- 500: Internal server error

---

### GET /api/metrics/engagement
Get user engagement metrics over time

**Permissions:** Admin only

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "userRegistrations": [
      {
        "_id": {
          "year": 2023,
          "month": 10,
          "day": 15
        },
        "count": 25
      }
    ],
    "productViews": [
      {
        "_id": {
          "year": 2023,
          "month": 10,
          "day": 15
        },
        "totalViews": 1250
      }
    ]
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (Admin access required)
- 500: Internal server error

---

### GET /api/metrics/conversion-funnel
Get conversion funnel data

**Permissions:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisitors": 10000,
    "productViews": 7500,
    "addedToCart": 1500,
    "completedOrders": 300,
    "becameCreators": 50,
    "funnel": {
      "visitorToViewRate": "75.00",
      "viewToCartRate": "20.00",
      "cartToOrderRate": "20.00",
      "orderToCreatorRate": "16.67"
    }
  }
}
```

**Error Codes:**
- 401: Unauthorized
- 403: Forbidden (Admin access required)
- 500: Internal server error
