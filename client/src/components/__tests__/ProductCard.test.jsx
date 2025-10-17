import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../product/ProductCard';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock the useCart hook
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    cartItems: [],
    addToCart: jest.fn(),
  }),
}));

// Mock the useWishlist hook
jest.mock('../../context/WishlistContext', () => ({
  useWishlist: () => ({
    wishlistItems: [],
    addToWishlist: jest.fn(),
  }),
}));

describe('ProductCard', () => {
  const mockProduct = {
    _id: '1',
    title: 'Test Product',
    description: 'This is a test product',
    price: 99.99,
    images: ['https://example.com/image1.jpg'],
    ratings: 4.5,
    sales: 100,
    stock: 10,
    creator: {
      name: 'Test Creator',
    },
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('100 sold')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('displays "Out of Stock" when stock is 0', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stock: 0,
    };

    render(
      <BrowserRouter>
        <ProductCard product={outOfStockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('navigates to product detail page when card is clicked', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const card = screen.getByTestId('product-card');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/product/1');
  });

  it('adds product to cart when "Add to Cart" button is clicked', () => {
    const mockAddToCart = jest.fn();
    
    // Re-mock the useCart hook with the mock function
    jest.mock('../../context/CartContext', () => ({
      useCart: () => ({
        cartItems: [],
        addToCart: mockAddToCart,
      }),
    }));

    // Clear the module cache to apply the new mock
    jest.resetModules();

    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct._id, 1);
  });

  it('adds product to wishlist when wishlist icon is clicked', () => {
    const mockAddToWishlist = jest.fn();
    
    // Re-mock the useWishlist hook with the mock function
    jest.mock('../../context/WishlistContext', () => ({
      useWishlist: () => ({
        wishlistItems: [],
        addToWishlist: mockAddToWishlist,
      }),
    }));

    // Clear the module cache to apply the new mock
    jest.resetModules();

    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    const wishlistIcon = screen.getByTestId('wishlist-icon');
    fireEvent.click(wishlistIcon);

    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct._id);
  });

  it('displays creator name when showCreator prop is true', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} showCreator={true} />
      </BrowserRouter>
    );

    expect(screen.getByText('by Test Creator')).toBeInTheDocument();
  });

  it('does not display creator name when showCreator prop is false', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} showCreator={false} />
      </BrowserRouter>
    );

    expect(screen.queryByText('by Test Creator')).not.toBeInTheDocument();
  });
});