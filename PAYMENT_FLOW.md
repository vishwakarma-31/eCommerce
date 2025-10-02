# LaunchPad Market - Payment Flow Implementation

This document details the implementation of the payment flows for both crowdfunding pre-orders and marketplace orders in the LaunchPad Market platform.

## A. Pre-Order Payment Flow (Crowdfunding)

### Step 1: User Backs a Project
```javascript
// Frontend: Create payment intent
const response = await axios.post('/api/preorders/create-payment-intent', {
  productId,
  quantity,
  shippingAddress
});

const { clientSecret } = response.data;
```

### Step 2: Authorize Payment (Don't Capture)
```javascript
// Frontend: Stripe Elements
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: userName }
  },
  setup_future_usage: 'off_session'
});

// Backend: Create payment intent with manual capture
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalPrice * 100, // cents
  currency: 'usd',
  capture_method: 'manual', // Don't capture immediately
  metadata: {
    productId: product._id.toString(),
    userId: user._id.toString()
  }
});
```

### Step 3: Store Pre-Order
```javascript
// Backend: After successful authorization
const preOrder = await PreOrder.create({
  backer: userId,
  productConcept: productId,
  quantity,
  totalPrice,
  stripePaymentIntentId: paymentIntent.id,
  status: 'Authorized',
  shippingAddress
});

// Update product funding count
product.currentFunding += quantity;
await product.save();
```

### Step 4: Project Deadline Passes (Cron Job)
```javascript
// If successful: Capture all authorized payments
if (project.currentFunding >= project.fundingGoal) {
  const preOrders = await PreOrder.find({
    productConcept: project._id,
    status: 'Authorized'
  });

  for (let preOrder of preOrders) {
    try {
      await stripe.paymentIntents.capture(preOrder.stripePaymentIntentId);
      preOrder.status = 'Paid';
      await preOrder.save();
    } catch (error) {
      // Handle failed captures
      console.error('Payment capture failed:', error);
    }
  }
  
  project.status = 'Successful';
  await project.save();
  // Send success emails
}

// If failed: Cancel all payment intents
else {
  const preOrders = await PreOrder.find({
    productConcept: project._id,
    status: 'Authorized'
  });

  for (let preOrder of preOrders) {
    try {
      await stripe.paymentIntents.cancel(preOrder.stripePaymentIntentId);
      preOrder.status = 'Cancelled';
      await preOrder.save();
    } catch (error) {
      console.error('Payment cancellation failed:', error);
    }
  }
  
  project.status = 'Failed';
  await project.save();
  // Send failure emails
}
```

## B. Marketplace Order Payment Flow

### Direct Capture - Standard e-commerce flow:
```javascript
// Create and immediately capture payment
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100,
  currency: 'usd',
  capture_method: 'automatic', // Capture immediately
  metadata: {
    orderId: order._id.toString()
  }
});
```

## C. Stripe Webhook Handler
```javascript
// Handle Stripe events
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update order/preorder status
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    // Add more cases as needed
  }

  res.json({received: true});
});
```

## Implementation Details

### Backend Implementation
1. **Controllers**: 
   - [preorders.js](file:///d%3A/Projects/eCommerce/server/controllers/preorders.js) - Handles pre-order creation and payment
   - [orders.js](file:///d%3A/Projects/eCommerce/server/controllers/orders.js) - Handles marketplace order creation and payment
   - [stripeWebhook.js](file:///d%3A/Projects/eCommerce/server/controllers/stripeWebhook.js) - Handles Stripe webhook events

2. **Services**:
   - [paymentService.js](file:///d%3A/Projects/eCommerce/server/services/paymentService.js) - Handles payment capture and cancellation logic
   - [cronService.js](file:///d%3A/Projects/eCommerce/server/services/cronService.js) - Runs daily checks for expired projects

3. **Models**:
   - [PreOrder.js](file:///d%3A/Projects/eCommerce/server/models/PreOrder.js) - Pre-order schema with payment tracking
   - [Order.js](file:///d%3A/Projects/eCommerce/server/models/Order.js) - Marketplace order schema with payment tracking

### Frontend Implementation
1. **Components**:
   - [PreOrderPaymentForm.jsx](file:///d%3A/Projects\eCommerce\client\src\components\payments\PreOrderPaymentForm.jsx) - Handles crowdfunding payment flow
   - [OrderPaymentForm.jsx](file:///d%3A/Projects\eCommerce\client\src\components\payments\OrderPaymentForm.jsx) - Handles marketplace payment flow

2. **Services**:
   - [api.js](file:///d%3A/Projects\eCommerce\client\src\services\api.js) - API client with authentication
   - [authService.js](file:///d%3A/Projects\eCommerce\client\src\services/authService.js) - Authentication service

## Security Considerations

1. **Stripe Webhook Verification**: All webhook events are verified using the webhook secret
2. **Payment Intent Validation**: Payment intents are validated to ensure they belong to the correct user and product
3. **Metadata Usage**: Stripe metadata is used to track related entities
4. **Error Handling**: Comprehensive error handling for all payment operations
5. **Logging**: All payment operations are logged for auditing

## Testing

The payment flows have been tested with:
1. Successful pre-order creation and capture
2. Failed pre-order creation and cancellation
3. Successful marketplace order creation
4. Failed marketplace order creation
5. Stripe webhook event handling
6. Cron job execution for deadline checking

## Future Enhancements

1. **Refund Processing**: Implement full refund processing for both pre-orders and marketplace orders
2. **Partial Payments**: Support for partial payment captures
3. **Alternative Payment Methods**: Support for additional payment methods beyond credit cards
4. **Dispute Handling**: Integration with Stripe's dispute resolution process
5. **Advanced Analytics**: Detailed payment analytics and reporting