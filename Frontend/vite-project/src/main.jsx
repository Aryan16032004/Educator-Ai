import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Login from './Components/Login.jsx'
import Signup from './Components/Signup.jsx'
import Layout from './Layout.jsx'
import Dashboard from './Components/Dashboard.jsx'
import MockTest from './Components/MockTest.jsx'



const router =createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
        {/* Use relative paths for nested routes */}
        <Route path='login' element={<Login/>} />
        <Route path='' element={<Signup/>} />
        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='mocktest' element={<MockTest/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
