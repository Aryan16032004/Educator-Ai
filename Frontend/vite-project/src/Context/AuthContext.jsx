import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication state on component mount
  useEffect(() => {
    const validateToken = async () => {
      // console.log("Validating token...");
      try {
        const accessToken = localStorage.getItem('accessToken');
        // console.log("AccessToken from localStorage in useEffect:", accessToken);  // Check the token here

        if (accessToken) {
          // console.log("Sending request to validate token...");
          const response = await axios.get('/api/v1/users/verify-token', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // console.log("Token validation response:", response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token validation error:', error.response?.data || error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        // console.log("Loading state set to false, isAuthenticated:", isAuthenticated);
      }
    };

    validateToken();
  }, []);

  // Login function to set the auth state
  const login = (token) => {
    // console.log("Login successful, setting token and state.");
    localStorage.setItem('accessToken', token);
    // console.log("Access token set in localStorage:", localStorage.getItem('accessToken'));  // Confirm if set correctly
    setIsAuthenticated(true);
  };

  // Logout function to clear localStorage and set auth state
  const logout = async () => {
    try {
      localStorage.removeItem('accessToken');
      setIsAuthenticated(false);
      await axios.post('/api/v1/users/logout');
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
