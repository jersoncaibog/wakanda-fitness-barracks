const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const memberRoutes = require('./routes/memberRoutes');
const recordRoutes = require('./routes/recordRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../../')));

// API Routes
app.use('/api/members', memberRoutes);
app.use('/api/records', recordRoutes);

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 