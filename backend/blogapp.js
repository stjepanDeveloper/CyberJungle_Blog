// blogapp.js

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const cors = require('cors');
const Post = require('./src/models/Post');
const User = require('./src/models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));

const mongoDB_URI = process.env.MONGODB_URI;
if (!mongoDB_URI) {
  console.error('MONGODB_URI is not set in environment variables');
  process.exit(1); // Exit the process if the database URI is not set
}
mongoose.connect(mongoDB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('Error connecting to MongoDB', err.message);
  process.exit(1)
});

app.use(express.json());
app.use(cors());

// New logging middleware for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

const token = jwt.sign({ data: 'yourData' }, process.env.JWT_SECRET, { expiresIn: '1h' });

let posts = [
    { title: "The Rise of Chatbots", content: "In the age of AI, chatbots have become our digital companions. Discover how these clever bots are changing the way we interact online, from providing customer support to engaging in casual conversations. Join the chatbot revolution!" },
    { title: "Journey to the Red Planet", content: "Embark on a cosmic adventure as we delve into the latest updates on Mars exploration. From the perseverance of rovers to the dreams of human colonization, we explore the mysteries of the Red Planet. Buckle up, space enthusiasts!" },
    { title: "The Unstoppable Comeback", content: "Witness the heart-stopping moments of the greatest sports comebacks in history. From the underdog stories to the miraculous turnarounds, we celebrate the resilience and determination that define these epic sporting moments." },
    { title: "Coding: The Art of Problem-Solving", content: "Dive into the world of programming, where lines of code transform into elegant solutions. Explore the art of problem-solving, the joy of debugging, and the thrill of crafting software that makes an impact. Coding is not just a skill; it's an art form." },
    { title: "Navigating the Digital Jungle", content: "In the vast digital jungle of social media, discover the latest trends, pitfalls, and success stories. From viral memes to impactful campaigns, we explore the ever-evolving landscape of online interaction. Grab your virtual binoculars and join the expedition!" }
  ];



// Fetch all posts


// New catch-all route for debugging
app.get('*', (req, res) => {
  res.status(404).send('Page not found. Are you accessing the correct route?');
});

app.get('/api/posts', async (req, res) => {
    // Default sorting parameters
    let sortField = 'date';
    let sortOrder = -1; // -1 for descending, 1 for ascending
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 5;
    let searchQuery = {};

    // Update sorting parameters if provided in query string
    if (req.query.sortBy) {
        sortField = req.query.sortBy === 'title' ? 'title' : 'date';
    }
    if (req.query.order) {
        sortOrder = req.query.order === 'asc' ? 1 : -1;
    }
    if (req.query.search) {
        //Create a search query to find posts that contain the key word
        searchQuery = {
            $or: [
                {title: {$regex: req.query.search, $options: 'i'} },
                {content : {$regex: req.query.search, $options: 'i'} }

            ]
        };
    }

    app.get('/test', (req, res) => {
      res.send('Test route is working');
    });

    // Create a sort object using the field and order
    let sortOptions = {};
    sortOptions[sortField] = sortOrder;

    try {
        const posts = await Post.find(searchQuery)
        .sort( sortOptions )
        .skip((page - 1) * limit)
        .limit(limit);

        const totalPosts = await Post.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({posts, totalPages, currentPage: page});
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Internal Server Error'});
    }
});


app.get('/about', (req, res) => {
    // Descriptive text about the blog
    const aboutContent = "Welcome to The CyberJungle Blog, your go-to source for a wild ride through the realms of technology, AI, space exploration, sports, programming, and social media. Our team of passionate writers is dedicated to bringing you captivating stories and insights from the digital jungle. Join us on this adventure into the future!"

    // Render the about view and pass the about content
    res.render('about', { aboutContent: aboutContent });
});


app.get('/contact', (req, res) => {
    // Render the contact view
    const contactContent = "If you want to contact me, here is the information below:"
    res.render('contact', { contactContent: contactContent });
});


app.get('/create', (req, res) => {
    res.render('makeposts');
});

app.post('/api/create', async (req, res) => {
    try {
      const { title, content } = req.body;
      const newPost = new Post({ title, content });
      await newPost.save();
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create the post' });
    }
  });

  
  
// GET route to get the JSON data about the post
app.get('/api/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Send back the post data as JSON
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST route to handle form submission for editing a post
app.post('/api/edit/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log(`Editing post with ID: ${postId}`); // Log the post ID being edited
        console.log('Received data:', req.body); // Log the data received to update the post

        const updatedTitle = req.body.title;
        const updatedContent = req.body.content;

        const post = await Post.findByIdAndUpdate(postId, { title: updatedTitle, content: updatedContent }, { new: true });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log('Updated post:', post); // Log the updated post object
        res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Failed to update post:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete a post
app.delete('/api/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post by ID and delete it
        await Post.findByIdAndDelete(postId);

        // Instead of redirecting, send a JSON response
        res.status(200).json({ message: 'Post successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

    // Endpoint to upvote a post
    app.post('/posts/:id/upvote', async (req, res) => {
        try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } });
        res.status(200).send("Upvoted successfully");
        } catch (error) {
        res.status(500).send(error);
        }
    });
  
    // Endpoint to downvote a post
    app.post('/posts/:id/downvote', async (req, res) => {
        try {
        await Post.findByIdAndUpdate(req.params.id, { $inc: { downvotes: 1 } });
        res.status(200).send("Downvoted successfully");
        } catch (error) {
        res.status(500).send(error);
        }
    });

    app.post('/register', async (req, res) => {
        try {
          const { email, password } = req.body;
          
          // Check if user already exists
          let user = await User.findOne({ email });
          if (user) {
            return res.status(400).json({ msg: "User already exists" });
          }
      
          // Create a new user
          user = new User({
            email,
            password // The password will be hashed automatically
          });
      
          await user.save();
          res.status(201).json({ msg: "User created successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Server error" });
        }
      });

      app.post('/login', async (req, res) => {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email });
      
          if (!user) {
            return res.status(404).json({ msg: "User not found" });
          }
      
          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
          }
      
          // Generate token
          const token = jwt.sign({ userId: user._id }, 'YourSecretKey', { expiresIn: '1h' }); // Use an environment variable for YourSecretKey
      
          res.json({ token });
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Server error during authentication" });
        }
      });
    
    








// Start the server
const port = process.env.PORT || 5000; // You can change the port as needed
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});


