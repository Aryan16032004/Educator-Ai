import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication state on component mount
  useEffect(() => {
    const validateToken = async () => {
      console.log("Validating token...");
      try {
        const accessToken = Cookies.get('accessToken');
        console.log("AccessToken from cookie in useEffect:", accessToken);  // Check the token here

        if (accessToken) {
          console.log("Sending request to validate token...");
          const response = await axios.get('/api/v1/users/verify-token', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log("Token validation response:", response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token validation error:', error.response?.data || error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log("Loading state set to false, isAuthenticated:", isAuthenticated);
      }
    };

    validateToken();
  }, []);

  // Login function to set the auth state
  const login = (token) => {
    console.log("Login successful, setting token and state.");
    Cookies.set('accessToken', token, { sameSite: 'Strict', secure: true });
    console.log("Access token set in cookies:", Cookies.get('accessToken'));  // Confirm if set correctly
    setIsAuthenticated(true);
  };

  // Logout function to clear cookies and set auth state
  const logout = async () => {
    try {
      Cookies.remove('accessToken');
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
