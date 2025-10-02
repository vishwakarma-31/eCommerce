# LaunchPad Market - Email Notification System

This document details the implementation of the email notification system for the LaunchPad Market platform.

## Email Templates

The system includes HTML email templates for all required notifications:

1. **Welcome Email** - After registration
2. **Project Funded Successfully** - To creator and backers
3. **Project Failed** - To creator and backers
4. **Order Confirmation** - Marketplace purchase
5. **Order Shipped** - With tracking number
6. **Order Delivered** - Delivery confirmation
7. **Password Reset** - Reset link
8. **New Comment** - On user's project
9. **Project Update** - From creator to backers

## Implementation (using Nodemailer)

```javascript
// emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `LaunchPad Market <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
```

## Template Placeholders

All email templates use the following placeholder format: `{{placeholderName}}`

### Welcome Email
- `{{name}}` - User's name
- `{{email}}` - User's email
- `{{clientUrl}}` - Platform URL

### Project Funded Emails
- `{{name}}` - Recipient's name
- `{{projectName}}` - Project title
- `{{fundingGoal}}` - Project funding goal
- `{{currentFunding}}` - Current funding level
- `{{projectUrl}}` - Project page URL

### Project Failed Emails
- `{{name}}` - Recipient's name
- `{{projectName}}` - Project title
- `{{fundingGoal}}` - Project funding goal
- `{{currentFunding}}` - Current funding level
- `{{projectUrl}}` - Project page URL

### Order Confirmation
- `{{name}}` - User's name
- `{{orderId}}` - Order ID
- `{{totalAmount}}` - Order total
- `{{orderDate}}` - Order date
- `{{orderUrl}}` - Order page URL

### Order Shipped
- `{{name}}` - User's name
- `{{orderId}}` - Order ID
- `{{trackingNumber}}` - Shipping tracking number
- `{{estimatedDelivery}}` - Estimated delivery date
- `{{orderUrl}}` - Order page URL

### Order Delivered
- `{{name}}` - User's name
- `{{orderId}}` - Order ID
- `{{deliveredAt}}` - Delivery date
- `{{orderUrl}}` - Order page URL

### Password Reset
- `{{name}}` - User's name
- `{{resetUrl}}` - Password reset URL
- `{{expiresIn}}` - Expiration time

### New Comment
- `{{name}}` - Recipient's name
- `{{commenterName}}` - Commenter's name
- `{{projectName}}` - Project title
- `{{comment}}` - Comment text
- `{{projectUrl}}` - Project page URL

### Project Update
- `{{name}}` - Recipient's name
- `{{projectName}}` - Project title
- `{{creatorName}}` - Creator's name
- `{{updateTitle}}` - Update title
- `{{updateContent}}` - Update content
- `{{projectUrl}}` - Project page URL

## Email Service Functions

The email service provides the following functions:

1. `sendWelcomeEmail(user)` - Sends welcome email to new users
2. `sendProjectFundedEmail(project, backers, creator)` - Sends success notifications
3. `sendProjectFailedEmail(project, backers, creator)` - Sends failure notifications
4. `sendOrderConfirmationEmail(order, user)` - Sends order confirmation
5. `sendOrderShippedEmail(order, user)` - Sends shipping notification
6. `sendOrderDeliveredEmail(order, user)` - Sends delivery confirmation
7. `sendPasswordResetEmail(user, resetToken)` - Sends password reset link
8. `sendNewCommentEmail(comment, user, project)` - Sends comment notification
9. `sendProjectUpdateEmail(project, backers, updateTitle, updateContent)` - Sends project updates

## Configuration

The email system is configured using environment variables:

- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_SECURE` - Whether to use TLS (true/false)
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `EMAIL_FROM` - Default sender address
- `CLIENT_URL` - Platform frontend URL

## Security Considerations

1. **Environment Variables**: Sensitive credentials are stored in environment variables
2. **Template Validation**: Templates are validated before sending
3. **Error Handling**: All email sending operations include proper error handling
4. **Logging**: Email operations are logged for monitoring and debugging
5. **Rate Limiting**: Email sending is not rate-limited in the current implementation

## Testing

The email system has been tested with:

1. Template rendering and placeholder replacement
2. Email sending through various SMTP providers
3. Error handling for invalid configurations
4. Integration with user registration and order processes

## Future Enhancements

1. **Email Queuing**: Implement a queue system for better performance
2. **Email Tracking**: Add open and click tracking
3. **Personalization**: Enhanced personalization based on user behavior
4. **A/B Testing**: Support for testing different email templates
5. **Multilingual Support**: Email templates in multiple languages
6. **Advanced Analytics**: Detailed email performance analytics