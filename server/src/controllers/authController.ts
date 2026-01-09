import { Request, Response } from 'express';
import { getUserByEmail, createUser } from '../utils/userDB';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { CreateUserDTO, LoginDTO, AuthResponse } from '../types/user';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: CreateUserDTO = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
      return;
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = createUser({ email, password: hashedPassword });

    if (!user) {
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
      });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const response: AuthResponse = {
      user,
      token,
    };

    res.status(201).json({ success: true, data: response });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginDTO = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const user = getUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

export const getCurrentUserController = (req: Request, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    res.json({ success: true, data: { userId: req.user.userId, email: req.user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
};
