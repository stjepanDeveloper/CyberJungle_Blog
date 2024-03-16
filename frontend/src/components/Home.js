// Home.js

import React, { useState, useEffect, useCallback } from 'react';
import PostsComponent from './PostsComponent';


const Home = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'date', order: 'desc' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const fetchPosts = useCallback(async () => {
    let query = `/api/posts?sortBy=${sortConfig.sortBy}&order=${sortConfig.order}&page=${currentPage}&limit=5`;
    if (searchKeyword) {
      query += `&search=${encodeURIComponent(searchKeyword)}`; // Ensure the keyword is URL-encoded
    }
    const response = await fetch(query);
    const data = await response.json();
    setPosts(data.posts);
    setTotalPages(data.totalPages);
  }, [sortConfig, currentPage, searchKeyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue); // Update searchKeyword to trigger the search
  };

  const handleVote = async (postId, voteType) => {
    const url = `http://localhost:5000/posts/${postId}/${voteType}`;
    try {
      const response = await fetch(url, { method: 'POST' });
      if (response.ok) {
      // Fetch posts again to update the UI with the new vote counts
      fetchPosts();
      alert('Thanks for your feedback!')
    } else {
      console.error("Error voting", await response.text());
    }
  } catch (error) {
    console.error("Error voting", error);
  }
};

  useEffect(() => {
    
    fetchPosts();
  }, [fetchPosts]); 


  const handleSortChange = (sortBy, order) => {
    setSortConfig({ sortBy, order });
  };

  const handleDelete = async (postId) => {
    // Confirm with the user before deleting
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        // Send a DELETE request to the backend
        const response = await fetch(`/api/delete/${postId}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          // If the delete was successful, filter out the deleted post from the posts state
          const updatedPosts = posts.filter(post => post._id !== postId);
          setPosts(updatedPosts);
  
          // Display a success message
          alert("Successfully deleted the post!");
        } else {
          // Handle server errors or unsuccessful deletion
          console.error('Failed to delete the post:', response.statusText);
          alert("An error occurred. Please try again.");
        }
      } catch (error) {
        // Catch and handle any errors that occur during the fetch operation
        console.error('Error deleting post:', error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1 className="home-title">The CyberJungle Blog</h1>
      {/* Include sorting controls here */}
      <div className= "sorting-container">
        <button onClick={() => handleSortChange('date', 'desc')}>Newest First</button>
        <button onClick={() => handleSortChange('date', 'asc')}>Oldest First</button>
        <button onClick={() => handleSortChange('title', 'asc')}>Title A-Z</button>
        <button onClick={() => handleSortChange('title', 'desc')}>Title Z-A</button>
      </div>
      
      {/* Search form */}
      <form
        onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search posts..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Post listing and search form upper */}
      <div className="pagination-container">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        )}
        {/* Display current page number */}
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>

      <PostsComponent posts={posts} handleVote={handleVote} handleDelete={handleDelete} isAuthenticated={isAuthenticated} />

      {/* Post listing and search form lower */}
      <div className="pagination-container">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        )}
        {/* Display current page number */}
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>

    </div>
  );
};

export default Home;

