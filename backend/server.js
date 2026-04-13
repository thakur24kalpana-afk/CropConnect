const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
const db = new Database(path.join(__dirname, 'database', 'cropconnect.db'));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://cropconnect-gamma.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Get all crops (for better-sqlite3)
app.get('/api/crops', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM crops ORDER BY createdAt DESC').all();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching crops:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Database path: ${path.join(__dirname, 'database', 'cropconnect.db')}`);
});