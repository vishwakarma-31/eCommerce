# LaunchPad Market - Database Indexing Strategy

This document details the database indexing strategy implemented for the LaunchPad Market platform to ensure optimal performance and efficient querying.

## Critical Indexes for Performance

### User Model
```javascript
// User model
userSchema.index({ email: 1 }); // Critical index for login/registration
userSchema.index({ role: 1 }); // Critical index for role-based queries
```

### ProductConcept Model
```javascript
// ProductConcept model
productConceptSchema.index({ creator: 1 }); // Index for querying by creator
productConceptSchema.index({ category: 1 }); // Index for category-based queries
productConceptSchema.index({ status: 1 }); // Index for status-based queries
productConceptSchema.index({ slug: 1 }, { unique: true }); // Unique index for slug lookups
productConceptSchema.index({ deadline: 1 }); // Index for deadline-based queries (cron jobs)
productConceptSchema.index({ createdAt: -1 }); // Index for sorting by creation date
productConceptSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text search index
```

### Order Model
```javascript
// Order model
orderSchema.index({ buyer: 1 }); // Index for querying orders by buyer
orderSchema.index({ orderStatus: 1 }); // Index for status-based queries
orderSchema.index({ createdAt: -1 }); // Index for sorting by creation date
```

### PreOrder Model
```javascript
// PreOrder model
preOrderSchema.index({ backer: 1 }); // Index for querying pre-orders by backer
preOrderSchema.index({ productConcept: 1 }); // Index for querying pre-orders by product
preOrderSchema.index({ status: 1 }); // Index for status-based queries
```

### Review Model
```javascript
// Review model
reviewSchema.index({ product: 1 }); // Index for querying reviews by product
reviewSchema.index({ author: 1 }); // Index for querying reviews by author

// Ensure a user can only review a product once
reviewSchema.index({ product: 1, author: 1 }, { unique: true });
```

### Comment Model
```javascript
// Comment model
commentSchema.index({ productConcept: 1 }); // Index for querying comments by product
commentSchema.index({ author: 1 }); // Index for querying comments by author
```

### Category Model
```javascript
// Category model
categorySchema.index({ name: 1 }); // Index for querying by name
categorySchema.index({ slug: 1 }); // Index for querying by slug
categorySchema.index({ isActive: 1 }); // Index for active categories
```

### Notification Model
```javascript
// Notification model
notificationSchema.index({ user: 1, isRead: 1 }); // Index for querying by user and read status
notificationSchema.index({ user: 1, createdAt: -1 }); // Index for querying by user and sorting by date
notificationSchema.index({ type: 1 }); // Index for querying by notification type
```

## Indexing Strategy Explanation

### User Model Indexes
- **email**: Essential for authentication and user lookup operations. Unique constraint ensures no duplicate accounts.
- **role**: Used for role-based access control and filtering users by their roles.

### ProductConcept Model Indexes
- **creator**: Frequently queried to find all products by a specific creator.
- **category**: Used for category-based filtering and browsing.
- **status**: Critical for filtering products by their current status (Funding, Marketplace, etc.).
- **slug**: Unique identifier for URL-friendly product access.
- **deadline**: Used by the cron job to check for expired crowdfunding projects.
- **createdAt**: Used for sorting products by creation date (newest first).
- **text index**: Enables efficient text search across title, description, and tags.

### Order Model Indexes
- **buyer**: Frequently queried to find all orders for a specific user.
- **orderStatus**: Used for filtering orders by their current status.
- **createdAt**: Used for sorting orders by creation date.

### PreOrder Model Indexes
- **backer**: Frequently queried to find all pre-orders for a specific user.
- **productConcept**: Used to find all pre-orders for a specific product.
- **status**: Critical for filtering pre-orders by their current status.

### Review Model Indexes
- **product**: Frequently queried to find all reviews for a specific product.
- **author**: Used to find all reviews written by a specific user.
- **unique compound index**: Ensures a user can only review a product once.

### Comment Model Indexes
- **productConcept**: Frequently queried to find all comments for a specific product.
- **author**: Used to find all comments written by a specific user.

### Category Model Indexes
- **name**: Used for category lookups by name.
- **slug**: Used for URL-friendly category access.
- **isActive**: Used to filter only active categories.

### Notification Model Indexes
- **user + isRead**: Efficiently query unread notifications for a user.
- **user + createdAt**: Sort notifications by date for a specific user.
- **type**: Filter notifications by type for analytics or bulk operations.

## Performance Considerations

1. **Compound Indexes**: Used where appropriate to support complex queries.
2. **Unique Indexes**: Applied to fields that must be unique (email, slug).
3. **Text Indexes**: Implemented for search functionality across multiple fields.
4. **Sparse Indexes**: Automatically applied by MongoDB for fields that may not exist in all documents.
5. **Index Naming**: MongoDB automatically names indexes, but they can be explicitly named if needed.

## Monitoring and Maintenance

1. **Index Usage**: Regularly monitor index usage through MongoDB's profiling tools.
2. **Index Size**: Monitor index size to ensure they don't consume excessive memory.
3. **Query Performance**: Continuously monitor slow queries and optimize indexes accordingly.
4. **Index Rebuilding**: Periodically rebuild indexes to maintain optimal performance.

## Future Enhancements

1. **Geospatial Indexes**: Consider adding geospatial indexes for location-based features.
2. **TTL Indexes**: Implement TTL indexes for temporary data like session information.
3. **Wildcard Indexes**: Consider wildcard indexes for dynamic field queries.
4. **Aggregation Pipeline Optimization**: Optimize indexes for complex aggregation operations.