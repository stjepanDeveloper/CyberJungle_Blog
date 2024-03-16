// PostsComponent.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PostsComponent = ({ posts, handleVote, handleDelete }) => {
  const { isAuthenticated } = useAuth();
  console.log('Is Authenticated:', isAuthenticated);
  return (
    <div className="post-container">
      {posts.map(post => (
        <div key={post._id}>
          {/* Post body */}
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>

          <div className="vote-container">
            {/* Voting buttons */}
            <button onClick={() => handleVote(post._id, 'upvote')}>👍 {post.upvotes}</button>
            <button onClick={() => handleVote(post._id, 'downvote')}>👎 {post.downvotes}</button>
          </div>

          <span className="post-details">{new Date(post.date).toLocaleString()}</span>

          {/* Conditionally render Edit and Delete buttons if authenticated */}
          {isAuthenticated && (
            
            <>
              <Link className="edit-btn" to={`/edit/${post._id}`}>Edit</Link>
              <button className="delete-btn" onClick={() => handleDelete(post._id)}>Delete</button>
            </>
          )}
          
          <hr />
        </div>
      ))}
    </div>
  );
};


export default PostsComponent;