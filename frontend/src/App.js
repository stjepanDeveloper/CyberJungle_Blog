//App.js 

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import EditPost from './components/EditPost';
import CreatePost from './components/CreatePost';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';
import ReadOnlyHome from './components/ReadOnlyHome';
import ProtectedRoute from './components/ProtectedRoute';



function App() {

  return (
    <AuthProvider>
        <Router>
          <Header />
            <Routes>
              {/* Direct users based on authentication status */}
              <Route path="/" element={<Home />} />
              <Route path="/readonlyhome" element={<ReadOnlyHome />} />

              

              {/* Use ProtectedRoute as a wrapper for protected components */}
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreatePost />
                </ProtectedRoute>
              }/>
              <Route path="/edit/:postId" element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }/>

              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

            </Routes>
          <Footer />
        </Router>
    </AuthProvider>
  );
}

export default App;
