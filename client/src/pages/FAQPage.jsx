import React from 'react';

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details and verify your email address to complete the registration process."
    },
    {
      question: "How can I reset my password?",
      answer: "If you've forgotten your password, click on the 'Login' button and then select 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express. We also support PayPal and bank transfers."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days. Express shipping options are available for faster delivery. Shipping times may vary based on your location."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, we offer a 30-day return policy for most items. Items must be in their original condition with tags attached. Please contact our customer service team to initiate a return or exchange."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order has been shipped, you'll receive a tracking number via email. You can use this number on our website's order tracking page or directly on the carrier's website."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-3 text-xl text-gray-500">
          Find answers to common questions about our platform
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <li key={index}>
              <div className="px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="text-sm text-gray-500">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600">
          Still have questions?{' '}
          <a href="/contact" className="font-medium text-indigo-600 hover:text-indigo-500">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default FAQPage;