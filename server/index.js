import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const port = 3001;
const app = express();
const { Pool } = pg;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const openDb = () => {
  return new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'todo',
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT || 5432),
  });
};

app.get('/tasks', (req, res) => {
  const pool = openDb();

  pool.query('SELECT * FROM task ORDER BY id ASC', (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json(result.rows);
  });
});

app.post('/tasks', (req, res) => {
  const pool = openDb();
  const { task } = req.body;

  if (!task || typeof task.description !== 'string') {
    return res.status(400).json({ error: 'Task is required' });
  }

  const description = task.description.trim();

  if (!description) {
    return res.status(400).json({ error: 'Task is required' });
  }

  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [description],
    (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      return res.status(201).json({
        id: result.rows[0].id,
        description: result.rows[0].description,
      });
    }
  );
});

app.delete('/tasks/:id', (req, res) => {
  const pool = openDb();
  const { id } = req.params;

  pool.query('DELETE FROM task WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ id: Number(id) });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
