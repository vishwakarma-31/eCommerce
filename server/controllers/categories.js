const Category = require('../models/Category');
const { protect, isAdmin } = require('../middleware/auth');
const cacheService = require('../services/cacheService');

// Get all categories
const getCategories = async (req, res) => {
  try {
    // Try to get from cache first
    const cacheKey = 'categories:active';
    let categories = cacheService.get(cacheKey);
    
    if (!categories) {
      // If not in cache, fetch from database
      categories = await Category.find({ isActive: true });
      // Cache for 10 minutes
      cacheService.set(cacheKey, categories, 10 * 60 * 1000);
    }
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const cacheKey = `category:${categoryId}`;
    
    // Try to get from cache first
    let category = cacheService.get(cacheKey);
    
    if (!category) {
      // If not in cache, fetch from database
      category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      // Cache for 10 minutes
      cacheService.set(cacheKey, category, 10 * 60 * 1000);
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    
    // Clear categories cache when a new category is created
    cacheService.delete('categories:active');
    
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Clear relevant cache entries
    cacheService.delete('categories:active');
    cacheService.delete(`category:${req.params.id}`);
    
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Clear relevant cache entries
    cacheService.delete('categories:active');
    cacheService.delete(`category:${req.params.id}`);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};