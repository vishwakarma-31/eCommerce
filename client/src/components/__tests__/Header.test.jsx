import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn()
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation links correctly', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('should show login button when user is not authenticated', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should show user menu when user is authenticated', () => {
    mockAuthContext.user = {
      name: 'Test User',
      role: 'Backer'
    };
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call logout function when logout button is clicked', () => {
    mockAuthContext.user = {
      name: 'Test User',
      role: 'Backer'
    };
    
    renderWithRouter(<Header />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1);
  });
});