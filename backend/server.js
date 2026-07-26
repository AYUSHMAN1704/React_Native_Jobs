require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super_secret_jwt_key_123'; // In production, this goes in .env

// Neon PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ============ AUTH MIDDLEWARE ============
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ============ DATABASE INIT ============
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        username VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add username column if it doesn't exist (for existing tables)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applied_jobs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        job_id VARCHAR(255) NOT NULL,
        job_title VARCHAR(500),
        employer_name VARCHAR(255),
        employer_logo TEXT,
        job_country VARCHAR(255),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      );
    `);

    console.log('✅ Database tables verified/created successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }
}

initDB();

// ============ AUTH ROUTES ============

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, username',
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, username: user.username }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username FROM users WHERE id = $1', [req.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set username
app.put('/username', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username || username.trim().length < 2) {
    return res.status(400).json({ error: 'Username must be at least 2 characters' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username',
      [username.trim(), req.userId]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ APPLIED JOBS ROUTES ============

// Apply for a job
app.post('/applied-jobs', authMiddleware, async (req, res) => {
  const { job_id, job_title, employer_name, employer_logo, job_country } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: 'job_id is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applied_jobs (user_id, job_id, job_title, employer_name, employer_logo, job_country)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.userId, job_id, job_title, employer_name, employer_logo, job_country]
    );
    res.status(201).json({ appliedJob: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'You have already applied for this job' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all applied jobs for the logged-in user
app.get('/applied-jobs', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applied_jobs WHERE user_id = $1 ORDER BY applied_at DESC',
      [req.userId]
    );
    res.json({ appliedJobs: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Un-apply from a job
app.delete('/applied-jobs/:jobId', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM applied_jobs WHERE user_id = $1 AND job_id = $2 RETURNING *',
      [req.userId, req.params.jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Applied job not found' });
    }

    res.json({ message: 'Successfully removed application' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
