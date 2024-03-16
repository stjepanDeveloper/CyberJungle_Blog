import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const [post, setPost] = useState({ title: '', content: '' });
  const { postId } = useParams(); // Get the postId from the URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        const data = await response.json();
        setPost({ title: data.title, content: data.content });
      } catch (error) {
        console.error('Failed to fetch post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/edit/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: post.title, content: post.content }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/'); // Redirect to the home page after successful update
      } else {
        alert('Failed to update the post.');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Function to handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  return (
    <div>
      <h1 className="edit-title">Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
          />
          <label>Post</label>
          <textarea
            className="form-control"
            name="content"
            rows="5"
            value={post.content}
            onChange={handleChange}
          ></textarea>
        </div>
        <button className="btn btn-primary" type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditPost;
