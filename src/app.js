const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Security & Parsing Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

// IMPORTANT: Allow all your frontends to connect simultaneously
app.use(cors({ 
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (For Logos/Images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Main API Router
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;