const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try with provided URI first
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB using provided URI');
    } catch (err) {
      console.log('Could not connect to MongoDB using provided URI:', err.message);
      
      // Fall back to in-memory MongoDB for development
      console.log('Starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log('Connected to in-memory MongoDB for development');
      
      // Add some debug information
      console.log('This is a development setup using in-memory MongoDB.');
      console.log('All data will be lost when the server restarts.');
    }
  } catch (error) {
    console.error('Failed to connect to any MongoDB instance:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

// Start server
const PORT = process.env.PORT || 5000;

// Connect to DB before starting server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 