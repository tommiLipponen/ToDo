import { ApiError } from '../helper/ApiError.js';
import {
  createUser,
  findUserByEmail,
  createToken,
  validatePassword,
} from '../models/Account.js';

const signUp = async (req, res, next) => {
  try {
    const input = req.body.user ?? req.body;
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      return next(new ApiError('Email and password are required', 400));
    }

    const result = await createUser(email, password);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error?.code === '23505') {
      return next(new ApiError('User already exists', 409));
    }

    return next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const input = req.body.user ?? req.body;
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || !password) {
      return next(new ApiError('Email and password are required', 400));
    }

    const result = await findUserByEmail(email);
    const dbUser = result.rows[0];

    if (!dbUser || !(await validatePassword(password, dbUser.password))) {
      return next(new ApiError('Invalid email or password', 401));
    }

    const token = createToken(dbUser);

    return res.status(200).json({
      id: dbUser.id,
      email: dbUser.email,
      token,
    });
  } catch (error) {
    return next(error);
  }
};

export { signUp, signIn };
