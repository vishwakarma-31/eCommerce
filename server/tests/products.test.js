const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const ProductConcept = require('../models/ProductConcept');
const User = require('../models/User');

describe('Product API Tests', () => {
  let authToken;
  let creatorUser;
  let testProduct;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/launchpadmarket_test');
    
    // Create a creator user for testing
    creatorUser = await User.create({
      name: 'Creator Test',
      email: 'creator@test.com',
      password: 'CreatorPass123!',
      role: 'Creator'
    });

    // Generate auth token for creator
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'creator@test.com',
        password: 'CreatorPass123!'
      });
    
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up and close database connection
    await ProductConcept.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/products', () => {
    it('should create a new product concept', async () => {
      const productData = {
        title: 'Test Product',
        description: 'This is a test product',
        category: 'Electronics',
        targetFunding: 1000,
        fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        images: ['test-image.jpg'],
        creator: creatorUser._id
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('title', productData.title);
      expect(response.body).toHaveProperty('description', productData.description);
      expect(response.body).toHaveProperty('creator', creatorUser._id.toString());
      
      testProduct = response.body;
    });

    it('should not create a product without authentication', async () => {
      const productData = {
        title: 'Unauthorized Product',
        description: 'This should fail',
        category: 'Electronics',
        targetFunding: 1000,
        fundingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve a specific product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${testProduct._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testProduct._id);
      expect(response.body).toHaveProperty('title', testProduct.title);
    });
  });
});