const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from DevTrack backend! v2');
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!', userId: req.userId });
});

app.post('/applications', authMiddleware, async (req, res) => {
  const {
    company_name,
    job_title,
    job_url,
    applied_gmail,
    date_applied,
    status = 'Applied',
    source,
    notes,
    follow_up_date
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO job_applications 
        (user_id, company_name, job_title, job_url, applied_gmail, date_applied, status, source, notes, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.userId, company_name, job_title, job_url, applied_gmail, date_applied, status, source, notes, follow_up_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

app.get('/applications', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_applications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.get('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_applications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

app.put('/applications/:id', authMiddleware, async (req, res) => {
  const {
    company_name,
    job_title,
    job_url,
    applied_gmail,
    date_applied,
    status,
    source,
    notes,
    follow_up_date
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE job_applications 
       SET company_name = $1, job_title = $2, job_url = $3, applied_gmail = $4, 
           date_applied = $5, status = $6, source = $7, notes = $8, follow_up_date = $9
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [company_name, job_title, job_url, applied_gmail, date_applied, status, source, notes, follow_up_date, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

app.delete('/applications/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});