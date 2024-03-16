//AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) { // Assuming your token is stored under the 'token' key
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);