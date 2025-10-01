/**
 * Integration tests for HomePage component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock child components
jest.mock('../components/product/ProductGrid', () => {
  return function MockProductGrid({ products }) {
    return <div data-testid="product-grid">{products?.length || 0} products</div>;
  };
});

jest.mock('../components/product/CreatorSpotlight', () => {
  return function MockCreatorSpotlight({ creators }) {
    return <div data-testid="creator-spotlight">{creators?.length || 0} creators</div>;
  };
});

// Mock productService
jest.mock('../services/productService', () => ({
  getProducts: jest.fn().mockResolvedValue({
    data: {
      products: [
        { _id: '1', title: 'Product 1' },
        { _id: '2', title: 'Product 2' }
      ]
    }
  })
}));

describe('HomePage Component', () => {
  it('should render homepage with hero section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Innovate. Fund. Create./i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Become a Creator/i)).toBeInTheDocument();
  });

  it('should display featured products section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
  });

  it('should display creator spotlight section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Creator Spotlight/i)).toBeInTheDocument();
    expect(screen.getByTestId('creator-spotlight')).toBeInTheDocument();
  });

  it('should display trending products section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Trending Now/i)).toBeInTheDocument();
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
  });
});