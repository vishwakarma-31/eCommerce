/**
 * Custom error classes for the LaunchPad Market application
 * These classes extend the built-in Error class to provide more specific error handling
 */

/**
 * Base custom error class
 */
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - for input validation failures
 */
class ValidationError extends CustomError {
  constructor(message) {
    super(message || 'Validation failed', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error - for authentication failures
 */
class AuthenticationError extends CustomError {
  constructor(message) {
    super(message || 'Authentication failed', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error - for authorization failures
 */
class AuthorizationError extends CustomError {
  constructor(message) {
    super(message || 'Access denied', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error - for resource not found
 */
class NotFoundError extends CustomError {
  constructor(message) {
    super(message || 'Resource not found', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Duplicate resource error - for duplicate resources
 */
class DuplicateResourceError extends CustomError {
  constructor(message) {
    super(message || 'Resource already exists', 409);
    this.name = 'DuplicateResourceError';
  }
}

/**
 * Payment error - for payment processing failures
 */
class PaymentError extends CustomError {
  constructor(message) {
    super(message || 'Payment processing failed', 422);
    this.name = 'PaymentError';
  }
}

/**
 * Rate limit error - for rate limiting
 */
class RateLimitError extends CustomError {
  constructor(message) {
    super(message || 'Too many requests', 429);
    this.name = 'RateLimitError';
  }
}

module.exports = {
  CustomError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateResourceError,
  PaymentError,
  RateLimitError
};