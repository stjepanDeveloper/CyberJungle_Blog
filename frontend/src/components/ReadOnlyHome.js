// ReadOnlyHome.js

import React, { useState, useEffect, useCallback } from 'react';
import PostsComponent from './PostsComponent';

const ReadOnlyHome = () => {
  const [posts, setPosts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'date', order: 'desc' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


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

  useEffect(() => {

    fetchPosts();
  }, [fetchPosts]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchKeyword(inputValue); // Update searchKeyword to trigger the search
  };

  const handleSortChange = (sortBy, order) => {
    setSortConfig({ sortBy, order });
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search posts..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Pagination and PostsComponent, without handleVote and handleDelete */}
      <div className="pagination-container">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        )}
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>

      {/* Note: We're not passing handleVote or handleDelete to PostsComponent */}
      <PostsComponent posts={posts} handleVote={handleVote} isAuthenticated={false} />

      <div className="pagination-container">
        {currentPage > 1 && (
          <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        )}
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default ReadOnlyHome;
