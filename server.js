const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Design detail pages - must come before 404 handler
app.get('/designs/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

// API routes will be added here later
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Test database connection on startup
const db = require('./database/db');
db.query('SELECT NOW()')
    .then(() => console.log('✅ Database connection verified'))
    .catch(err => console.error('❌ Database connection failed:', err.message));

// 404 handler - will be implemented in feature #5
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`🚀 LoftVision server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});

module.exports = app;