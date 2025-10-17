const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Order = require('../models/Order');
const Product = require('../models/ProductConcept');
const User = require('../models/User');

describe('Orders API', () => {
  let mongoServer;
  let userToken;
  let adminToken;
  let creatorToken;
  let productId;
  let userId;
  let creatorId;

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
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'Admin'
    });
    await adminUser.save();
    
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
    
    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Password123!'
      });
    adminToken = adminLogin.body.data.token;
    
    const creatorLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'creator@example.com',
        password: 'Password123!'
      });
    creatorToken = creatorLogin.body.data.token;
    
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'Password123!'
      });
    userToken = userLogin.body.data.token;
  });

  describe('POST /api/orders', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        orderItems: [
          {
            product: productId,
            quantity: 2,
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 199.98,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 224.98
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('user', userId.toString());
      expect(response.body.data).toHaveProperty('orderItems');
      expect(response.body.data.orderItems).toHaveLength(1);
      expect(response.body.data).toHaveProperty('totalPrice', orderData.totalPrice);
      expect(response.body.data).toHaveProperty('orderStatus', 'Processing');
    });

    it('should fail to create an order without authentication', async () => {
      const orderData = {
        orderItems: [
          {
            product: productId,
            quantity: 1,
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 99.99,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 124.99
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied, no token provided');
    });

    it('should fail to create an order with insufficient stock', async () => {
      const orderData = {
        orderItems: [
          {
            product: productId,
            quantity: 15, // More than available stock
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 1499.85,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 1524.85
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId;

    beforeEach(async () => {
      // Create an order
      const order = new Order({
        user: userId,
        orderItems: [
          {
            product: productId,
            quantity: 1,
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 99.99,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 124.99
      });
      await order.save();
      orderId = order._id;
    });

    it('should get an order by ID successfully as the owner', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id', orderId.toString());
      expect(response.body.data).toHaveProperty('user', userId.toString());
    });

    it('should get an order by ID successfully as an admin', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id', orderId.toString());
    });

    it('should fail to get an order by ID as a different user', async () => {
      // Create another user
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
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    let orderId;

    beforeEach(async () => {
      // Create an order
      const order = new Order({
        user: userId,
        orderItems: [
          {
            product: productId,
            quantity: 1,
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 99.99,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 124.99
      });
      await order.save();
      orderId = order._id;
    });

    it('should update order status successfully as an admin', async () => {
      const statusUpdate = {
        orderStatus: 'Shipped'
      };

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(statusUpdate)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('orderStatus', 'Shipped');
    });

    it('should fail to update order status as a regular user', async () => {
      const statusUpdate = {
        orderStatus: 'Shipped'
      };

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(statusUpdate)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    let orderId;

    beforeEach(async () => {
      // Create an order
      const order = new Order({
        user: userId,
        orderItems: [
          {
            product: productId,
            quantity: 1,
            price: 99.99
          }
        ],
        shippingAddress: {
          address: '123 Test Street',
          city: 'Test City',
          postalCode: '12345',
          country: 'Test Country'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: 99.99,
        shippingPrice: 10.00,
        taxPrice: 15.00,
        totalPrice: 124.99
      });
      await order.save();
      orderId = order._id;
    });

    it('should cancel an order successfully as the owner', async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('orderStatus', 'Cancelled');
    });

    it('should fail to cancel an order that is already delivered', async () => {
      // First, update the order status to Delivered
      await Order.findByIdAndUpdate(orderId, { orderStatus: 'Delivered' });

      const response = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Cannot cancel a delivered order');
    });
  });
});