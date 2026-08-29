import { Router } from 'express';
import { pool } from '../helper/db.js';

const router = Router();

router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task ORDER BY id ASC', (err, result) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(result.rows || []);
  });
});

router.post('/', (req, res, next) => {
  const { task } = req.body;

  if (!task || typeof task.description !== 'string') {
    const error = new Error('Task is required');
    error.status = 400;
    return next(error);
  }

  const description = task.description.trim();

  if (!description) {
    const error = new Error('Task is required');
    error.status = 400;
    return next(error);
  }

  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [description],
    (err, result) => {
      if (err) {
        return next(err);
      }

      return res.status(201).json({
        id: result.rows[0].id,
        description: result.rows[0].description,
      });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  pool.query('DELETE FROM task WHERE id = $1', [id], (err, result) => {
    if (err) {
      return next(err);
    }

    if (result.rowCount === 0) {
      const error = new Error('Task not found');
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({ id: Number(id) });
  });
});

export default router;
