const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Cart = require('../models/Cart');
const Product = require('../models/ProductConcept');
const User = require('../models/User');

describe('Cart API', () => {
  let mongoServer;
  let userToken;
  let userId;
  let creatorId;
  let productId;

  beforeAll(async () => {
    // Create a new in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Close database connections and stop the MongoDB server
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clear the database after each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  beforeEach(async () => {
    // Create users
    const creatorUser = new User({
      name: 'Creator User',
      email: 'creator@example.com',
      password: 'Password123!',
      role: 'Creator'
    });
    await creatorUser.save();
    creatorId = creatorUser._id;
    
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'User'
    });
    await regularUser.save();
    userId = regularUser._id;
    
    // Create a product
    const product = new Product({
      title: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      category: 'Electronics',
      tags: ['test', 'product'],
      images: ['https://example.com/image1.jpg'],
      stock: 10,
      creator: creatorId,
      status: 'published'
    });
    await product.save();
    productId = product._id;
    
    // Login to get token
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'Password123!'
      });
    userToken = userLogin.body.data.token;
  });

  describe('POST /api/cart', () => {
    it('should add a product to cart successfully', async () => {
      const cartData = {
        product: productId,
        quantity: 2
      };

      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(1);
      expect(response.body.data.cartItems[0]).toHaveProperty('product', productId.toString());
      expect(response.body.data.cartItems[0]).toHaveProperty('quantity', 2);
    });

    it('should fail to add a product to cart without authentication', async () => {
      const cartData = {
        product: productId,
        quantity: 1
      };

      const response = await request(app)
        .post('/api/cart')
        .send(cartData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied, no token provided');
    });

    it('should fail to add a product with quantity exceeding stock', async () => {
      const cartData = {
        product: productId,
        quantity: 15 // More than available stock
      };

      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/cart', () => {
    beforeEach(async () => {
      // Add a product to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product: productId,
          quantity: 2
        });
    });

    it('should get cart items successfully', async () => {
      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(1);
      expect(response.body.data.cartItems[0]).toHaveProperty('product', productId.toString());
      expect(response.body.data.cartItems[0]).toHaveProperty('quantity', 2);
    });

    it('should return empty cart when no items', async () => {
      // Create another user with empty cart
      const anotherUser = new User({
        name: 'Another User',
        email: 'another@example.com',
        password: 'Password123!',
        role: 'User'
      });
      await anotherUser.save();
      
      const anotherUserLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'another@example.com',
          password: 'Password123!'
        });
      const anotherUserToken = anotherUserLogin.body.data.token;

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(0);
    });
  });

  describe('PUT /api/cart/:id', () => {
    let cartItemId;

    beforeEach(async () => {
      // Add a product to cart
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product: productId,
          quantity: 1
        });
      
      cartItemId = response.body.data.cartItems[0]._id;
    });

    it('should update cart item quantity successfully', async () => {
      const updateData = {
        quantity: 3
      };

      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(1);
      expect(response.body.data.cartItems[0]).toHaveProperty('_id', cartItemId);
      expect(response.body.data.cartItems[0]).toHaveProperty('quantity', 3);
    });

    it('should fail to update cart item with quantity exceeding stock', async () => {
      const updateData = {
        quantity: 15 // More than available stock
      };

      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should remove cart item when quantity is set to 0', async () => {
      const updateData = {
        quantity: 0
      };

      const response = await request(app)
        .put(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(0);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    let cartItemId;

    beforeEach(async () => {
      // Add a product to cart
      const response = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product: productId,
          quantity: 2
        });
      
      cartItemId = response.body.data.cartItems[0]._id;
    });

    it('should remove an item from cart successfully', async () => {
      const response = await request(app)
        .delete(`/api/cart/${cartItemId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(0);
    });

    it('should fail to remove an item from cart with invalid ID', async () => {
      const response = await request(app)
        .delete('/api/cart/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/cart', () => {
    beforeEach(async () => {
      // Add multiple products to cart
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product: productId,
          quantity: 2
        });
      
      // Create another product
      const product2 = new Product({
        title: 'Test Product 2',
        description: 'This is another test product',
        price: 149.99,
        category: 'Books',
        tags: ['test', 'books'],
        images: ['https://example.com/image2.jpg'],
        stock: 5,
        creator: creatorId,
        status: 'published'
      });
      await product2.save();
      
      await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          product: product2._id,
          quantity: 1
        });
    });

    it('should clear all items from cart successfully', async () => {
      const response = await request(app)
        .delete('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('cartItems');
      expect(response.body.data.cartItems).toHaveLength(0);
    });
  });
});