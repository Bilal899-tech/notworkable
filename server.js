const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Key Validation Middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  next();
};

// Apply API key validation to all routes
app.use(validateApiKey);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes and middleware
const orderRoutes = require('./routes/orderRoutes');
const checkoutRoutes = require('./routes/checkout');
const authenticateToken = require('./middleware/auth');

// Use routes with authentication
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/checkout', authenticateToken, checkoutRoutes);

// Basic route
app.get('/', (req, res) => {
  res.set('mongodb-site-verification', 'UDYdOozf7kKT1KigWHKUzOdSQ6HGKznS');
  res.send('Eyeglasses E-commerce API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 