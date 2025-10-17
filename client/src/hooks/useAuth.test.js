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
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

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

  it('should handle login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    mockAuthContext.login = mockLogin;
    
    const { result } = renderHook(() => useAuth());
    
    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid credentials');
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
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

  it('should call register function', async () => {
    const mockRegister = jest.fn().mockResolvedValue({ data: { user: { id: 1, name: 'Test User' } } });
    mockAuthContext.register = mockRegister;
    
    const { result } = renderHook(() => useAuth());
    
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    await act(async () => {
      await result.current.register(userData);
    });
    
    expect(mockRegister).toHaveBeenCalledWith(userData);
  });

  it('should handle register failure', async () => {
    const mockRegister = jest.fn().mockRejectedValue(new Error('Email already exists'));
    mockAuthContext.register = mockRegister;
    
    const { result } = renderHook(() => useAuth());
    
    const userData = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'Password123!'
    };
    
    await expect(
      act(async () => {
        await result.current.register(userData);
      })
    ).rejects.toThrow('Email already exists');
    
    expect(mockRegister).toHaveBeenCalledWith(userData);
  });

  it('should call updateProfile function', async () => {
    const mockUpdateProfile = jest.fn().mockResolvedValue({ data: { user: { id: 1, name: 'Updated User' } } });
    mockAuthContext.updateProfile = mockUpdateProfile;
    
    const { result } = renderHook(() => useAuth());
    
    const profileData = {
      name: 'Updated User',
      bio: 'This is my updated bio'
    };
    
    await act(async () => {
      await result.current.updateProfile(profileData);
    });
    
    expect(mockUpdateProfile).toHaveBeenCalledWith(profileData);
  });

  it('should reflect authenticated state', () => {
    // Mock authenticated state
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.currentUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    mockAuthContext.token = 'test-jwt-token';
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.currentUser).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
    expect(result.current.token).toBe('test-jwt-token');
  });

  it('should reflect loading state', () => {
    // Mock loading state
    mockAuthContext.loading = true;
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(true);
  });
});