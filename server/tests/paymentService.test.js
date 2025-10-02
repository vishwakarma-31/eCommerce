const mongoose = require('mongoose');
const PaymentService = require('../services/paymentService');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: 'pi_test123',
          client_secret: 'test_secret123'
        }),
        capture: jest.fn().mockResolvedValue({
          id: 'pi_test123',
          status: 'succeeded'
        }),
        cancel: jest.fn().mockResolvedValue({
          id: 'pi_test123',
          status: 'canceled'
        })
      }
    };
  });
});

describe('Payment Service Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/launchpadmarket_test');
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const paymentData = {
        amount: 1000, // $10.00
        currency: 'usd',
        metadata: {
          productId: 'prod123',
          userId: 'user123'
        }
      };

      const result = await PaymentService.createPaymentIntent(paymentData);
      
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('client_secret');
      expect(result.id).toBe('pi_test123');
    });

    it('should throw error for invalid payment data', async () => {
      const invalidPaymentData = {
        amount: -100, // Invalid negative amount
        currency: 'usd'
      };

      await expect(PaymentService.createPaymentIntent(invalidPaymentData))
        .rejects
        .toThrow();
    });
  });

  describe('capturePayment', () => {
    it('should capture a payment intent successfully', async () => {
      const paymentIntentId = 'pi_test123';
      
      const result = await PaymentService.capturePayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'succeeded');
    });
  });

  describe('cancelPayment', () => {
    it('should cancel a payment intent successfully', async () => {
      const paymentIntentId = 'pi_test123';
      
      const result = await PaymentService.cancelPayment(paymentIntentId);
      
      expect(result).toHaveProperty('id', paymentIntentId);
      expect(result).toHaveProperty('status', 'canceled');
    });
  });
});