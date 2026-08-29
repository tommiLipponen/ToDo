import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../helper/db.js';

const { sign } = jwt;

const createUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);

  return await pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING id, email',
    [email, hashedPassword]
  );
};

const findUserByEmail = async (email) => {
  return await pool.query(
    'SELECT id, email, password FROM account WHERE email = $1',
    [email]
  );
};

const createToken = (user) => {
  return sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await compare(plainPassword, hashedPassword);
};

export { createUser, findUserByEmail, createToken, validatePassword };
