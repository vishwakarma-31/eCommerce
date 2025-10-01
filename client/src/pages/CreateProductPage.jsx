import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const CreateProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    price: '',
    fundingGoal: '',
    deadline: '',
    category: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description) {
      newErrors.description = 'Short description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.detailedDescription) {
      newErrors.detailedDescription = 'Detailed description is required';
    } else if (formData.detailedDescription.length < 50) {
      newErrors.detailedDescription = 'Detailed description must be at least 50 characters';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.fundingGoal) {
      newErrors.fundingGoal = 'Funding goal is required';
    } else if (isNaN(formData.fundingGoal) || parseInt(formData.fundingGoal) <= 0) {
      newErrors.fundingGoal = 'Funding goal must be a positive number';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setCreating(true);
    
    try {
      // In a real implementation, this would call a product service
      // const response = await productService.createProduct(formData);
      
      // Simulate API call
      setTimeout(() => {
        setCreating(false);
        navigate('/creator/dashboard', { 
          state: { 
            message: 'Product created successfully! It is now pending approval.' 
          } 
        });
      }, 1500);
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Failed to create product'
      });
      setCreating(false);
    }
  };

  if (!user || user.role !== 'Creator') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h2>
          <p className="text-gray-600 mb-6">You must be a creator to create products.</p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Product
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {errors.general}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Product Title"
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                  placeholder="Enter product title"
                />
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of your product"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
                
                <div>
                  <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    rows={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    placeholder="Detailed description including features, benefits, and specifications"
                  />
                  {errors.detailedDescription && <p className="mt-1 text-sm text-red-600">{errors.detailedDescription}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="Price ($)"
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    error={errors.price}
                    required
                    placeholder="0.00"
                  />
                  
                  <Input
                    label="Funding Goal (Number of Backers)"
                    id="fundingGoal"
                    name="fundingGoal"
                    type="number"
                    min="1"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    error={errors.fundingGoal}
                    required
                    placeholder="100"
                  />
                </div>
                
                <Input
                  label="Funding Deadline"
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  error={errors.deadline}
                  required
                />
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Home & Garden">Home & Garden</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Toys & Games">Toys & Games</option>
                      <option value="Sports">Sports</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>
                  
                  <Input
                    label="Tags (comma separated)"
                    id="tags"
                    name="tags"
                    type="text"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="innovative, tech, gadget"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate('/creator/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;