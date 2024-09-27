import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To handle loading state

  // Check authentication state on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check for access token in both localStorage and cookies
        const localStorageToken = localStorage.getItem('accessToken');
        const cookieToken = Cookies.get('accessToken');
        const accessToken = localStorageToken || cookieToken;

        if (accessToken) {
          // Verify token with the server
          await axios.get('/api/v1/users/verify-token', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setIsAuthenticated(true); // Token is valid, user is authenticated
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token validation error:', error.response?.data || error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading after validation check
      }
    };

    validateToken();
  }, []);

  // Login function to set the auth state
  const login = (token) => {
    // Store the token in both localStorage and Cookies
    localStorage.setItem('accessToken', token);
    Cookies.set('accessToken', token);
    setIsAuthenticated(true);
  };

  // Logout function to clear cookies and localStorage, and set auth state
  const logout = async () => {
    try {
      // Remove tokens from both localStorage and cookies
      localStorage.removeItem('accessToken');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setIsAuthenticated(false);
      await axios.post('/api/v1/users/logout'); // Inform server about logout
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
