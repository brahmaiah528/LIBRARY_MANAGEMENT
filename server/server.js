const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const seedData = require('./seed');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check and root endpoints
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the Library Management System REST API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      users: '/api/users',
      issues: '/api/issues',
      dashboard: '/api/dashboard',
      reports: '/api/reports',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Library Management System API' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
const startServer = async () => {
  await connectDB();

  // Check if database needs initial seeding
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Auto-seeding initial default data...');
      await seedData();
    }
  } catch (err) {
    console.error('Auto-seed check error:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Library Management Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
};

startServer();
