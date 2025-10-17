# Testing Guide

This document provides instructions on how to run tests for both the backend and frontend of the LaunchPad Market eCommerce platform.

## Backend Testing

### Running Tests

```bash
# Run all backend tests
cd server
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Backend tests are located in the `server/__tests__` directory:
- `auth.test.js` - Authentication tests (registration, login, JWT validation, password reset)
- `products.test.js` - Product management tests (create, read, update, delete)
- `orders.test.js` - Order management tests (create, read, update status, cancel)
- `cart.test.js` - Cart functionality tests (add, update, remove items)

### Technologies Used

- Jest - JavaScript testing framework
- Supertest - HTTP assertions library for testing API endpoints
- mongodb-memory-server - In-memory MongoDB for isolated testing

## Frontend Testing

### Running Tests

```bash
# Run all frontend tests
cd client
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Frontend tests are organized by component type:
- `client/src/components/__tests__` - Component tests (ProductCard, CartItem, etc.)
- `client/src/pages/__tests__` - Page tests (Login, etc.)
- `client/src/hooks/__tests__` - Custom hook tests (useAuth, etc.)

### Technologies Used

- Vitest - Next generation testing framework powered by Vite
- React Testing Library - Lightweight solution for testing React components
- Jest DOM - Custom jest matchers to test the DOM

## Writing New Tests

### Backend Test Guidelines

1. Use `mongodb-memory-server` for database isolation
2. Clean up database collections after each test
3. Test both success and failure cases
4. Use descriptive test names
5. Mock external services when possible

### Frontend Test Guidelines

1. Test user interactions and component behavior
2. Mock context providers and hooks
3. Test edge cases and error states
4. Use React Testing Library best practices
5. Avoid testing implementation details

## Continuous Integration

Tests are automatically run in the CI pipeline. Ensure all tests pass before merging pull requests.

## Coverage Reports

Coverage reports are generated when running tests with the `test:coverage` script. Reports are available in the `coverage/` directory.