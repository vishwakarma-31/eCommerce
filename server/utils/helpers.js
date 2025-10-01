/**
 * Utility functions for the LaunchPad Market application
 */
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

module.exports = {
  generateToken
};