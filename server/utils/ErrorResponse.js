/**
 * Custom Error Response Class
 * Extends the built-in Error class to provide consistent error responses
 */

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;