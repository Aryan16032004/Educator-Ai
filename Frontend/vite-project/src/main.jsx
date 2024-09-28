import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Dashboard from './Components/Dashboard.jsx';
import Syllabus from './Components/Syllabus.jsx';
import MockTest from './Components/MockTest.jsx';
import { Layout, ProtectedRoute } from './Layout.jsx'; // Import Layout and ProtectedRoute

// Define the router with ProtectedRoute for protected pages
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      {/* Public Routes */}
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path=''
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='syllabus'
        element={
          <ProtectedRoute>
            <Syllabus/>
          </ProtectedRoute>
        }
      />

        <Route
        path='mocktest'
        element={
          <ProtectedRoute>
            <MockTest/>
          </ProtectedRoute>
        }
      />
      
    </Route>

    

    
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
