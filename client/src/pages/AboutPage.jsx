import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">About Us</h1>
        <p className="mt-3 text-xl text-gray-500">
          Learn more about our mission and values
        </p>
      </div>

      <div className="prose prose-lg mx-auto text-gray-500">
        <p>
          Welcome to our e-commerce platform, where innovation meets convenience. We are dedicated to 
          providing our customers with an exceptional shopping experience, offering a curated selection 
          of high-quality products from creators around the world.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to connect creative minds with consumers who appreciate unique, thoughtfully 
          designed products. We believe in supporting independent creators and small businesses while 
          delivering outstanding value to our customers.
        </p>

        <h2>What Sets Us Apart</h2>
        <ul>
          <li>Curated selection of unique products from talented creators</li>
          <li>Commitment to quality and craftsmanship</li>
          <li>Sustainable and ethical business practices</li>
          <li>Exceptional customer service and support</li>
          <li>Fast and reliable shipping worldwide</li>
        </ul>

        <h2>Our Values</h2>
        <p>
          Integrity, creativity, and community are at the heart of everything we do. We strive to build 
          lasting relationships with both our customers and creators, fostering a marketplace that 
          celebrates innovation and authenticity.
        </p>

        <h2>Join Our Community</h2>
        <p>
          Whether you're a creator looking to showcase your work or a customer searching for something 
          special, we invite you to join our growing community. Together, we're shaping the future of 
          e-commerce, one unique product at a time.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Customer Focus</h3>
          <p className="mt-2 text-gray-500">
            Your satisfaction is our top priority. We're committed to providing an exceptional shopping experience.
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Quality Assurance</h3>
          <p className="mt-2 text-gray-500">
            We carefully vet all products and creators to ensure you receive only the highest quality items.
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Community Driven</h3>
          <p className="mt-2 text-gray-500">
            We believe in building a strong community of creators and customers who support each other.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;