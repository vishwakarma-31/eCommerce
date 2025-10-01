/**
 * Test setup file for backend tests
 */
// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_secret_key';

// Mock console.error and console.warn to reduce noise during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});