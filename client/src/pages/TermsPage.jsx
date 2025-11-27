import React from 'react';

const TermsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-xl text-gray-500">
          Please read these terms carefully before using our services
        </p>
      </div>

      <div className="prose prose-lg mx-auto text-gray-500">
        <h2>1. Introduction</h2>
        <p>
          Welcome to our e-commerce platform. These Terms of Service govern your access to and use of our 
          website and services. By accessing or using our services, you agree to be bound by these terms.
        </p>

        <h2>2. Account Registration</h2>
        <p>
          To access certain features of our platform, you may be required to create an account. You agree 
          to provide accurate, current, and complete information during registration and to update such 
          information to keep it accurate, current, and complete.
        </p>

        <h2>3. User Conduct</h2>
        <p>
          You are responsible for all activities that occur under your account. You agree not to:
        </p>
        <ul>
          <li>Use our services for any illegal or unauthorized purpose</li>
          <li>Interfere with or disrupt our services or servers</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Transmit any viruses or malicious code</li>
          <li>Harass, threaten, or intimidate other users</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          All content, trademarks, and other intellectual property rights in and to our services are owned 
          by us or our licensors. You may not use, copy, reproduce, modify, translate, publish, broadcast, 
          transmit, distribute, perform, upload, display, license, sell, or otherwise exploit any content 
          for any purpose without our express written consent.
        </p>

        <h2>5. Product Information</h2>
        <p>
          While we strive to provide accurate product information, we do not warrant that product 
          descriptions or other content on our site is accurate, complete, reliable, current, or error-free. 
          We reserve the right to make changes to the products, prices, and descriptions at any time.
        </p>

        <h2>6. Pricing and Payment</h2>
        <p>
          All prices are shown in USD and are subject to change without notice. We reserve the right to 
          refuse or cancel any order for any reason. Taxes and shipping fees may apply to your purchase.
        </p>

        <h2>7. Shipping and Delivery</h2>
        <p>
          We aim to process and ship all orders within 1-2 business days. Delivery times vary based on 
          your location and the shipping method selected. We are not responsible for delays caused by 
          customs, weather, or other factors beyond our control.
        </p>

        <h2>8. Returns and Refunds</h2>
        <p>
          We offer a 30-day return policy for most items. Items must be in their original condition with 
          tags attached. Refunds will be processed within 5-7 business days after we receive the returned 
          item. Shipping costs are non-refundable.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, 
          special, consequential, or punitive damages, including without limitation, loss of profits, 
          data, use, goodwill, or other intangible losses.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify you of any changes by 
          posting the new terms on our website. Your continued use of our services after such changes 
          constitutes your acceptance of the new terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
          without regard to its conflict of law provisions.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p>
          Email: support@example.com<br />
          Phone: +1 (555) 123-4567
        </p>
      </div>
    </div>
  );
};

export default TermsPage;