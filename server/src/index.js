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

const allowedOrigins = [
  'http://localhost:3000', 
  'https://prompt-ui-ten.vercel.app/login', 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from your origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

// Set up middleware
app.use(cors(corsOptions));
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