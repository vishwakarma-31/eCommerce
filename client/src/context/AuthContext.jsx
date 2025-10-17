import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      // In a real implementation, you would verify the token with the backend
      // For now, we'll just set a mock user
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setCurrentUser(userData);
          // Check if email is verified (this would come from the backend in a real implementation)
          setIsEmailVerified(userData.isVerified || false);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setIsEmailVerified(userData.isVerified || false);
      
      return response;
    } catch (error) {
      // Remove any existing auth data on failed login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsEmailVerified(false);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token: newToken, user: newUser } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      // After registration, email is not yet verified
      setIsEmailVerified(false);
      
      return response;
    } catch (error) {
      // Remove any existing auth data on failed registration
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsEmailVerified(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsEmailVerified(false);
  };

  const updateProfile = async (profileData) => {
    try {
      // In a real implementation, this would call the auth service
      // const response = await authService.updateProfile(profileData);
      // const updatedUser = response.data;
      
      // For now, we'll just update the local state
      const updatedUser = { ...currentUser, ...profileData };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { data: updatedUser };
    } catch (error) {
      throw error;
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      // In a real implementation, this would call the auth service
      // const response = await authService.resendVerificationEmail(email);
      // return response;
      
      // For now, we'll just simulate success
      return { data: { message: 'Verification email resent successfully!' } };
    } catch (error) {
      throw error;
    }
  };

  // Settings methods
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await userService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateEmailPreferences = async (preferences) => {
    try {
      const response = await userService.updateEmailPreferences(preferences);
      
      // Update local user data
      const updatedUser = { ...currentUser, emailPreferences: preferences };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await userService.deleteAccount(password);
      // Log out the user after account deletion
      logout();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    token,
    isAuthenticated,
    isEmailVerified,
    login,
    register,
    logout,
    updateProfile,
    resendVerificationEmail,
    changePassword,
    updateEmailPreferences,
    deleteAccount,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;