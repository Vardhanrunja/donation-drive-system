// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');


// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('DonationDrive API is running...');
});

// Error handling (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
