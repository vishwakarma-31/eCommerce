import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import productService from '../services/productService';
import CreatorSpotlight from '../components/product/CreatorSpotlight';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products using cached version
        const featuredResponse = await productService.getFeaturedProducts({
          limit: 4
        });
        setFeaturedProducts(featuredResponse.products || []);
        
        // Fetch trending products using cached version
        const trendingResponse = await productService.getTrendingProducts({
          limit: 8
        });
        setTrendingProducts(trendingResponse.products || []);
        
        // Mock data for top creators
        const mockCreators = [
          {
            _id: '1',
            name: 'Alex Johnson',
            category: 'Tech Gadgets',
            bio: 'Innovative creator focused on sustainable technology solutions.',
            avatar: null,
            isVerified: true,
            successRate: 85,
            projectCount: 12,
            totalBackers: 1240,
            totalFunded: 42000
          },
          {
            _id: '2',
            name: 'Sam Wilson',
            category: 'Home & Kitchen',
            bio: 'Designing smart home solutions that make life easier.',
            avatar: null,
            isVerified: true,
            successRate: 92,
            projectCount: 8,
            totalBackers: 890,
            totalFunded: 31000
          },
          {
            _id: '3',
            name: 'Jordan Lee',
            category: 'Fitness & Health',
            bio: 'Creating innovative fitness equipment for home workouts.',
            avatar: null,
            isVerified: false,
            successRate: 78,
            projectCount: 15,
            totalBackers: 2100,
            totalFunded: 58000
          }
        ];
        setTopCreators(mockCreators);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 mb-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Innovate. Fund. Create.</h1>
          <p className="text-xl mb-8">
            Join the community-driven marketplace where creators pitch innovative ideas and backers help bring them to life.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/products" 
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg text-center"
            >
              Explore Products
            </Link>
            <Link 
              to="/creator/products/new" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-600 font-bold py-3 px-6 rounded-lg text-center"
            >
              Become a Creator
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products?featured=true" className="text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>

      {/* Creator Spotlight */}
      <CreatorSpotlight creators={topCreators} />

      {/* Trending Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          <Link to="/products?sortBy=views&sortOrder=desc" className="text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <ProductGrid products={trendingProducts} />
        )}
      </section>

      {/* Success Stories */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Product Success Story #{item}</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
                <Link to="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;