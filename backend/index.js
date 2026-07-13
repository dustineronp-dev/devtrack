const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');

const app = express();

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

app.listen(3000, () => {
  console.log('Server running on port 3000');
});