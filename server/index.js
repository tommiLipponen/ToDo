import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import todoRouter from './routes/todoRouter.js';

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/tasks', todoRouter);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  if (statusCode >= 500) {
    console.error(err.message);
  }

  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
