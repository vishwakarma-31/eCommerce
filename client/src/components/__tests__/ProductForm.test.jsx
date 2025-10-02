import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductForm from '../ProductForm';

// Mock the AuthContext
const mockAuthContext = {
  user: { role: 'Creator' }
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

// Mock axios for API calls
jest.mock('axios');
import axios from 'axios';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.post.mockResolvedValue({ data: { _id: '123', title: 'Test Product' } });
  });

  it('should render form fields correctly', () => {
    renderWithRouter(<ProductForm />);
    
    expect(screen.getByLabelText('Product Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Target Funding ($)')).toBeInTheDocument();
    expect(screen.getByLabelText('Funding Deadline')).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    renderWithRouter(<ProductForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Create Product' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Product title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Category is required')).toBeInTheDocument();
      expect(screen.getByText('Target funding is required')).toBeInTheDocument();
    });
  });

  it('should validate funding amount is a positive number', async () => {
    renderWithRouter(<ProductForm />);
    
    const fundingInput = screen.getByLabelText('Target Funding ($)');
    fireEvent.change(fundingInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByRole('button', { name: 'Create Product' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Target funding must be a positive number')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    renderWithRouter(<ProductForm />);
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText('Product Title'), {
      target: { value: 'Test Product' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'This is a test product description' }
    });
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Electronics' }
    });
    fireEvent.change(screen.getByLabelText('Target Funding ($)'), {
      target: { value: '1000' }
    });
    fireEvent.change(screen.getByLabelText('Funding Deadline'), {
      target: { value: '2024-12-31' }
    });
    
    const submitButton = screen.getByRole('button', { name: 'Create Product' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/products'),
        expect.objectContaining({
          title: 'Test Product',
          description: 'This is a test product description',
          category: 'Electronics',
          targetFunding: 1000
        }),
        expect.any(Object)
      );
    });
  });
});