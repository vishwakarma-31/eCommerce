import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartItem from '../cart/CartItem';

// Mock the useCart hook
const mockRemoveFromCart = jest.fn();
const mockUpdateCartQuantity = jest.fn();

jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    removeFromCart: mockRemoveFromCart,
    updateCartQuantity: mockUpdateCartQuantity,
  }),
}));

describe('CartItem', () => {
  const mockItem = {
    _id: 'cart-item-1',
    product: {
      _id: 'product-1',
      title: 'Test Product',
      price: 99.99,
      images: ['https://example.com/image1.jpg'],
    },
    quantity: 2,
  };

  beforeEach(() => {
    mockRemoveFromCart.mockClear();
    mockUpdateCartQuantity.mockClear();
  });

  it('renders cart item information correctly', () => {
    render(<CartItem item={mockItem} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('calculates and displays total price correctly', () => {
    render(<CartItem item={mockItem} />);

    const totalPrice = 99.99 * 2;
    expect(screen.getByText(`$${totalPrice.toFixed(2)}`)).toBeInTheDocument();
  });

  it('calls removeFromCart when remove button is clicked', () => {
    render(<CartItem item={mockItem} />);

    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('cart-item-1');
  });

  it('calls updateCartQuantity when quantity is increased', () => {
    render(<CartItem item={mockItem} />);

    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith('cart-item-1', 3);
  });

  it('calls updateCartQuantity when quantity is decreased', () => {
    render(<CartItem item={mockItem} />);

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith('cart-item-1', 1);
  });

  it('calls removeFromCart when quantity is decreased to 0', () => {
    const itemWithOneQuantity = {
      ...mockItem,
      quantity: 1,
    };

    render(<CartItem item={itemWithOneQuantity} />);

    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('cart-item-1');
  });

  it('displays product image with correct alt text', () => {
    render(<CartItem item={mockItem} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('handles missing product data gracefully', () => {
    const itemWithoutProduct = {
      _id: 'cart-item-1',
      quantity: 2,
    };

    render(<CartItem item={itemWithoutProduct} />);

    // Should not crash and should render something
    expect(screen.getByText('Item')).toBeInTheDocument();
  });
});