// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.route'); // We will create this

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cookieParser()); // Use cookie-parser middleware
app.use(cors({
    origin: 'http://localhost:3001', // Your React app's URL
    credentials: true // Crucial for sending/receiving cookies
}));

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


    
// Routes
app.use('/client/auth', authRouter); // Use the router you'll define

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Global Error Handling Middleware (MUST be last middleware)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));