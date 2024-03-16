import React, { useState, useEffect } from 'react';

const PostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'date', order: 'desc' });

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/posts?sortBy=${sortConfig.sortBy}&order=${sortConfig.order}`);
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, [sortConfig]);

  const handleSortChange = (sortBy, order) => {
    setSortConfig({ sortBy, order });
  };

  return (
    <div>
      {/* Sorting controls */}
      <div>
        <button onClick={() => handleSortChange('date', 'desc')}>Newest First</button>
        <button onClick={() => handleSortChange('date', 'asc')}>Oldest First</button>
        <button onClick={() => handleSortChange('title', 'asc')}>Title A-Z</button>
        <button onClick={() => handleSortChange('title', 'desc')}>Title Z-A</button>
      </div>

      {/* Post list */}
      <div>
        {posts.map(post => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <span>{new Date(post.date).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsComponent;
