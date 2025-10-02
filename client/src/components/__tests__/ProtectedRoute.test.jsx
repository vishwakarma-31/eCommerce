import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  loading: false
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext
}));

const TestComponent = () => <div>Protected Content</div>;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockAuthContext.user = null;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    // Should redirect to login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should render children when user is authenticated', () => {
    mockAuthContext.user = { name: 'Test User', role: 'Backer' };
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show loading state when authentication is loading', () => {
    mockAuthContext.user = null;
    mockAuthContext.loading = true;
    
    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
    
    // Should show loading state (in a real app, this might be a spinner)
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});