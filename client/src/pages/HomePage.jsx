import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import LazyImage from '../components/common/LazyImage';
import TouchCarousel from '../components/product/TouchCarousel';
import PullToRefresh from '../components/common/PullToRefresh';
import { generatePageSEO, generateOrganizationStructuredData } from '../services/seoService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { recentlyViewed } = useRecentlyViewed();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products
        const featured = await productService.getProducts({ 
          isFeatured: true, 
          limit: 10 
        });
        setFeaturedProducts(featured.products || []);
        
        // Fetch new arrivals
        const newArrivalsData = await productService.getProducts({ 
          sortBy: 'createdAt', 
          sortOrder: 'desc', 
          limit: 10 
        });
        setNewArrivals(newArrivalsData.products || []);
        
        // Fetch best sellers
        const bestSellersData = await productService.getProducts({ 
          sortBy: 'soldQuantity', 
          sortOrder: 'desc', 
          limit: 10 
        });
        setBestSellers(bestSellersData.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Generate SEO data
  const seoData = generatePageSEO({
    title: 'Home',
    description: 'Discover innovative products through crowdfunding and shop unique items in our marketplace. Join our community of creators and backers.'
  });
  
  const organizationStructuredData = generateOrganizationStructuredData();

  if (loading) {
    return (
      <PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </PullToRefresh>
    );
  }

  if (error) {
    return (
      <PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    );
  }

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.og.title} />
        <meta property="og:description" content={seoData.og.description} />
        <meta property="og:type" content={seoData.og.type} />
        <meta property="og:url" content={seoData.og.url} />
        <meta property="og:image" content={seoData.og.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={seoData.twitter.card} />
        <meta name="twitter:title" content={seoData.twitter.title} />
        <meta name="twitter:description" content={seoData.twitter.description} />
        <meta name="twitter:image" content={seoData.twitter.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationStructuredData)}
        </script>
      </Helmet>
      
      <PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="relative rounded-xl overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-64 md:h-80 flex items-center">
              <div className="px-8 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Innovative Products</h1>
                <p className="text-xl mb-6">Support creators and get exclusive access to cutting-edge products</p>
                <Link 
                  to="/products" 
                  className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
          
          {/* Featured Products Carousel */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <TouchCarousel 
                products={featuredProducts} 
                title="Featured Products" 
              />
            </div>
          )}
          
          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="mb-12">
              <TouchCarousel 
                products={recentlyViewed} 
                title="Recently Viewed" 
              />
            </div>
          )}
          
          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <div className="mb-12">
              <TouchCarousel 
                products={newArrivals} 
                title="New Arrivals" 
              />
            </div>
          )}
          
          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <div className="mb-12">
              <TouchCarousel 
                products={bestSellers} 
                title="Best Sellers" 
              />
            </div>
          )}
          
          {/* Categories Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden group">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">{category}</span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/products?category=${category.toLowerCase()}`} 
                      className="text-white font-medium hover:underline"
                    >
                      Shop {category}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* How It Works */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How LaunchPad Market Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Discover</h3>
                <p className="text-gray-600">Browse innovative products from creators around the world</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600">Back projects you believe in and get exclusive rewards</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Receive</h3>
                <p className="text-gray-600">Get your products delivered right to your doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
};

export default HomePage;