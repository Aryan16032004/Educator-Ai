
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

const SignupForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match

    try {
      // Make a POST request to the backend for signup
      const response = await axios.post('/api/v1/users/login', {
        email,
        password,
      });

      // Handle success, such as redirecting to a login page
      console.log('Login successful:', response.data);
      navigate('/dashboard'); // Navigate to login page on successful signup
    } catch (error) {
      // Handle error
      console.error('Error during login:', error.response?.data || error.message);
      setError('An error occurred during login');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center text-gray-800'>Log in</h1>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500'
              required
            />
          </div>
         
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300'>
           Log In
          </button>

          <div className='flex justify-center align-items-center gap-2 mt-4'>
            <p className='inline-block'>Not  Registered?</p>
            <Link to="/">
              <p className='inline-block text-blue-600 hover:underline transition duration-300'>
                Signup Here!
              </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
