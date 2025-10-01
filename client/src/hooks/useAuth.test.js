/**
 * Unit tests for useAuth hook
 */
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';

// Mock AuthContext provider
const mockAuthContext = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
  loading: false
};

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('useAuth Hook', () => {
  it('should return auth context values', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current).toEqual(mockAuthContext);
  });

  it('should call login function', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ data: { token: 'test-token' } });
    mockAuthContext.login = mockLogin;
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should call logout function', () => {
    const mockLogout = jest.fn();
    mockAuthContext.logout = mockLogout;
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logout();
    });
    
    expect(mockLogout).toHaveBeenCalled();
  });
});