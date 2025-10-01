import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Backer'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      navigate('/profile');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {errors.general}
              </div>
            </div>
          )}
          
          <Input
            label="Full Name"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          
          <Input
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 border rounded-lg text-center ${
                  formData.role === 'Backer' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'role', value: 'Backer' } })}
              >
                <div className="font-medium">Back Projects</div>
                <div className="text-sm text-gray-500 mt-1">
                  Support innovative ideas
                </div>
              </button>
              <button
                type="button"
                className={`p-4 border rounded-lg text-center ${
                  formData.role === 'Creator' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleChange({ target: { name: 'role', value: 'Creator' } })}
              >
                <div className="font-medium">Create Projects</div>
                <div className="text-sm text-gray-500 mt-1">
                  Pitch your ideas
                </div>
              </button>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Loader size="sm" color="white" /> : 'Sign up'}
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;