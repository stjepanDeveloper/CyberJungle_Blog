// Login.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ensure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Attempting login with:', { email, password });
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      if (response.data.token) {
        console.log('Login Successful, token received:', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data)); // Save the token/user data
        auth.setIsAuthenticated(true); // Update the auth state using auth object
        setMessage("Login successful!");
        navigate('/'); // Navigate to the home route
      } else {
        console.log('Login Failed, no token received.');
        setMessage("Login failed. Please try again.");
      }
    } catch (error) {
      console.log('Login Error:', error);
      setMessage(error.response && error.response.data.msg ? error.response.data.msg : "An error occurred during login.");
    }
  };



  // Ensure you use setEmail and setPassword in your input fields to update state
  return (
    <div className="auth-container">
        <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Use setEmail here
              required 
            />
          </div>
          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} // Use setPassword here
              required 
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        <p>New user? <Link to="/register">Click here to register</Link></p> {/* Link used here */}
      </div>
    </div>
    
  );
}

export default Login;

