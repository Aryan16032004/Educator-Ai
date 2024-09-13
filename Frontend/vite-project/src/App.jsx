// import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Dashboard from './Components/Dashboard.jsx';

import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/api/v1/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
