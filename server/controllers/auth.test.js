/**
 * Unit tests for auth controller
 */
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../index');
const User = require('../models/User');

describe('Auth Controller', () => {
  let server;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/launchpadmarket-test');
    server = app.listen(0);
  });

  afterAll(async () => {
    // Clean up database and close server
    await User.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = {
        name: 'T',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if user already exists', async () => {
      // First, create a user
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Password123!'
      });

      // Try to create the same user again
      const userData = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Password123!'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe('User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    const userData = {
      name: 'Login Test User',
      email: 'login@example.com',
      password: 'Password123!'
    };

    beforeAll(async () => {
      // Create a user for login tests
      await User.create(userData);
    });

    it('should login user successfully', async () => {
      const loginData = {
        email: userData.email,
        password: userData.password
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});