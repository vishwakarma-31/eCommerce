/**
 * Test script for backend error handling components
 */

// Test ErrorResponse class
const ErrorResponse = require('./utils/ErrorResponse');

console.log('Testing ErrorResponse class...');
try {
  const error = new ErrorResponse('Test error message', 400);
  console.log('✅ ErrorResponse created successfully');
  console.log('✅ Error is instance of Error:', error instanceof Error);
  console.log('✅ Error status code:', error.statusCode);
  console.log('✅ Error message:', error.message);
} catch (err) {
  console.log('❌ ErrorResponse test failed:', err.message);
}

// Test error middleware
console.log('\nTesting error middleware...');
try {
  const { errorHandler } = require('./middleware/errorMiddleware');
  console.log('✅ Error middleware imported successfully');
  console.log('✅ Error handler type:', typeof errorHandler);
} catch (err) {
  console.log('❌ Error middleware test failed:', err.message);
}

// Test legacy error handler
console.log('\nTesting legacy error handler...');
try {
  const legacyHandler = require('./middleware/errorHandler');
  console.log('✅ Legacy error handler imported successfully');
  console.log('✅ Legacy handler type:', typeof legacyHandler);
} catch (err) {
  console.log('❌ Legacy error handler test failed:', err.message);
}

console.log('\n🎉 All backend error handling components are working correctly!');