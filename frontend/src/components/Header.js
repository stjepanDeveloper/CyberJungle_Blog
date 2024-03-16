//Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust this path as necessary
import authService from './AuthService';


const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // Destructure `isAuthenticated` from the context
  const navigate = useNavigate();

  const handleLogout = () => {
    
    // Assuming authService.logout() clears the user from localStorage
    authService.logout();
    setIsAuthenticated(false); // Update authentication state
    navigate('/'); // Navigate to the homepage or read-only view
  };


  return (
    <header className="site-header">
    <div className="brand-container">
      <h1 className="navbar-brand">Blogapp</h1>
        < svg viewBox="0 0 512 512" className="logo-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M217.6 96.1c-12.95-.625-24.66 9.156-25.52 22.37C191.2 131.7 201.2 143.1 214.4 143.1c79.53 5.188 148.4 74.09 153.6 153.6c.8281 12.69 11.39 22.43 23.94 22.43c.5156 0 1.047-.0313 1.578-.0625c13.22-.8438 23.25-12.28 22.39-25.5C409.3 191.8 320.3 102.8 217.6 96.1zM224 0C206.3 0 192 14.31 192 32s14.33 32 32 32c123.5 0 224 100.5 224 224c0 17.69 14.33 32 32 32s32-14.31 32-32C512 129.2 382.8 0 224 0zM172.3 226.8C157.7 223.9 144 235.8 144 250.6v50.37c0 10.25 7.127 18.37 16.75 21.1c18.13 6.75 31.26 24.38 31.26 44.1c0 26.5-21.5 47.1-48.01 47.1c-26.5 0-48.01-21.5-48.01-47.1V120c0-13.25-10.75-23.1-24.01-23.1l-48.01 .0076C10.75 96.02 0 106.8 0 120v247.1c0 89.5 82.14 160.2 175 140.7c54.38-11.5 98.27-55.5 109.8-109.7C302.2 316.1 247.8 241.8 172.3 226.8z"/>
        </svg>
      </div>
      
      <nav className="site-nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
          {isAuthenticated && (
            <>
              <li className="nav-item"><Link to="/create" className="nav-link">Create Post</Link></li>
              {/* Any other protected links */}
            </>
          )}
          <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
          <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
          {!isAuthenticated ? (
            <>
              <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
              <li className="nav-item"><Link to="/register" className="nav-link">Register</Link></li>
            </>
          ) : (
            <li className="nav-item logout-item">
              {isAuthenticated && (
                <button onClick={handleLogout} className="logout-button">Logout</button>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;


