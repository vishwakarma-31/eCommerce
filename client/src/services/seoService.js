/**
 * SEO Service
 * Provides utilities for managing SEO meta tags and optimization
 */

// Default SEO configuration
const DEFAULT_SEO = {
  title: 'LaunchPad Market - Advanced Co-Creation E-commerce Platform',
  description: 'Discover and support innovative products through crowdfunding. Shop unique items in our marketplace. Join our community of creators and backers.',
  keywords: 'ecommerce, crowdfunding, marketplace, products, innovation, creators, backers',
  author: 'LaunchPad Market',
  og: {
    type: 'website',
    image: '/logo.png',
    url: process.env.VITE_APP_URL || 'http://localhost:5173'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@launchpadmarket',
    creator: '@launchpadmarket'
  }
};

/**
 * Generate SEO metadata for a product
 * @param {Object} product - Product object
 * @returns {Object} SEO metadata
 */
export const generateProductSEO = (product) => {
  if (!product) return DEFAULT_SEO;
  
  return {
    title: `${product.title} - LaunchPad Market`,
    description: product.shortDescription || product.description || DEFAULT_SEO.description,
    keywords: `${product.tags ? product.tags.join(', ') : ''}, ${DEFAULT_SEO.keywords}`,
    og: {
      type: 'product',
      title: product.title,
      description: product.shortDescription || product.description || DEFAULT_SEO.description,
      image: product.images && product.images.length > 0 ? product.images[0] : DEFAULT_SEO.og.image,
      url: `${DEFAULT_SEO.og.url}/product/${product._id}`
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.shortDescription || product.description || DEFAULT_SEO.description,
      image: product.images && product.images.length > 0 ? product.images[0] : DEFAULT_SEO.og.image
    }
  };
};

/**
 * Generate SEO metadata for a category
 * @param {Object} category - Category object
 * @returns {Object} SEO metadata
 */
export const generateCategorySEO = (category) => {
  if (!category) return DEFAULT_SEO;
  
  return {
    title: `${category.name} Products - LaunchPad Market`,
    description: category.description || `Shop ${category.name} products on LaunchPad Market`,
    keywords: `${category.name}, ${DEFAULT_SEO.keywords}`,
    og: {
      type: 'website',
      title: `${category.name} Products`,
      description: category.description || `Shop ${category.name} products on LaunchPad Market`,
      image: category.image || DEFAULT_SEO.og.image,
      url: `${DEFAULT_SEO.og.url}/category/${category._id}`
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Products`,
      description: category.description || `Shop ${category.name} products on LaunchPad Market`,
      image: category.image || DEFAULT_SEO.og.image
    }
  };
};

/**
 * Generate SEO metadata for a page
 * @param {Object} pageData - Page data including title, description, etc.
 * @returns {Object} SEO metadata
 */
export const generatePageSEO = (pageData) => {
  if (!pageData) return DEFAULT_SEO;
  
  return {
    title: pageData.title ? `${pageData.title} - LaunchPad Market` : DEFAULT_SEO.title,
    description: pageData.description || DEFAULT_SEO.description,
    keywords: pageData.keywords ? `${pageData.keywords}, ${DEFAULT_SEO.keywords}` : DEFAULT_SEO.keywords,
    og: {
      type: 'website',
      title: pageData.title || DEFAULT_SEO.title,
      description: pageData.description || DEFAULT_SEO.description,
      image: pageData.image || DEFAULT_SEO.og.image,
      url: pageData.url || DEFAULT_SEO.og.url
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title || DEFAULT_SEO.title,
      description: pageData.description || DEFAULT_SEO.description,
      image: pageData.image || DEFAULT_SEO.og.image
    }
  };
};

/**
 * Generate structured data for a product (JSON-LD)
 * @param {Object} product - Product object
 * @returns {Object} Structured data
 */
export const generateProductStructuredData = (product) => {
  if (!product) return null;
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.title,
    'image': product.images,
    'description': product.shortDescription || product.description,
    'sku': product.sku || product._id,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'LaunchPad Market'
    },
    'offers': {
      '@type': 'Offer',
      'url': `${DEFAULT_SEO.og.url}/product/${product._id}`,
      'priceCurrency': 'USD',
      'price': product.price,
      'priceValidUntil': product.priceValidUntil ? new Date(product.priceValidUntil).toISOString() : undefined,
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'Organization',
        'name': 'LaunchPad Market'
      }
    },
    'aggregateRating': product.averageRating ? {
      '@type': 'AggregateRating',
      'ratingValue': product.averageRating,
      'reviewCount': product.reviewCount || 0
    } : undefined
  };
};

/**
 * Generate structured data for an organization (JSON-LD)
 * @returns {Object} Structured data
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'LaunchPad Market',
    'url': DEFAULT_SEO.og.url,
    'logo': `${DEFAULT_SEO.og.url}/logo.png`,
    'sameAs': [
      'https://www.facebook.com/launchpadmarket',
      'https://twitter.com/launchpadmarket',
      'https://www.instagram.com/launchpadmarket',
      'https://www.linkedin.com/company/launchpadmarket'
    ]
  };
};

/**
 * Generate breadcrumb structured data (JSON-LD)
 * @param {Array} breadcrumbs - Array of breadcrumb objects with name and url
 * @returns {Object} Structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': breadcrumb.name,
      'item': breadcrumb.url ? `${DEFAULT_SEO.og.url}${breadcrumb.url}` : undefined
    }))
  };
};

export default {
  DEFAULT_SEO,
  generateProductSEO,
  generateCategorySEO,
  generatePageSEO,
  generateProductStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData
};