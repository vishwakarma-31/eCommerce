// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calculate percentage
export const calculatePercentage = (current, total) => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
};

// Get days remaining
export const getDaysRemaining = (deadline) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Check if product is expired
export const isProductExpired = (deadline) => {
  return new Date(deadline) < new Date();
};

// Get product status color
export const getProductStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'funding':
      return 'bg-yellow-100 text-yellow-800';
    case 'successful':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'marketplace':
      return 'bg-blue-100 text-blue-800';
    case 'inproduction':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};