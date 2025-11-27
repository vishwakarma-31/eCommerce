import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-xl text-gray-500">
          Your privacy is important to us
        </p>
      </div>

      <div className="prose prose-lg mx-auto text-gray-500">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, make a purchase, 
          subscribe to our newsletter, or contact us for support. This information may include your name, email 
          address, phone number, postal address, payment information, and any other information you choose to provide.
        </p>

        <h2>2. Information Automatically Collected</h2>
        <p>
          When you access or use our services, we automatically collect information about your device and usage, 
          including:
        </p>
        <ul>
          <li>Log information (IP address, browser type, pages visited, etc.)</li>
          <li>Device information (device type, operating system, unique device identifiers)</li>
          <li>Location information (approximate location based on IP address)</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process and fulfill your orders</li>
          <li>Send you technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Communicate with you about products, services, and promotions</li>
          <li>Monitor and analyze trends and usage</li>
          <li>Detect, prevent, and address fraud and security issues</li>
        </ul>

        <h2>4. Sharing Your Information</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information 
          with trusted third parties who assist us in operating our website, conducting our business, or servicing 
          you, as long as those parties agree to keep this information confidential.
        </p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our services and store certain 
          information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being 
          sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
        </p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information 
          against unauthorized or unlawful processing and against accidental loss, destruction, or damage. 
          However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to provide our services and for legitimate 
          business purposes, such as compliance with legal obligations, resolution of disputes, and enforcement 
          of our agreements.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul>
          <li>The right to access, update, or delete your information</li>
          <li>The right to object to processing</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>

        <h2>9. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
          information from children under 13. If we become aware that we have collected personal information 
          from a child under 13, we will take steps to delete such information.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: privacy@example.com<br />
          Phone: +1 (555) 123-4567
        </p>

        <p className="text-sm text-gray-400 mt-8">
          Last Updated: November 26, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;