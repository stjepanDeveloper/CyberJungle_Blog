// src/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, deletePost, updatePost } = require('../controllers/postController');

router.get('/posts', getPosts);
router.post('/posts', createPost);
// Add other routes here

module.exports = router;

