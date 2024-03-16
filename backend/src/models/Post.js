// src/models/Post.js

const mongoose = require('mongoose');

// Define the schema for the Post model
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
});

// Create a model based on the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;