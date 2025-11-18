const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow app to accept JSON
//app.use(express.static(path.join(__dirname, 'dist')));

// --- Define API Routes ---
app.use('/api', require('./routes/api'));

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- React Catch-All Route ---
// This MUST be AFTER your API routes
app.get('/', (req, res) => {
  res.send('PiyushDhara API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});