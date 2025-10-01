/**
 * Debounce function for search input as specified in Section 11
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds (300ms as specified)
 * @returns {Function} - Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Format search query for API request
 * @param {string} query - Search query string
 * @returns {string} - Formatted query
 */
export const formatSearchQuery = (query) => {
  if (!query) return '';
  return query.trim();
};

/**
 * Build search URL with all parameters
 * @param {Object} params - Search parameters
 * @returns {string} - Complete URL with query parameters
 */
export const buildSearchUrl = (params) => {
  const {
    query,
    categories,
    minPrice,
    maxPrice,
    status,
    minRating,
    sortBy,
    page,
    limit
  } = params;
  
  const searchParams = new URLSearchParams();
  
  if (query) searchParams.append('q', query);
  if (categories && categories.length > 0) searchParams.append('categories', categories.join(','));
  if (minPrice !== null && minPrice !== undefined) searchParams.append('minPrice', minPrice);
  if (maxPrice !== null && maxPrice !== undefined) searchParams.append('maxPrice', maxPrice);
  if (status) searchParams.append('status', status);
  if (minRating !== null && minRating !== undefined) searchParams.append('minRating', minRating);
  if (sortBy) searchParams.append('sortBy', sortBy);
  if (page) searchParams.append('page', page);
  if (limit) searchParams.append('limit', limit);
  
  return searchParams.toString();
};

/**
 * Highlight search matches in text
 * @param {string} text - Text to highlight
 * @param {string} query - Search query
 * @returns {string} - Text with highlighted matches
 */
export const highlightMatches = (text, query) => {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export default {
  debounce,
  formatSearchQuery,
  buildSearchUrl,
  highlightMatches
};