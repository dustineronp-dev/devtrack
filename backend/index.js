const express = require('express');
const app = express();
const pool = require('./db');

app.get('/', (req, res) => {
  res.send('Hello from DevTrack backend! v2');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
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