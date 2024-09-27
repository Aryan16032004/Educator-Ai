import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ModalProvider } from './Context/ModalContext.jsx';
import Header from './Components/Header';
import { AuthProvider, AuthContext } from './Context/AuthContext.jsx';

// ProtectedRoute component to handle protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function Layout() {
  return (
    <div>
      <AuthProvider>
        <ModalProvider>
          <Header />
          <Outlet />
        </ModalProvider>
      </AuthProvider>
    </div>
  );
}

export { Layout, ProtectedRoute };
