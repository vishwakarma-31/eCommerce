// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

// Name validation
export const validateName = (name) => {
  // At least 2 characters
  return name.length >= 2;
};

// Price validation
export const validatePrice = (price) => {
  // Must be a positive number
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

// Quantity validation
export const validateQuantity = (quantity) => {
  // Must be a positive integer
  const num = parseInt(quantity, 10);
  return !isNaN(num) && num > 0;
};

// Date validation
export const validateDate = (date) => {
  // Must be a valid date in the future
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

// Phone validation
export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-\(\)]{10,}$/;
  return re.test(phone);
};

// Zip code validation
export const validateZipCode = (zipCode) => {
  const re = /^\d{5}(-\d{4})?$/;
  return re.test(zipCode);
};