/**
 * Unit tests for utility functions
 */
const { generateToken } = require('./helpers');

describe('Utility Functions', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'test-user-id';
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });
});