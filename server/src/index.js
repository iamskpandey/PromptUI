// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/user.routes.js');
const projectRoutes = require('./routes/project.routes.js');


// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

//Connect to MongoDB
connectDB();

// Set up middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in request bodies
app.use(express.urlencoded({ extended: true })); // Allow the server to accept URL-encoded data


// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users',userRoutes);
app.use('/api/projects', projectRoutes);

// Define the port the server will run on
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});