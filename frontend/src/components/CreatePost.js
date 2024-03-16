import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: post.title, content: post.content })
      });
      if (response.ok) {
        alert('Post has been successfully created!');
        navigate('/'); // Redirect to the homepage or another page
      } else {
        alert('Failed to create the post.');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-title">Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            className="form-control"
            type="text"
            name="title" // Note: Adjusted to match state structure
            value={post.title}
            onChange={handleChange}
          />
          <label>Post</label>
          <textarea
            className="form-control"
            name="content" // Note: Adjusted to match state structure
            rows="5"
            value={post.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <button className="btn btn-primary" type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
