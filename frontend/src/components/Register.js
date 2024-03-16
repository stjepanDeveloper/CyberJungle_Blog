// Register.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        email,
        password,
      });
      // Assuming the backend sends back a success message upon successful registration
      if (response.data.msg) {
        alert(response.data.msg); // Alert the user with the success message
        navigate('/'); // Redirect to the home page or to '/login' if you prefer
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(error.response.data.msg || "An error occurred during registration.");
      } else if (error.request) {
        // The request was made but no response was received
        setMessage("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage("Error during request setup: " + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
