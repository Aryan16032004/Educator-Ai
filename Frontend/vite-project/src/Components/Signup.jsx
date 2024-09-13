import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  // State to store form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to the backend for signup
      const response = await axios.post('/api/v1/users/register', {
        username,
        email,
        password,
        fullname
      });

      // Handle success, such as redirecting to a login page
      console.log('Signup successful:', response.data);
      // Redirect to login page or show success message
    } catch (error) {
      // Handle error (e.g., user already exists)
      console.error('Error during signup:', error.response?.data || error.message);                                
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="signupFullname" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="signupFullname"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)} // Update fullname state
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signupUsername" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="signupUsername"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signupEmail" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="signupEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signupPassword" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="signupPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signupConfirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="signupConfirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
