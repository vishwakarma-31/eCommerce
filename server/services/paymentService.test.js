/**
 * Unit tests for payment service
 */
const { 
  captureAllPreOrderPayments, 
  cancelAllPreOrderPayments, 
  refundPreOrderPayment 
} = require('./paymentService');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      paymentIntents: {
        capture: jest.fn().mockResolvedValue({}),
        cancel: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({})
      },
      refunds: {
        create: jest.fn().mockResolvedValue({})
      }
    };
  });
});

describe('Payment Service', () => {
  describe('captureAllPreOrderPayments', () => {
    it('should capture all pre-order payments successfully', async () => {
      // Mock PreOrder model
      jest.mock('../models/PreOrder', () => {
        return {
          find: jest.fn().mockResolvedValue([
            { _id: '1', stripePaymentIntentId: 'pi_1', status: 'Authorized', save: jest.fn() },
            { _id: '2', stripePaymentIntentId: 'pi_2', status: 'Authorized', save: jest.fn() }
          ])
        };
      });

      // Mock ProductConcept model
      jest.mock('../models/ProductConcept', () => {
        return jest.fn();
      });

      const result = await captureAllPreOrderPayments('product123');
      expect(result).toBe(2);
    });

    it('should handle errors during payment capture', async () => {
      // Mock PreOrder model with error
      jest.mock('../models/PreOrder', () => {
        return {
          find: jest.fn().mockResolvedValue([
            { _id: '1', stripePaymentIntentId: 'pi_1', status: 'Authorized', save: jest.fn() }
          ])
        };
      });

      // Mock Stripe to throw an error
      const stripe = require('stripe');
      stripe().paymentIntents.capture.mockRejectedValue(new Error('Payment capture failed'));

      await expect(captureAllPreOrderPayments('product123')).rejects.toThrow('Payment capture failed');
    });
  });

  describe('cancelAllPreOrderPayments', () => {
    it('should cancel all pre-order payments successfully', async () => {
      // Mock PreOrder model
      jest.mock('../models/PreOrder', () => {
        return {
          find: jest.fn().mockResolvedValue([
            { _id: '1', stripePaymentIntentId: 'pi_1', status: 'Authorized', save: jest.fn() },
            { _id: '2', stripePaymentIntentId: 'pi_2', status: 'Authorized', save: jest.fn() }
          ])
        };
      });

      // Mock ProductConcept model
      const mockProduct = { currentFunding: 10, save: jest.fn() };
      jest.mock('../models/ProductConcept', () => {
        return {
          findById: jest.fn().mockResolvedValue(mockProduct)
        };
      });

      const result = await cancelAllPreOrderPayments('product123');
      expect(result).toBe(2);
    });
  });

  describe('refundPreOrderPayment', () => {
    it('should refund a pre-order payment successfully', async () => {
      // Mock PreOrder model
      const mockPreOrder = { 
        _id: '1', 
        stripePaymentIntentId: 'pi_1', 
        status: 'Paid', 
        save: jest.fn() 
      };
      
      jest.mock('../models/PreOrder', () => {
        return {
          findById: jest.fn().mockResolvedValue(mockPreOrder)
        };
      });

      const result = await refundPreOrderPayment('preorder123');
      expect(result).toBeDefined();
      expect(mockPreOrder.status).toBe('Refunded');
    });

    it('should throw an error if pre-order is not found', async () => {
      // Mock PreOrder model to return null
      jest.mock('../models/PreOrder', () => {
        return {
          findById: jest.fn().mockResolvedValue(null)
        };
      });

      await expect(refundPreOrderPayment('nonexistent')).rejects.toThrow('Pre-order not found');
    });
  });
});