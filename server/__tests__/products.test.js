const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Product = require('../models/ProductConcept');
const User = require('../models/User');

describe('Products API', () => {
  let mongoServer;
  let adminToken;
  let creatorToken;
  let userToken;
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
    // Create users with different roles
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

  describe('POST /api/products', () => {
    it('should create a new product successfully as a creator', async () => {
      const productData = {
        title: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        category: 'Electronics',
        tags: ['test', 'product'],
        images: ['https://example.com/image1.jpg'],
        stock: 10,
        creator: creatorId
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${creatorToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('title', productData.title);
      expect(response.body.data).toHaveProperty('price', productData.price);
      expect(response.body.data).toHaveProperty('status', 'draft');
    });

    it('should fail to create a product without authentication', async () => {
      const productData = {
        title: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied, no token provided');
    });

    it('should fail to create a product as a regular user', async () => {
      const productData = {
        title: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create some test products
      const product1 = new Product({
        title: 'Product 1',
        description: 'First test product',
        price: 29.99,
        category: 'Electronics',
        tags: ['electronics', 'gadget'],
        images: ['https://example.com/image1.jpg'],
        stock: 5,
        creator: creatorId,
        status: 'published'
      });
      await product1.save();

      const product2 = new Product({
        title: 'Product 2',
        description: 'Second test product',
        price: 49.99,
        category: 'Books',
        tags: ['books', 'education'],
        images: ['https://example.com/image2.jpg'],
        stock: 10,
        creator: creatorId,
        status: 'published'
      });
      await product2.save();
    });

    it('should get all products with filters', async () => {
      const response = await request(app)
        .get('/api/products?category=Electronics')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0]).toHaveProperty('title', 'Product 1');
    });

    it('should get products with search query', async () => {
      const response = await request(app)
        .get('/api/products?search=product')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.products).toHaveLength(2);
    });

    it('should get products with price range filter', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=30&maxPrice=100')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0]).toHaveProperty('title', 'Product 2');
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      // Create a product to update
      const product = new Product({
        title: 'Original Product',
        description: 'Original description',
        price: 29.99,
        category: 'Electronics',
        tags: ['electronics'],
        images: ['https://example.com/image1.jpg'],
        stock: 5,
        creator: creatorId,
        status: 'draft'
      });
      await product.save();
      productId = product._id;
    });

    it('should update a product successfully as the creator', async () => {
      const updateData = {
        title: 'Updated Product',
        description: 'Updated description',
        price: 39.99
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', updateData.title);
      expect(response.body.data).toHaveProperty('description', updateData.description);
      expect(response.body.data).toHaveProperty('price', updateData.price);
    });

    it('should fail to update a product as a different creator', async () => {
      // Create another creator
      const anotherCreator = new User({
        name: 'Another Creator',
        email: 'anothercreator@example.com',
        password: 'Password123!',
        role: 'Creator'
      });
      await anotherCreator.save();
      
      const anotherCreatorLogin = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'anothercreator@example.com',
          password: 'Password123!'
        });
      const anotherCreatorToken = anotherCreatorLogin.body.data.token;

      const updateData = {
        title: 'Updated Product'
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${anotherCreatorToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      // Create a product to delete
      const product = new Product({
        title: 'Product to Delete',
        description: 'This product will be deleted',
        price: 29.99,
        category: 'Electronics',
        tags: ['electronics'],
        images: ['https://example.com/image1.jpg'],
        stock: 5,
        creator: creatorId,
        status: 'draft'
      });
      await product.save();
      productId = product._id;
    });

    it('should delete a product successfully as the creator', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${creatorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Product removed');

      // Verify the product is deleted
      await request(app)
        .get(`/api/products/${productId}`)
        .expect(404);
    });

    it('should fail to delete a product as a regular user', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });
});